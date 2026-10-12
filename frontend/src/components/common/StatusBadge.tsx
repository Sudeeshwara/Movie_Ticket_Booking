import { formatEnum } from "../../utils/format";

const tone: Record<string, string> = {
  // positive
  NOW_SHOWING: "bg-emerald-50 text-emerald-800 ring-emerald-700/20",
  ACTIVE: "bg-emerald-50 text-emerald-800 ring-emerald-700/20",
  SCHEDULED: "bg-emerald-50 text-emerald-800 ring-emerald-700/20",
  CONFIRMED: "bg-emerald-50 text-emerald-800 ring-emerald-700/20",
  COMPLETED: "bg-emerald-50 text-emerald-800 ring-emerald-700/20",
  // waiting
  UPCOMING: "bg-brass-soft text-ink ring-brass/40",
  PENDING: "bg-brass-soft text-ink ring-brass/40",
  REFUNDED: "bg-brass-soft text-ink ring-brass/40",
  // negative / closed
  ENDED: "bg-mist text-muted ring-line",
  INACTIVE: "bg-mist text-muted ring-line",
  CANCELLED: "bg-velvet/5 text-velvet ring-velvet/25",
  FAILED: "bg-velvet/5 text-velvet ring-velvet/25",
  // roles
  ADMIN: "bg-ink text-white ring-ink",
  CUSTOMER: "bg-mist text-ink ring-line",
};

export default function StatusBadge({ status, label }: { status: string; label?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${tone[status] ?? "bg-mist text-ink ring-line"}`}>
      {label ?? formatEnum(status)}
    </span>
  );
}
