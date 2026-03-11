import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/app/globals.css'
import SuperadminLayoutWrapper from './components/SuperadminLayoutWrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Nexus Superadmin',
    description: 'Manage all LMS tenants and configurations',
}

import QueryProvider from '@/components/QueryProvider'

export default function SuperadminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={`${inter.className} bg-slate-50 flex h-screen text-slate-900 overflow-hidden`}>
                <QueryProvider>
                    <SuperadminLayoutWrapper>
                        {children}
                    </SuperadminLayoutWrapper>
                </QueryProvider>
            </body>
        </html>
    )
}
