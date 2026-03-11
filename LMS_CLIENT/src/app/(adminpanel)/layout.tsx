import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/app/globals.css'
import AdminAuthGuard from '@/components/AdminAuthGuard'
import Sidebar from '@/components/Sidebar'
import QueryProvider from '@/components/QueryProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'LMS Admin Panel',
    description: 'Manage your LMS operations',
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={`${inter.className} bg-slate-50 flex h-screen text-slate-900 overflow-hidden`}>
                <QueryProvider>
                    <Sidebar />

                    {/* Main Content Area */}
                    <main className="flex-1 flex flex-col relative z-0 overflow-hidden h-full">
                        {/* Top Bar */}
                        <div className="h-14 border-b border-slate-200 bg-white/60 backdrop-blur-md sticky top-0 flex items-center px-8 z-10 shrink-0">
                            <div className="flex gap-4 items-center">
                                <div className="flex h-6 w-6 items-center justify-center rounded bg-slate-100 border border-slate-200 text-slate-500 text-xs shadow-sm">
                                    ⌘
                                </div>
                                <span className="text-sm font-medium text-slate-600 border-l border-slate-200 pl-4">Overview</span>
                            </div>
                        </div>
                        {/* Scrollable page content */}
                        <div className="p-8 flex-1 overflow-y-auto">
                            <div className="max-w-6xl mx-auto pb-12">
                                <AdminAuthGuard>
                                    {children}
                                </AdminAuthGuard>
                            </div>
                        </div>
                    </main>
                </QueryProvider>
            </body>
        </html>
    )
}
