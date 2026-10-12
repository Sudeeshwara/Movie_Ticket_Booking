const currency = new Intl.NumberFormat("en-LK", {
  style: "currency",
  currency: "LKR",
  minimumFractionDigits: 2,
});

export const formatCurrency = (value: number) => currency.format(value);

/** "2026-10-15" -> "Thu, 15 Oct 2026" */
export function formatDate(date: string | null | undefined): string {
  if (!date) return "—";
  const d = new Date(`${date.substring(0, 10)}T00:00:00`);
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}

/** "18:30:00" -> "6:30 PM" */
export function formatTime(time: string | null | undefined): string {
  if (!time) return "—";
  const [h, m] = time.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

/** "2026-10-01T10:15:30" -> "1 Oct 2026, 10:15 AM" */
export function formatDateTime(value: string | null | undefined): string {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

/** "NOW_SHOWING" -> "Now showing" */
export function formatEnum(value: string): string {
  const s = value.replace(/_/g, " ").toLowerCase();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function showDateTime(showDate: string, showTime: string): Date {
  return new Date(`${showDate}T${showTime.length === 5 ? showTime + ":00" : showTime}`);
}

export function todayIso(): string {
  const d = new Date();
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().substring(0, 10);
}
