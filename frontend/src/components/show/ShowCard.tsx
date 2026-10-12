import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import type { Show } from "../../types";
import { formatCurrency, formatTime } from "../../utils/format";
import StatusBadge from "../common/StatusBadge";

interface Props {
  show: Show;
  hideMovie?: boolean;
}

export default function ShowCard({ show, hideMovie }: Props) {
  const { user, isCustomer } = useAuth();
  const d = new Date(`${show.showDate}T00:00:00`);
  const bookable = show.status === "SCHEDULED";

  return (
    <article className="panel flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
      <div className="flex w-16 shrink-0 flex-col items-center rounded-lg bg-mist py-2 text-center" aria-label={d.toDateString()}>
        <span className="text-xs font-semibold text-muted">{d.toLocaleDateString("en-GB", { month: "short" })}</span>
        <span className="font-display text-2xl font-extrabold leading-none">{d.getDate()}</span>
        <span className="text-xs text-muted">{d.toLocaleDateString("en-GB", { weekday: "short" })}</span>
      </div>

      <div className="min-w-0 flex-1">
        {!hideMovie && (
          <Link to={`/movies/${show.movieId}`} className="font-display text-lg font-bold hover:text-velvet">
            {show.movieTitle}
          </Link>
        )}
        <p className="text-sm text-muted">
          {show.theatreName}, {show.theatreLocation}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          <span className="font-semibold">{formatTime(show.showTime)}</span>
          <span>{formatCurrency(show.ticketPrice)} per ticket</span>
          <StatusBadge status={show.status} />
        </div>
      </div>

      <div className="shrink-0">
        {bookable && isCustomer && (
          <Link to={`/shows/${show.id}/book`} className="btn-primary w-full sm:w-auto">
            Choose seats
          </Link>
        )}
        {bookable && !user && (
          <Link to="/signin" state={{ from: `/shows/${show.id}/book` }} className="btn-secondary w-full sm:w-auto">
            Sign in to book
          </Link>
        )}
        {!bookable && <span className="text-sm text-muted">Not open for booking</span>}
      </div>
    </article>
  );
}
