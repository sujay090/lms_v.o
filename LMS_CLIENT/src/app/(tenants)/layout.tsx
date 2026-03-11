import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/app/globals.css'
import { Server, LayoutDashboard, Settings } from 'lucide-react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Tenant Administration',
    description: 'Manage all platform tenants',
}

export default function TenantsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={`${inter.className} bg-slate-50 flex h-screen text-slate-900`}>
                <aside className="w-64 bg-slate-900 text-white p-4 flex flex-col border-r border-slate-800 shadow-xl z-10">
                    <div className="flex items-center gap-3 mb-8 px-2 mt-2">
                        <div className="bg-indigo-500/20 p-2 rounded-lg">
                            <Server className="h-5 w-5 text-indigo-400" />
                        </div>
                        <h1 className="text-xl font-bold tracking-tight">Tenant Admin</h1>
                    </div>

                    <nav className="flex-1">
                        <ul className="space-y-1">
                            <li>
                                <a href="/tenants" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-indigo-600/10 text-indigo-400 font-medium border border-indigo-500/20">
                                    <Server className="h-4 w-4" />
                                    <span>Tenants</span>
                                </a>
                            </li>
                        </ul>
                    </nav>

                    <div className="mt-auto pt-8 border-t border-slate-800">
                        <a href="/" className="flex items-center gap-3 px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors">
                            <Settings className="h-4 w-4" />
                            <span>Return to Website</span>
                        </a>
                    </div>
                </aside>
                <main className="flex-1 overflow-y-auto bg-slate-50/50">
                    <div className="h-16 border-b border-slate-200 bg-white/50 backdrop-blur-sm sticky top-0 z-0 flex items-center px-8 shadow-sm">
                        <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">System Administration</span>
                    </div>
                    <div className="p-8 max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </body>
        </html>
    )
}
