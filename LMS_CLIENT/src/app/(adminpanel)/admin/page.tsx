import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react"

export default function AdminDashboardPage() {
    return (
        <div className="flex flex-col gap-6 w-full">
            {/* Top Navigation Simulation */}
            <div className="flex items-center gap-4 mb-2 pb-6 border-b border-slate-200">
                <span className="text-sm font-medium bg-slate-100 text-slate-600 px-3 py-1 rounded-md">Documentation</span>
                <span className="text-sm text-slate-500 ml-auto hover:text-slate-900 cursor-pointer">Support</span>
            </div>

            {/* Metric Cards Row */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                <Card className="shadow-sm border-slate-200 group hover:border-slate-300 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">
                            Total Revenue
                        </CardTitle>
                        <div className="flex items-center gap-1 text-xs font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-100">
                            <TrendingUp className="h-3 w-3" />
                            +12.5%
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold tracking-tight text-slate-900 mt-2">$1,250.00</div>
                        <div className="flex items-center gap-1 mt-4 text-xs font-medium text-slate-700">
                            Trending up this month <ArrowUpRight className="h-3 w-3" />
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Visitors for the last 6 months</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-slate-200 group hover:border-slate-300 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">
                            New Customers
                        </CardTitle>
                        <div className="flex items-center gap-1 text-xs font-semibold bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full border border-rose-100">
                            <ArrowDownRight className="h-3 w-3" />
                            -20%
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold tracking-tight text-slate-900 mt-2">1,234</div>
                        <div className="flex items-center gap-1 mt-4 text-xs font-medium text-slate-700">
                            Down 20% this period <ArrowDownRight className="h-3 w-3" />
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Acquisition needs attention</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-slate-200 group hover:border-slate-300 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">
                            Active Accounts
                        </CardTitle>
                        <div className="flex items-center gap-1 text-xs font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-100">
                            <TrendingUp className="h-3 w-3" />
                            +12.5%
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold tracking-tight text-slate-900 mt-2">45,678</div>
                        <div className="flex items-center gap-1 mt-4 text-xs font-medium text-slate-700">
                            Strong user retention <ArrowUpRight className="h-3 w-3" />
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Engagement exceed targets</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
