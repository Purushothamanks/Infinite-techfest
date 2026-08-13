import { StudentHomeDashboard } from "@/components/dashboard/StudentHomeDashboard";

/**
 * Student Home Dashboard route.
 *
 * Thin wrapper per the app/ routing convention (see AGENTS.md Section 7 —
 * "Screens (app/) should stay lightweight"): all layout, data fetching,
 * and state handling live in StudentHomeDashboard
 * (components/dashboard/StudentHomeDashboard.tsx). The previous
 * Welcome/Sign Out placeholder has been replaced by the real dashboard;
 * Sign Out now lives on the Profile placeholder stub
 * (app/(student)/profile.tsx), reachable via the dashboard header avatar.
 */
export default function HomeScreen() {
  return <StudentHomeDashboard />;
}
