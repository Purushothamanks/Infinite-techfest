/**
 * Domain types for the Student Home Dashboard.
 * Mirrors the sections in Designs/Student Module/1. STUDENT HOME DASHBOARD UI DESIGN.png:
 * status checklist, registered events, next-up event, QR pass, payment
 * status, certificates, and today's schedule.
 *
 * These types describe the shape the UI needs regardless of where the
 * data ultimately comes from (Supabase/Drizzle once the backend tables
 * exist — see services/dashboardService.ts for the current temporary
 * mock implementation).
 */

/** Registration/payment lifecycle state for a single registered event. */
export type EventRegistrationStatus =
  | "registered"
  | "pending_payment"
  | "waitlisted";

/** A student's registered event, shown in the "My Events" horizontal list. */
export interface RegisteredEventSummary {
  id: string;
  title: string;
  /** Category label shown above the title, e.g. "Coding", "AI / ML", "Quiz". */
  category: string;
  /** ISO 8601 date string (date only), e.g. "2026-08-23". */
  date: string;
  /** Display-ready time string, e.g. "09:00 AM". */
  time: string;
  location: string;
  status: EventRegistrationStatus;
}

/** The soonest upcoming registered event, shown in the "Next Up" card. */
export interface NextEventSummary {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  /** Whole days remaining until the event starts (0 = today). */
  daysRemaining: number;
}

/** Overall payment verification state, shown in the Payment Status card. */
export type PaymentStatusState = "verified" | "pending" | "rejected" | "none";

export interface PaymentStatusSummary {
  status: PaymentStatusState;
  message: string;
}

/** A single entry in the student's schedule for the current day. */
export interface ScheduleEntry {
  id: string;
  /** Display-ready time string, e.g. "09:30 AM". */
  time: string;
  title: string;
  location: string;
}

/** Aggregate summary powering the entire Student Home Dashboard. */
export interface StudentDashboardSummary {
  registrationActive: boolean;
  paymentVerified: boolean;
  qrPassReady: boolean;
  registeredEvents: RegisteredEventSummary[];
  nextEvent: NextEventSummary | null;
  /** Opaque QR payload string for the student's pass, or null if not issued yet. */
  qrPassValue: string | null;
  paymentStatus: PaymentStatusSummary;
  certificateCount: number;
  todaySchedule: ScheduleEntry[];
  unreadNotificationCount: number;
}
