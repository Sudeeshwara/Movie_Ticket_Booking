import type { ReactNode } from "react";
import { formatCurrency, formatDate, formatTime } from "../../utils/format";
import { sortSeats } from "../../utils/seats";

interface Props {
  movieTitle: string;
  theatreName: string;
  showDate: string;
  showTime: string;
  ticketPrice: number;
  seats: string[];
  footer?: ReactNode;
}

/** Ticket-stub style summary: show info, selected seats, count and total. */
export default function TicketSummary({ movieTitle, theatreName, showDate, showTime, ticketPrice, seats, footer }: Props) {
  const total = ticketPrice * seats.length;

  return (
    <aside className="overflow-hidden rounded-xl bg-ink text-white">
      <div className="p-5">
        <h2 className="text-2xl font-extrabold leading-tight">{movieTitle}</h2>
        <p className="mt-1 text-sm text-white/70">{theatreName}</p>
        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-white/60">Date</dt>
            <dd className="font-semibold">{formatDate(showDate)}</dd>
          </div>
          <div>
            <dt className="text-white/60">Time</dt>
            <dd className="font-semibold">{formatTime(showTime)}</dd>
          </div>
        </dl>
      </div>

      <div className="perforated relative h-4" aria-hidden>
        <div className="absolute inset-x-4 top-1/2 border-t-2 border-dashed border-white/20" />
      </div>

      <div className="p-5">
        <p className="text-sm text-white/60">Seats</p>
        <p className="mt-1 min-h-6 font-display text-lg font-bold text-brass">
          {seats.length ? sortSeats(seats).join(", ") : <span className="font-sans text-sm font-normal text-white/60">Pick seats on the map</span>}
        </p>
        <dl className="mt-4 space-y-1 text-sm">
          <div className="flex justify-between">
            <dt className="text-white/60">Tickets</dt>
            <dd>{seats.length}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-white/60">Price per ticket</dt>
            <dd>{formatCurrency(ticketPrice)}</dd>
          </div>
          <div className="flex justify-between border-t border-white/15 pt-2 text-base">
            <dt className="font-semibold">Total</dt>
            <dd className="font-display text-xl font-bold">{formatCurrency(total)}</dd>
          </div>
        </dl>
        {footer && <div className="mt-5">{footer}</div>}
      </div>
    </aside>
  );
}
