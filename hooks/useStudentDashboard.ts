import { useQuery } from "@tanstack/react-query";

import { fetchStudentDashboard } from "@/services/dashboardService";

/** TanStack Query cache key for the Student Home Dashboard summary. */
export const STUDENT_DASHBOARD_QUERY_KEY = ["student-dashboard"] as const;

/**
 * Server-state hook for the Student Home Dashboard, per AGENTS.md Section 9
 * ("Use TanStack Query for all server state"). Wraps
 * services/dashboardService.ts — the Home screen never calls Supabase or
 * the service module directly (AGENTS.md Section 7).
 *
 * A single query key + the QueryProvider's default `staleTime` (60s, see
 * providers/QueryProvider.tsx) keeps repeated mounts of the Home screen
 * from re-issuing a network/service call — satisfying the "avoid...
 * duplicate Supabase requests" performance rule.
 */
export function useStudentDashboard() {
  return useQuery({
    queryKey: STUDENT_DASHBOARD_QUERY_KEY,
    queryFn: fetchStudentDashboard,
  });
}
