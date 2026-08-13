const MORNING_END_HOUR = 12;
const AFTERNOON_END_HOUR = 17;

/**
 * Returns a time-of-day greeting ("Good Morning" / "Good Afternoon" /
 * "Good Evening") for the Student Home Dashboard header, per
 * Designs/Student Module/1. STUDENT HOME DASHBOARD UI DESIGN.png.
 *
 * Accepts an optional `date` (defaults to `new Date()`) so it stays
 * testable without mocking global time.
 */
export function getTimeOfDayGreeting(date: Date = new Date()): string {
  const hour = date.getHours();

  if (hour < MORNING_END_HOUR) {
    return "Good Morning";
  }

  if (hour < AFTERNOON_END_HOUR) {
    return "Good Afternoon";
  }

  return "Good Evening";
}
