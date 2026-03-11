"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function QueryProvider({ children }: { children: React.ReactNode }) {
    // Create QueryClient inside useState so it's created once per component lifecycle
    // and not recreated on every render
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        // Data stays "fresh" for 5 minutes — no refetch during this time
                        staleTime: 5 * 60 * 1000,
                        // Cache is kept for 10 minutes even after component unmounts
                        gcTime: 10 * 60 * 1000,
                        // Don't refetch when window regains focus (optional, prevents surprise refetches)
                        refetchOnWindowFocus: false,
                        // Retry failed requests once
                        retry: 1,
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
