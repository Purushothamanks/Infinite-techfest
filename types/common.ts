/**
 * Shared, domain-agnostic TypeScript types.
 * Feature-specific types belong in types/user.ts, types/role.ts,
 * or feature-scoped types files instead.
 */

/** Standard async operation status used across hooks and stores. */
export type AsyncStatus = "idle" | "loading" | "success" | "error";

/** Generic paginated response shape returned by list-style API calls. */
export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

/** Generic API error shape for consistent error handling. */
export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
}

/** Utility type to make specific keys of T optional. */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
