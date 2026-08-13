import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useState } from "react";

interface QueryProviderProps {
  children: ReactNode;
}

/**
 * Wraps the app with TanStack Query's context for server-state
 * management (Supabase/Postgres data), per AGENTS.md Section 9.
 * A new QueryClient is created once per app instance via useState
 * to avoid recreating it on every render.
 */
export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 2,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
