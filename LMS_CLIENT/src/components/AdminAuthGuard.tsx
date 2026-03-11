"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { verifyAuth } from "@/api";

export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    // useQuery will cache the result — if user navigates between pages,
    // it won't call the API again until staleTime expires (5 min by default)
    const { data, isLoading, isError } = useQuery({
        queryKey: ["auth-me"],       // unique key for this query
        queryFn: verifyAuth,         // the function that fetches data
        retry: false,                // don't retry auth checks — if it fails, redirect
    });

    useEffect(() => {
        // Only redirect if the query has finished and auth failed
        if (!isLoading && (isError || !data?.authenticated)) {
            router.push("/auth");
        }
    }, [isLoading, isError, data, router]);

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-2 text-slate-500">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                    <p className="text-sm font-medium">Verifying access...</p>
                </div>
            </div>
        );
    }

    if (!data?.authenticated) {
        return null; // will redirect via useEffect
    }

    return <>{children}</>;
}
