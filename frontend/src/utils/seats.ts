/** Same rule as the backend: rows A, B, C ... with 10 seats per row. */
export const SEATS_PER_ROW = 10;

export function groupSeatsByRow(seats: string[]): { row: string; seats: string[] }[] {
  const rows = new Map<string, string[]>();
  for (const seat of seats) {
    const row = seat.charAt(0);
    if (!rows.has(row)) rows.set(row, []);
    rows.get(row)!.push(seat);
  }
  return [...rows.entries()].map(([row, list]) => ({ row, seats: list }));
}

/** Sorts seat labels naturally: A2 before A10, A10 before B1. */
export function sortSeats(seats: string[]): string[] {
  return [...seats].sort((a, b) => a.charCodeAt(0) - b.charCodeAt(0) || Number(a.slice(1)) - Number(b.slice(1)));
}
