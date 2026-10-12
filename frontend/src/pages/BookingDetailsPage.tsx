import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { bookingService } from "../api/bookingService";
import { paymentService } from "../api/paymentService";
import ConfirmDialog from "../components/common/ConfirmDialog";
import ErrorState from "../components/common/ErrorState";
import Spinner from "../components/common/Spinner";
import StatusBadge from "../components/common/StatusBadge";
import TicketSummary from "../components/booking/TicketSummary";
import PaymentDetails from "../components/payment/PaymentDetails";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useApi } from "../hooks/useApi";
import { canCancelBooking, canPayBooking } from "../utils/bookingRules";
import { getErrorMessage } from "../utils/errors";
import { formatDateTime, formatEnum } from "../utils/format";

export default function BookingDetailsPage() {
  const id = Number(useParams().id);
  const { isCustomer, isAdmin } = useAuth();
  const toast = useToast();

  const booking = useApi(() => bookingService.getById(id), [id]);
  const paymentId = booking.data?.paymentId ?? null;
  const payment = useApi(() => (paymentId ? paymentService.getById(paymentId) : Promise.resolve(null)), [paymentId]);

  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [checking, setChecking] = useState(false);

  if (booking.loading) return <Spinner label="Loading booking…" />;
  if (booking.error || !booking.data) return <ErrorState message={booking.error ?? "Booking not found"} onRetry={booking.reload} />;
  const b = booking.data;

  const cancel = async () => {
    setBusy(true);
    try {
      const updated = await bookingService.cancel(b.id);
      booking.setData(updated);
      void payment.reload();
      toast.success(updated.paymentStatus === "REFUNDED" ? "Booking cancelled. Your payment was refunded." : "Booking cancelled.");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setBusy(false);
      setConfirming(false);
    }
  };

  const checkStatus = async () => {
    if (!paymentId || !payment.data) return;
    setChecking(true);
    try {
      const res = await paymentService.getStatus(paymentId);
      payment.setData({ ...payment.data, status: res.status });
      toast.success(`Payment status: ${formatEnum(res.status)}.`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setChecking(false);
    }
  };

  return (
    <div>
      <Link to={isAdmin ? "/admin/bookings" : "/bookings"} className="text-sm font-semibold text-muted hover:text-ink">
        {isAdmin ? "Back to bookings" : "Back to my bookings"}
      </Link>
      <div className="mt-2 mb-6 flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-extrabold sm:text-4xl">Booking #{b.id}</h1>
        <StatusBadge status={b.status} />
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_340px]">
        <div className="grid gap-4">
          <section className="panel p-5">
            <h2 className="text-lg font-bold">Booking</h2>
            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <div>
                <dt className="text-muted">Booked on</dt>
                <dd className="font-semibold">{formatDateTime(b.bookingDate)}</dd>
              </div>
              <div>
                <dt className="text-muted">Show status</dt>
                <dd>
                  <StatusBadge status={b.showStatus} />
                </dd>
              </div>
              {isAdmin && (
                <div className="col-span-2">
                  <dt className="text-muted">Customer</dt>
                  <dd className="font-semibold">
                    {b.userName} ({b.userEmail})
                  </dd>
                </div>
              )}
            </dl>
            {isCustomer && (
              <div className="mt-5 flex flex-wrap gap-2 border-t border-line pt-4">
                {canPayBooking(b) && (
                  <Link to={`/bookings/${b.id}/pay`} className="btn-primary">
                    {b.paymentStatus === "FAILED" ? "Retry payment" : "Pay now"}
                  </Link>
                )}
                {canCancelBooking(b) && (
                  <button className="btn-danger" onClick={() => setConfirming(true)}>
                    Cancel booking
                  </button>
                )}
              </div>
            )}
          </section>

          {paymentId ? (
            payment.loading ? (
              <Spinner label="Loading payment…" />
            ) : payment.error ? (
              <ErrorState message={payment.error} onRetry={payment.reload} />
            ) : (
              payment.data && (
                <div className="grid gap-2">
                  <PaymentDetails payment={payment.data} />
                  <button className="btn-ghost justify-self-start" onClick={checkStatus} disabled={checking}>
                    {checking ? "Checking…" : "Check payment status"}
                  </button>
                </div>
              )
            )
          ) : (
            <section className="panel p-5 text-sm text-muted">No payment has been made for this booking yet.</section>
          )}
        </div>

        <TicketSummary movieTitle={b.movieTitle} theatreName={b.theatreName} showDate={b.showDate} showTime={b.showTime} ticketPrice={b.ticketPrice} seats={b.seatNumbers} />
      </div>

      <ConfirmDialog
        open={confirming}
        title="Cancel this booking?"
        message={`Seats ${b.seatNumbers.join(", ")} will be released.${b.paymentStatus === "COMPLETED" ? " Your payment will be refunded." : ""}`}
        confirmLabel="Cancel booking"
        busy={busy}
        onConfirm={cancel}
        onCancel={() => setConfirming(false)}
      />
    </div>
  );
}
