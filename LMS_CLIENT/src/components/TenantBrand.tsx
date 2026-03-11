"use client";

import { useEffect, useState } from "react";
import { getTenantId } from "@/api/axiosInstance";

export default function TenantBrand({ fallback = "Admin Panel" }: { fallback?: string }) {
    const [name, setName] = useState(fallback);

    useEffect(() => {
        const id = getTenantId();
        if (id) {
            // Convert snake_case or kebab-case to Title Case
            // e.g. "greenwood_academy" -> "Greenwood Academy"
            const formatted = id
                .split(/_|-/)
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
            setName(formatted);
        }
    }, [fallback]);

    return (
        <span className="font-bold text-slate-900 tracking-tight text-lg truncate block max-w-[180px]">
            {name}
        </span>
    );
}
