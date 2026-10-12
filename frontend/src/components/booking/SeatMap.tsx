import { groupSeatsByRow, SEATS_PER_ROW } from "../../utils/seats";

interface Props {
  allSeats: string[];
  bookedSeats: string[];
  selected: string[];
  onToggle: (seat: string) => void;
  disabled?: boolean;
}

const AISLE_AFTER = SEATS_PER_ROW / 2;

export default function SeatMap({ allSeats, bookedSeats, selected, onToggle, disabled }: Props) {
  const booked = new Set(bookedSeats);
  const chosen = new Set(selected);
  const rows = groupSeatsByRow(allSeats);

  return (
    <div className="panel overflow-x-auto p-4 sm:p-6">
      <div className="mx-auto w-max min-w-full">
        {/* Screen */}
        <div className="mx-auto mb-8 max-w-md" aria-hidden>
          <svg viewBox="0 0 400 40" className="w-full">
            <path d="M10 34 Q200 -4 390 34" fill="none" stroke="var(--color-brass)" strokeWidth="4" strokeLinecap="round" />
          </svg>
          <p className="-mt-1 text-center text-xs font-semibold text-muted">Screen</p>
        </div>

        <div className="flex flex-col gap-2" role="group" aria-label="Seat map">
          {rows.map(({ row, seats }) => (
            <div key={row} className="flex items-center justify-center gap-1.5">
              <span className="w-5 text-center text-xs font-semibold text-muted">{row}</span>
              {seats.map((seat, i) => {
                const isBooked = booked.has(seat);
                const isSelected = chosen.has(seat);
                const state = isBooked ? "booked" : isSelected ? "selected" : "available";
                return (
                  <span key={seat} className={`flex ${i === AISLE_AFTER ? "ml-4" : ""}`}>
                    <button
                      type="button"
                      disabled={isBooked || disabled}
                      onClick={() => onToggle(seat)}
                      aria-pressed={isSelected}
                      aria-label={`Seat ${seat}, ${state}`}
                      title={seat}
                      className={`h-8 w-8 rounded-t-lg rounded-b-sm border-b-4 text-[10px] font-semibold transition-colors ${
                        isBooked
                          ? "cursor-not-allowed border-line bg-line/60 text-muted/60"
                          : isSelected
                            ? "border-[#9c7a22] bg-brass text-ink"
                            : "border-ink/25 bg-white text-ink ring-1 ring-inset ring-line hover:bg-brass-soft"
                      }`}
                    >
                      {seat.slice(1)}
                    </button>
                  </span>
                );
              })}
              <span className="w-5 text-center text-xs font-semibold text-muted">{row}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-5 text-xs text-muted">
          <Legend className="bg-white ring-1 ring-inset ring-line" label="Available" />
          <Legend className="bg-brass" label="Your seats" />
          <Legend className="bg-line/60" label="Taken" />
        </div>
      </div>
    </div>
  );
}

function Legend({ className, label }: { className: string; label: string }) {
  return (
    <span className="flex items-center gap-2">
      <span className={`h-4 w-4 rounded-t-md rounded-b-sm ${className}`} aria-hidden />
      {label}
    </span>
  );
}
