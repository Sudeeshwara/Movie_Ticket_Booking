import { useState } from "react";
import { Link } from "react-router-dom";
import { bookingService } from "../api/bookingService";
import BookingCard from "../components/booking/BookingCard";
import ConfirmDialog from "../components/common/ConfirmDialog";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";
import PageHeader from "../components/common/PageHeader";
import Spinner from "../components/common/Spinner";
import { useToast } from "../context/ToastContext";
import { useApi } from "../hooks/useApi";
import type { Booking, BookingStatus } from "../types";
import { getErrorMessage } from "../utils/errors";

const tabs: { key: BookingStatus | "ALL"; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: "PENDING", label: "Pending" },
  { key: "CONFIRMED", label: "Confirmed" },
  { key: "CANCELLED", label: "Cancelled" },
];

export default function MyBookingsPage() {
  const toast = useToast();
  const { data, setData, loading, error, reload } = useApi(bookingService.getMine);
  const [tab, setTab] = useState<BookingStatus | "ALL">("ALL");
  const [toCancel, setToCancel] = useState<Booking | null>(null);
  const [busy, setBusy] = useState(false);

  const cancel = async () => {
    if (!toCancel) return;
    setBusy(true);
    try {
      const updated = await bookingService.cancel(toCancel.id);
      setData((list) => (list ?? []).map((b) => (b.id === updated.id ? updated : b)));
      toast.success(updated.paymentStatus === "REFUNDED" ? "Booking cancelled. Your payment was refunded." : "Booking cancelled.");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setBusy(false);
      setToCancel(null);
    }
  };

  const list = (data ?? []).filter((b) => tab === "ALL" || b.status === tab);

  return (
    <div>
      <PageHeader title="My bookings" subtitle="Your booking history, payments and cancellations." />

      <div className="mb-5 flex gap-1 overflow-x-auto" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold ${tab === t.key ? "bg-ink text-white" : "text-muted hover:text-ink"}`}
          >
            {t.label}
            {data && <span className="ml-1.5 opacity-70">{t.key === "ALL" ? data.length : data.filter((b) => b.status === t.key).length}</span>}
          </button>
        ))}
      </div>

      {loading && <Spinner label="Loading bookings…" />}
      {error && <ErrorState message={error} onRetry={reload} />}
      {data &&
        (list.length === 0 ? (
          <EmptyState
            title={data.length === 0 ? "No bookings yet" : "Nothing here"}
            message={data.length === 0 ? "Find a show and pick your seats to make your first booking." : "No bookings with this status."}
            action={
              data.length === 0 && (
                <Link to="/shows" className="btn-primary">
                  Find a show
                </Link>
              )
            }
          />
        ) : (
          <div className="grid gap-4">
            {list.map((b) => (
              <BookingCard key={b.id} booking={b} onCancel={setToCancel} />
            ))}
          </div>
        ))}

      <ConfirmDialog
        open={!!toCancel}
        title="Cancel this booking?"
        message={
          toCancel
            ? `${toCancel.movieTitle}, seats ${toCancel.seatNumbers.join(", ")} will be released.${toCancel.paymentStatus === "COMPLETED" ? " Your payment will be refunded." : ""}`
            : ""
        }
        confirmLabel="Cancel booking"
        busy={busy}
        onConfirm={cancel}
        onCancel={() => setToCancel(null)}
      />
    </div>
  );
}
