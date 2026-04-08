import { QueryClient } from "@tanstack/react-query";

/**
 * Always create a NEW QueryClient per server request.
 * Sharing a single instance across requests leaks data between users.
 */
export function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
        retry: 1,
      },
    },
  });
}
