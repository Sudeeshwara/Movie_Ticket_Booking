import { useState } from "react";
import { Link } from "react-router-dom";
import { bookingService } from "../../api/bookingService";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import Spinner from "../../components/common/Spinner";
import StatusBadge from "../../components/common/StatusBadge";
import { useToast } from "../../context/ToastContext";
import { useApi } from "../../hooks/useApi";
import type { Booking, BookingStatus } from "../../types";
import { BOOKING_STATUSES } from "../../types";
import { getErrorMessage } from "../../utils/errors";
import { formatCurrency, formatDate, formatEnum, formatTime } from "../../utils/format";

export default function AdminBookingsPage() {
  const toast = useToast();
  const { data, setData, loading, error, reload } = useApi(bookingService.getAll);
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "">("");
  const [savingId, setSavingId] = useState<number | null>(null);

  const changeStatus = async (b: Booking, status: BookingStatus) => {
    if (status === b.status) return;
    setSavingId(b.id);
    try {
      const updated = await bookingService.updateStatus(b.id, status);
      setData((list) => (list ?? []).map((x) => (x.id === updated.id ? updated : x)));
      toast.success(`Booking #${b.id} set to ${formatEnum(status).toLowerCase()}.`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSavingId(null);
    }
  };

  const list = (data ?? []).filter((b) => !statusFilter || b.status === statusFilter);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold">Bookings</h2>
        <select className="input w-auto" aria-label="Filter by status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as BookingStatus | "")}>
          <option value="">All statuses</option>
          {BOOKING_STATUSES.map((s) => (
            <option key={s} value={s}>
              {formatEnum(s)}
            </option>
          ))}
        </select>
      </div>

      {loading && <Spinner />}
      {error && <ErrorState message={error} onRetry={reload} />}
      {data &&
        (list.length === 0 ? (
          <EmptyState title="No bookings" message={data.length === 0 ? "Bookings appear here when customers book seats." : "No bookings with this status."} />
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Customer</th>
                  <th>Show</th>
                  <th>Seats</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {list.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <Link to={`/bookings/${b.id}`} className="font-semibold text-velvet hover:underline">
                        {b.id}
                      </Link>
                    </td>
                    <td>
                      <p className="font-semibold">{b.userName}</p>
                      <p className="text-xs text-muted">{b.userEmail}</p>
                    </td>
                    <td>
                      <p className="font-semibold">{b.movieTitle}</p>
                      <p className="text-xs text-muted">
                        {b.theatreName}, {formatDate(b.showDate)} {formatTime(b.showTime)}
                      </p>
                    </td>
                    <td className="max-w-[140px] text-xs">{b.seatNumbers.join(", ")}</td>
                    <td className="whitespace-nowrap">{formatCurrency(b.totalAmount)}</td>
                    <td>{b.paymentStatus ? <StatusBadge status={b.paymentStatus} /> : <span className="text-xs text-muted">None</span>}</td>
                    <td>
                      {b.status === "CANCELLED" ? (
                        <StatusBadge status={b.status} />
                      ) : (
                        <select
                          className="input w-auto py-1"
                          aria-label={`Status of booking ${b.id}`}
                          value={b.status}
                          disabled={savingId === b.id}
                          onChange={(e) => changeStatus(b, e.target.value as BookingStatus)}
                        >
                          {BOOKING_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {formatEnum(s)}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      <p className="mt-3 text-xs text-muted">Bookings can only be confirmed after a completed payment. Cancelling a paid booking refunds its payment.</p>
    </div>
  );
}
