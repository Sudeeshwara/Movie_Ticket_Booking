import type { Booking } from "../types";
import { showDateTime } from "./format";

/** Mirrors the backend cancel rules so the button only shows when it will work. */
export function canCancelBooking(b: Booking): boolean {
  if (b.status === "CANCELLED") return false;
  if (b.showStatus === "COMPLETED") return false;
  if (b.showStatus === "SCHEDULED" && showDateTime(b.showDate, b.showTime) < new Date()) return false;
  return true;
}

/** Cancelled bookings cannot be paid, and a completed payment cannot be repeated. */
export function canPayBooking(b: Booking): boolean {
  return b.status === "PENDING" && b.paymentStatus !== "COMPLETED" && b.paymentStatus !== "REFUNDED";
}
