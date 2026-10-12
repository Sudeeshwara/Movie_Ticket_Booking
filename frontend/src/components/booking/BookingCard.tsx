import { Link } from "react-router-dom";
import type { Booking } from "../../types";
import { canCancelBooking, canPayBooking } from "../../utils/bookingRules";
import { formatCurrency, formatDate, formatDateTime, formatTime } from "../../utils/format";
import { sortSeats } from "../../utils/seats";
import StatusBadge from "../common/StatusBadge";

interface Props {
  booking: Booking;
  onCancel: (booking: Booking) => void;
}

export default function BookingCard({ booking, onCancel }: Props) {
  const cancelled = booking.status === "CANCELLED";

  return (
    <article className={`panel p-5 ${cancelled ? "opacity-75" : ""}`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs text-muted">
            Booking #{booking.id}, made {formatDateTime(booking.bookingDate)}
          </p>
          <h3 className="mt-1 text-xl font-bold">{booking.movieTitle}</h3>
          <p className="text-sm text-muted">
            {booking.theatreName}, {formatDate(booking.showDate)} at {formatTime(booking.showTime)}
          </p>
          <p className="mt-2 text-sm">
            <span className="font-semibold">{booking.numberOfTickets} {booking.numberOfTickets === 1 ? "ticket" : "tickets"}:</span>{" "}
            {sortSeats(booking.seatNumbers).join(", ")}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
          <p className="font-display text-2xl font-bold">{formatCurrency(booking.totalAmount)}</p>
          <div className="flex flex-wrap gap-2">
            <StatusBadge status={booking.status} />
            {booking.paymentStatus && <StatusBadge status={booking.paymentStatus} label={`Payment ${booking.paymentStatus.toLowerCase()}`} />}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
        <Link to={`/bookings/${booking.id}`} className="btn-secondary">
          View details
        </Link>
        {canPayBooking(booking) && (
          <Link to={`/bookings/${booking.id}/pay`} className="btn-primary">
            {booking.paymentStatus === "FAILED" ? "Retry payment" : "Pay now"}
          </Link>
        )}
        {canCancelBooking(booking) && (
          <button className="btn-danger" onClick={() => onCancel(booking)}>
            Cancel booking
          </button>
        )}
      </div>
    </article>
  );
}
