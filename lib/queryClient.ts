import { QueryClient, QueryCache, MutationCache } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * Always create a NEW QueryClient per server request.
 * Sharing a single instance across requests leaks data between users.
 */
export function makeQueryClient(): QueryClient {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error: any) => {
        if (typeof window !== "undefined") {
          toast.error(error?.message || "Something went wrong with the query");
        }
      },
    }),
    mutationCache: new MutationCache({
      onError: (error: any, _vars, _ctx, mutation) => {
        if (typeof window === "undefined") return;
        const meta = mutation.options.meta as { skipGlobalMutationError?: boolean } | undefined;
        if (meta?.skipGlobalMutationError) return;
        toast.error(error?.message || "Something went wrong with the mutation");
      },
    }),
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
