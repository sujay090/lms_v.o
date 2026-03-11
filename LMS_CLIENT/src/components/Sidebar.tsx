"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    UserPlus,
    GraduationCap,
    BookOpen,
    ChevronDown,
    ChevronLeft,
    PanelLeftOpen,
    UsersRound,
} from "lucide-react";
import TenantBrand from "@/components/TenantBrand";
import SettingsPopup from "@/components/SettingsPopup";

interface NavChild {
    label: string;
    href: string;
    icon: React.ReactNode;
    color: string;       // icon color class
    activeColor: string;  // active icon color class
}

interface NavSection {
    label: string;
    icon: React.ReactNode;
    iconColor: string;
    children: NavChild[];
}

const navSections: NavSection[] = [
    {
        label: "Students Management",
        icon: <UsersRound className="h-4 w-4" />,
        iconColor: "text-indigo-500",
        children: [
            {
                label: "Register Student",
                href: "/admin/students/register",
                icon: <UserPlus className="h-4 w-4" />,
                color: "text-emerald-500",
                activeColor: "text-emerald-600",
            },
            {
                label: "Student List",
                href: "/admin/students/list",
                icon: <GraduationCap className="h-4 w-4" />,
                color: "text-violet-500",
                activeColor: "text-violet-600",
            },
        ],
    },
];

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        "Students Management": true,
    });
    const pathname = usePathname();

    const toggleSection = (label: string) => {
        setOpenSections((prev) => ({ ...prev, [label]: !prev[label] }));
    };

    const isActive = (href: string) => pathname === href;

    return (
        <aside
            className={`${collapsed ? "w-[72px]" : "w-[280px]"
                } bg-white border-r border-slate-200 flex flex-col z-20 shadow-sm relative transition-all duration-300 ease-in-out`}
        >
            {/* Header */}
            <div className={`flex items-center justify-between ${collapsed ? "px-3 py-4" : "px-6 py-5"}`}>
                <div className={`flex items-center gap-3 ${collapsed ? "justify-center w-full" : ""}`}>
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-2 flex items-center justify-center shadow-lg shadow-indigo-600/20 shrink-0">
                        <BookOpen className="h-5 w-5 text-white" />
                    </div>
                    {!collapsed && <TenantBrand fallback="Admin Panel" />}
                </div>
                {!collapsed && (
                    <button
                        onClick={() => setCollapsed(true)}
                        className="flex items-center justify-center h-8 w-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
                        title="Collapse sidebar"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* Expand button when collapsed */}
            {collapsed && (
                <div className="flex justify-center px-3 mb-2">
                    <button
                        onClick={() => setCollapsed(false)}
                        className="flex items-center justify-center h-8 w-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        title="Expand sidebar"
                    >
                        <PanelLeftOpen className="h-4 w-4" />
                    </button>
                </div>
            )}

            {/* Navigation */}
            <div className="px-3 py-2 flex-1 overflow-y-auto">
                <nav className="space-y-1">
                    {/* Dashboard */}
                    <a
                        href="/admin"
                        className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${isActive("/admin")
                            ? "bg-amber-50 text-amber-700"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            } ${collapsed ? "justify-center" : ""}`}
                        title="Dashboard"
                    >
                        <div className={`flex items-center justify-center h-8 w-8 rounded-lg shrink-0 transition-colors ${isActive("/admin")
                            ? "bg-amber-500/20 text-amber-600"
                            : "bg-amber-500/10 text-amber-500"
                            }`}>
                            <LayoutDashboard className="h-4 w-4" />
                        </div>
                        {!collapsed && <span>Dashboard</span>}
                    </a>

                    {/* Collapsible Sections */}
                    {navSections.map((section) => (
                        <div key={section.label} className="pt-3">
                            {/* Section Header */}
                            <button
                                onClick={() => !collapsed && toggleSection(section.label)}
                                className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors ${collapsed
                                    ? "justify-center text-slate-400"
                                    : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                                    }`}
                                title={section.label}
                            >
                                {collapsed ? (
                                    <div className={`${section.iconColor}`}>{section.icon}</div>
                                ) : (
                                    <>
                                        <span className={`${section.iconColor} shrink-0`}>{section.icon}</span>
                                        <span className="flex-1 text-left">{section.label}</span>
                                        <ChevronDown
                                            className={`h-3.5 w-3.5 transition-transform duration-200 ${openSections[section.label] ? "rotate-0" : "-rotate-90"
                                                }`}
                                        />
                                    </>
                                )}
                            </button>

                            {/* Section Children */}
                            <div
                                className={`overflow-hidden transition-all duration-200 ease-in-out ${collapsed || !openSections[section.label]
                                    ? "max-h-0 opacity-0"
                                    : "max-h-96 opacity-100"
                                    }`}
                            >
                                <div className="mt-1 space-y-0.5">
                                    {section.children.map((child) => (
                                        <a
                                            key={child.href}
                                            href={child.href}
                                            className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${isActive(child.href)
                                                ? "bg-slate-100 text-slate-900"
                                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                                }`}
                                        >
                                            <span className={`shrink-0 ${isActive(child.href) ? child.activeColor : child.color}`}>
                                                {child.icon}
                                            </span>
                                            <span>{child.label}</span>
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* Collapsed: show icons only */}
                            {collapsed && (
                                <div className="mt-1 space-y-0.5">
                                    {section.children.map((child) => (
                                        <a
                                            key={child.href}
                                            href={child.href}
                                            className={`flex items-center justify-center px-3 py-2 rounded-xl transition-all duration-200 ${isActive(child.href)
                                                ? "bg-slate-100"
                                                : "hover:bg-slate-50"
                                                }`}
                                            title={child.label}
                                        >
                                            <span className={`${isActive(child.href) ? child.activeColor : child.color}`}>
                                                {child.icon}
                                            </span>
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>
            </div>

            {/* Settings */}
            <div className="mt-auto p-3 border-t border-slate-100">
                <SettingsPopup collapsed={collapsed} />
            </div>
        </aside>
    );
}
