/**
 * Formats an ISO date string ("2026-08-24") into the dashboard's display
 * format ("24 AUG 2026"), per
 * Designs/Student Module/1. STUDENT HOME DASHBOARD UI DESIGN.png.
 *
 * Falls back to the raw input string if it can't be parsed, so a
 * malformed value never crashes the dashboard.
 */
export function formatEventDate(isoDate: string): string {
  const parsed = new Date(`${isoDate}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return isoDate;
  }

  const day = parsed.getDate().toString().padStart(2, "0");
  const month = parsed
    .toLocaleDateString("en-US", { month: "short" })
    .toUpperCase();
  const year = parsed.getFullYear();

  return `${day} ${month} ${year}`;
}
