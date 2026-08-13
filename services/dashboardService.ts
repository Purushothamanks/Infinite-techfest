import { supabase } from "@/lib/supabase";
import type { StudentDashboardSummary } from "@/types/dashboard";

/**
 * Dashboard data service, following AGENTS.md Section 7's clean
 * architecture rule ("Never let a screen component call Supabase
 * directly") — the Student Home Dashboard's hook (see
 * hooks/useStudentDashboard.ts) calls only this module.
 *
 * ============================================================================
 * TEMPORARY MOCK — REPLACE WHEN THE BACKEND SCHEMA EXISTS
 * ============================================================================
 * No `profiles`, `events`, `event_registrations`, `payments`, or
 * `certificates` tables exist in Supabase yet (per AGENTS.md Section 11 —
 * only Supabase Auth is wired up today, see services/authService.ts and
 * utils/mapSupabaseUser.ts). Per the task brief's "REAL DATA" rule ("Do
 * NOT invent a backend API... isolate a temporary typed fallback/mock,
 * clearly mark it"), `fetchStudentDashboard` below returns a typed mock
 * instead of querying tables that don't exist.
 *
 * `supabase` is still imported and used for `auth.getUser()` so the
 * greeting genuinely reflects the authenticated session (no fake auth),
 * proving this module is wired to the real client per AGENTS.md Section 9
 * ("Supabase" rules) — only the *symposium data* below the auth call is
 * mocked.
 *
 * TODO(backend): once `database/` gains Drizzle schemas for events,
 * registrations, payments, certificates, and today's schedule, replace
 * the body of `fetchStudentDashboard` with real Supabase/Drizzle queries
 * scoped to `user.id`, respecting Row Level Security. The return shape
 * (`StudentDashboardSummary`) is designed to stay stable across that
 * swap — only this function's internals should need to change.
 */
export async function fetchStudentDashboard(): Promise<StudentDashboardSummary> {
  // Real auth call — confirms a session exists before returning any data.
  // Screens/hooks never call supabase.auth directly (AGENTS.md Section 7);
  // this is the one service-layer call that does.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("No authenticated user found.");
  }

  // Simulates network latency so the dashboard's loading skeleton is
  // visibly exercised during development. Remove once real queries above
  // provide natural latency.
  await new Promise((resolve) => setTimeout(resolve, 600));

  return MOCK_DASHBOARD_SUMMARY;
}

/**
 * MOCK DATA — see module doc above. Values intentionally mirror
 * Designs/Student Module/1. STUDENT HOME DASHBOARD UI DESIGN.png so the
 * implemented screen can be visually compared against the approved design.
 */
const MOCK_DASHBOARD_SUMMARY: StudentDashboardSummary = {
  registrationActive: true,
  paymentVerified: true,
  qrPassReady: true,
  registeredEvents: [
    {
      id: "evt-codecraft",
      title: "CodeCraft",
      category: "Coding",
      date: "2026-08-23",
      time: "09:00 AM",
      location: "Lab 404",
      status: "registered",
    },
    {
      id: "evt-ai-innovators",
      title: "AI Innovators",
      category: "AI / ML",
      date: "2026-08-24",
      time: "10:30 AM",
      location: "Seminar Hall",
      status: "registered",
    },
    {
      id: "evt-tech-quiz",
      title: "Tech Quiz",
      category: "Quiz",
      date: "2026-08-24",
      time: "02:00 PM",
      location: "Auditorium",
      status: "pending_payment",
    },
    {
      id: "evt-robowar",
      title: "RoboWars",
      category: "Robotics",
      date: "2026-08-25",
      time: "11:00 AM",
      location: "Ground Floor Arena",
      status: "registered",
    },
  ],
  nextEvent: {
    id: "evt-ai-innovators",
    title: "AI Innovators",
    date: "2026-08-24",
    time: "10:30 AM",
    location: "Seminar Hall",
    daysRemaining: 1,
  },
  qrPassValue: "ITF2026-PASS-DEMO-0001",
  paymentStatus: {
    status: "verified",
    message: "Your payment has been successfully verified.",
  },
  certificateCount: 0,
  todaySchedule: [
    {
      id: "sch-1",
      time: "09:30 AM",
      title: "Registration & Check-in",
      location: "Main Block",
    },
    {
      id: "sch-2",
      time: "11:00 AM",
      title: "AI Innovators",
      location: "Seminar Hall",
    },
    {
      id: "sch-3",
      time: "02:00 PM",
      title: "Tech Quiz",
      location: "Auditorium",
    },
  ],
  unreadNotificationCount: 3,
};
