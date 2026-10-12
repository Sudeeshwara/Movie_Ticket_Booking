import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { bookingService } from "../api/bookingService";
import { paymentService } from "../api/paymentService";
import Alert from "../components/common/Alert";
import ErrorState from "../components/common/ErrorState";
import Spinner from "../components/common/Spinner";
import TicketSummary from "../components/booking/TicketSummary";
import PaymentDetails from "../components/payment/PaymentDetails";
import PaymentForm from "../components/payment/PaymentForm";
import { useToast } from "../context/ToastContext";
import { useApi } from "../hooks/useApi";
import type { Payment, PaymentMethod } from "../types";
import { canPayBooking } from "../utils/bookingRules";
import { getErrorMessage } from "../utils/errors";

export default function PaymentPage() {
  const id = Number(useParams().id);
  const toast = useToast();
  const booking = useApi(() => bookingService.getById(id), [id]);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (booking.loading) return <Spinner label="Loading booking…" />;
  if (booking.error || !booking.data) return <ErrorState message={booking.error ?? "Booking not found"} onRetry={booking.reload} />;

  const b = booking.data;
  const completed = payment?.status === "COMPLETED";

  const pay = async (method: PaymentMethod, approved: boolean) => {
    setBusy(true);
    setError(null);
    try {
      const created = await paymentService.create({ bookingId: b.id, paymentMethod: method });
      const processed = await paymentService.process(created.id, approved);
      setPayment(processed);
      booking.setData({ ...b, paymentId: processed.id, paymentStatus: processed.status, status: processed.bookingStatus });
      if (processed.status === "COMPLETED") {
        toast.success("Payment completed. Your booking is confirmed.");
      } else {
        setError("The payment was declined. Your booking is still pending. Check the details and try again.");
        toast.error("Payment failed.");
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <Link to="/bookings" className="text-sm font-semibold text-muted hover:text-ink">
        Back to my bookings
      </Link>
      <h1 className="mt-2 mb-6 text-3xl font-extrabold sm:text-4xl">{completed ? "You’re booked" : "Payment"}</h1>

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_340px]">
        <div className="grid gap-4">
          {completed && payment ? (
            <>
              <Alert kind="success">
                Payment completed and booking #{b.id} is confirmed. Show this booking number at the theatre.
              </Alert>
              <PaymentDetails payment={payment} />
              <div className="flex flex-wrap gap-2">
                <Link to={`/bookings/${b.id}`} className="btn-primary">
                  View booking
                </Link>
                <Link to="/" className="btn-secondary">
                  Browse more movies
                </Link>
              </div>
            </>
          ) : canPayBooking(b) ? (
            <>
              {error && <Alert>{error}</Alert>}
              <PaymentForm amount={b.totalAmount} busy={busy} onPay={pay} />
            </>
          ) : (
            <Alert kind="info">
              {b.status === "CANCELLED" ? "This booking was cancelled, so it can’t be paid for." : "This booking has already been paid."}{" "}
              <Link to={`/bookings/${b.id}`} className="font-semibold underline">
                View booking
              </Link>
            </Alert>
          )}
        </div>

        <TicketSummary movieTitle={b.movieTitle} theatreName={b.theatreName} showDate={b.showDate} showTime={b.showTime} ticketPrice={b.ticketPrice} seats={b.seatNumbers} />
      </div>
    </div>
  );
}
