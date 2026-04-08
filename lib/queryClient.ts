import { QueryClient } from "@tanstack/react-query";

/**
 * Always create a NEW QueryClient per server request.
 * Sharing a single instance across requests leaks data between users.
 */
export function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // On the server: never consider data stale (we prefetch fresh data)
        staleTime: 60 * 1000, // 1 minute client-side
      },
    },
  });
}
