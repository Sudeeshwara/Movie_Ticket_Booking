import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { bookingService } from "../api/bookingService";
import { showService } from "../api/showService";
import Alert from "../components/common/Alert";
import ErrorState from "../components/common/ErrorState";
import Spinner from "../components/common/Spinner";
import SeatMap from "../components/booking/SeatMap";
import TicketSummary from "../components/booking/TicketSummary";
import { useToast } from "../context/ToastContext";
import { useApi } from "../hooks/useApi";
import { getErrorMessage } from "../utils/errors";

export default function SeatSelectionPage() {
  const id = Number(useParams().id);
  const navigate = useNavigate();
  const toast = useToast();

  const show = useApi(() => showService.getById(id), [id]);
  const seats = useApi(() => showService.getSeats(id), [id]);
  const [selected, setSelected] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (show.loading || seats.loading) return <Spinner label="Loading seats…" />;
  if (show.error || !show.data) return <ErrorState message={show.error ?? "Show not found"} onRetry={show.reload} />;
  if (seats.error || !seats.data) return <ErrorState message={seats.error ?? "Could not load seats"} onRetry={seats.reload} />;

  const s = show.data;
  const open = s.status === "SCHEDULED";

  const toggle = (seat: string) => {
    setError(null);
    setSelected((cur) => (cur.includes(seat) ? cur.filter((x) => x !== seat) : [...cur, seat]));
  };

  const book = async () => {
    if (selected.length === 0) {
      setError("Select at least one seat.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const booking = await bookingService.create({ showId: id, seatNumbers: selected, numberOfTickets: selected.length });
      toast.success("Booking created. Pay now to confirm your seats.");
      navigate(`/bookings/${booking.id}/pay`);
    } catch (err) {
      setError(getErrorMessage(err));
      // Someone else took a seat: refresh the map and drop seats that are no longer free
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        const fresh = await showService.getSeats(id).catch(() => null);
        if (fresh) {
          seats.setData(fresh);
          setSelected((cur) => cur.filter((x) => !fresh.bookedSeats.includes(x)));
        }
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <Link to={`/movies/${s.movieId}`} className="text-sm font-semibold text-muted hover:text-ink">
        Back to {s.movieTitle}
      </Link>
      <h1 className="mt-2 mb-1 text-3xl font-extrabold sm:text-4xl">Choose your seats</h1>
      <p className="mb-6 text-muted">
        {seats.data.availableCount} of {seats.data.capacity} seats available
      </p>

      {!open && (
        <div className="mb-6">
          <Alert kind="info">This show is {s.status.toLowerCase()} and is not accepting bookings.</Alert>
        </div>
      )}

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_340px]">
        <SeatMap allSeats={seats.data.allSeats} bookedSeats={seats.data.bookedSeats} selected={selected} onToggle={toggle} disabled={!open || busy} />
        <div className="lg:sticky lg:top-20">
          <TicketSummary
            movieTitle={s.movieTitle}
            theatreName={`${s.theatreName}, ${s.theatreLocation}`}
            showDate={s.showDate}
            showTime={s.showTime}
            ticketPrice={s.ticketPrice}
            seats={selected}
            footer={
              <div className="grid gap-3">
                {error && <p className="rounded-md bg-white/10 px-3 py-2 text-sm text-[#ffb3c1]" role="alert">{error}</p>}
                <button className="btn w-full bg-brass py-3 text-base text-ink hover:bg-brass/90" onClick={book} disabled={!open || busy || selected.length === 0}>
                  {busy ? "Booking…" : selected.length ? `Book ${selected.length} ${selected.length === 1 ? "seat" : "seats"}` : "Select seats to continue"}
                </button>
                {selected.length > 0 && (
                  <button className="text-sm text-white/70 hover:text-white" onClick={() => setSelected([])} disabled={busy}>
                    Clear selection
                  </button>
                )}
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
}
