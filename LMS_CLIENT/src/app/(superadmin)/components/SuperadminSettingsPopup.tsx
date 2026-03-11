"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Settings, LogOut, User, LayoutDashboard } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutAdmin } from "@/api/services/adminApis/auth";

export default function SuperadminSettingsPopup({ collapsed = false }: { collapsed?: boolean }) {
    const [open, setOpen] = useState(false);
    const popupRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const queryClient = useQueryClient();

    // Close popup on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open]);

    const logoutMutation = useMutation({
        mutationFn: logoutAdmin,
        onSuccess: () => {
            queryClient.clear();
            router.push("/auth");
        },
        onError: (err: any) => {
            console.error("Logout failed:", err);
            router.push("/auth");
        }
    });

    return (
        <div className="relative" ref={popupRef}>
            <button
                onClick={() => setOpen((prev) => !prev)}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-all duration-200 w-full ${collapsed ? "justify-center" : ""}`}
                title="Settings"
            >
                <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-slate-500/10 text-slate-500 shrink-0">
                    <Settings className="h-4 w-4" />
                </div>
                {!collapsed && <span>Settings</span>}
            </button>

            {open && (
                <div className="absolute bottom-full left-0 mb-2 w-52 bg-white rounded-xl shadow-lg border border-slate-200 p-1.5 z-50">
                    <button
                        onClick={() => {
                            setOpen(false);
                            router.push("/superadmin/profile");
                        }}
                        className="flex items-center gap-3 w-full px-3 py-2.5 text-sm rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                    >
                        <div className="flex items-center justify-center h-7 w-7 rounded-md bg-blue-500/10 text-blue-600">
                            <User className="h-3.5 w-3.5" />
                        </div>
                        <span>Profile</span>
                    </button>
                    <button
                        onClick={() => {
                            setOpen(false);
                            router.push("/admin");
                        }}
                        className="flex items-center gap-3 w-full px-3 py-2.5 text-sm rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                    >
                        <div className="flex items-center justify-center h-7 w-7 rounded-md bg-indigo-500/10 text-indigo-600">
                            <LayoutDashboard className="h-3.5 w-3.5" />
                        </div>
                        <span>Admin Panel</span>
                    </button>
                    <div className="border-t border-slate-100 my-1" />
                    <button
                        onClick={() => logoutMutation.mutate()}
                        className="flex items-center gap-3 w-full px-3 py-2.5 text-sm rounded-lg text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                    >
                        <div className="flex items-center justify-center h-7 w-7 rounded-md bg-rose-500/10 text-rose-500">
                            <LogOut className="h-3.5 w-3.5" />
                        </div>
                        <span>Logout</span>
                    </button>
                </div>
            )}
        </div>
    );
}
