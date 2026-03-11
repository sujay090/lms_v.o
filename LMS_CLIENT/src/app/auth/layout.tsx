import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/app/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Admin Login - LMS',
    description: 'Login to access the LMS Admin Panel',
}

export default function AdminLoginLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={`${inter.className} bg-slate-50 min-h-screen text-slate-900 flex items-center justify-center p-4`}>
                {children}
            </body>
        </html>
    )
}
