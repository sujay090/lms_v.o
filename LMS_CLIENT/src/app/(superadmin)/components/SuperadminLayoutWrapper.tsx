"use client"

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { FormInput, ExternalLink, ShieldCheck, Menu, X, LayoutGrid, Building2, ChevronDown } from 'lucide-react'
import TenantBrand from "@/components/TenantBrand";
import SuperadminSettingsPopup from "./SuperadminSettingsPopup";

export default function SuperadminLayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isFormsOpen, setIsFormsOpen] = useState(pathname.includes('/superadmin/forms'));

    useEffect(() => {
        if (pathname.includes('/superadmin/forms')) {
            setIsFormsOpen(true);
        }
    }, [pathname]);

    return (
        <div className="flex h-screen w-full overflow-hidden">
            {/* Premium White Sidebar */}
            <aside className={`${isSidebarOpen ? 'w-[280px]' : 'w-0 overflow-hidden'} bg-white border-r border-slate-200 flex flex-col z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)] relative transition-all duration-300 ease-in-out shrink-0`}>
                <div className="p-6 pb-4 w-[280px]">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg p-2 flex items-center justify-center shadow-sm shadow-indigo-500/20">
                            <ShieldCheck className="h-5 w-5 text-white" />
                        </div>
                        <TenantBrand fallback="Nexus Center" />
                    </div>
                    <p className="text-slate-500 text-xs font-medium mt-2 px-1">System Administration</p>
                </div>

                <div className="px-4 py-6 flex-1 overflow-y-auto w-[280px]">
                    <div className="space-y-1">
                        <nav className="space-y-1.5">
                            <div className="pt-2 pb-2 px-3">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Config</p>
                            </div>

                            {/* Collapsible Form Builder Section */}
                            <div>
                                <button
                                    onClick={() => setIsFormsOpen(!isFormsOpen)}
                                    className="w-full group flex items-center justify-between gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-slate-600 hover:bg-slate-50 hover:text-emerald-600 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <FormInput className="h-4 w-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                                        <span>Form Builder</span>
                                    </div>
                                    <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isFormsOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isFormsOpen && (
                                    <div className="mt-1 ml-4 pl-4 border-l border-slate-200 space-y-1">
                                        <a href="/superadmin/forms" className="block px-3 py-2 text-sm font-medium rounded-lg text-slate-500 hover:bg-slate-50 hover:text-emerald-600 transition-colors">
                                            Student Form
                                        </a>
                                    </div>
                                )}
                            </div>

                        </nav>
                    </div>
                </div>

                <div className="mt-auto p-4 border-t border-slate-100 w-[280px]">
                    <SuperadminSettingsPopup />
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col relative z-0 overflow-hidden h-full bg-slate-50">
                {/* Top Bar Navigation */}
                <div className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 flex items-center justify-between px-8 z-10 shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 -ml-2 rounded-md hover:bg-slate-100 text-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200"
                            aria-label="Toggle Sidebar"
                        >
                            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                        <span className="bg-slate-100 text-slate-600 text-xs font-semibold px-2 py-1 rounded-md border border-slate-200 hidden sm:inline-block">SUPERADMIN</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-slate-100 cursor-pointer">
                            SA
                        </div>
                    </div>
                </div>

                {/* Scrollable page content */}
                <div className="p-8 flex-1 overflow-y-auto w-full">
                    <div className="max-w-6xl mx-auto pb-12">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    )
}
