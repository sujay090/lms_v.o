import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Users, Server, Activity, ArrowUpRight, ShieldCheck } from "lucide-react"

export default function SuperadminDashboardPage() {
    return (
        <div className="flex flex-col gap-8 w-full">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">System Overview</h2>
                    <p className="text-slate-500 mt-1">Monitor all tenant deployments and global system health.</p>
                </div>
                <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-sm font-semibold border border-emerald-200 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    All Systems Operational
                </div>
            </header>

            {/* Premium Metric Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

                <Card className="shadow-sm border-slate-200 group hover:border-slate-300 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">
                            Active Tenants
                        </CardTitle>
                        <div className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center">
                            <Building2 className="h-4 w-4 text-indigo-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold tracking-tight text-slate-900 mt-2">12</div>
                        <div className="flex items-center gap-1 mt-4 text-xs font-medium text-indigo-600">
                            <ArrowUpRight className="h-3 w-3" /> +2 this month
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-slate-200 group hover:border-slate-300 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">
                            Total Registered Users
                        </CardTitle>
                        <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
                            <Users className="h-4 w-4 text-blue-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold tracking-tight text-slate-900 mt-2">1,245</div>
                        <div className="flex items-center gap-1 mt-4 text-xs font-medium text-slate-500">
                            Across all active organizations
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-slate-200 group hover:border-slate-300 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">
                            Databases Provisioned
                        </CardTitle>
                        <div className="h-8 w-8 rounded-full bg-amber-50 flex items-center justify-center">
                            <Server className="h-4 w-4 text-amber-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold tracking-tight text-slate-900 mt-2">14</div>
                        <div className="flex items-center gap-1 mt-4 text-xs font-medium text-slate-500">
                            Including 2 sandbox environments
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-slate-200 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity translate-x-10 -translate-y-10"></div>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                        <CardTitle className="text-sm font-medium text-slate-500">
                            Security Status
                        </CardTitle>
                        <div className="h-8 w-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                            <ShieldCheck className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="text-2xl font-bold tracking-tight text-emerald-700 mt-4">Protected</div>
                        <div className="flex items-center gap-1 mt-4 text-xs font-medium text-slate-500">
                            No active threats detected
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Network Activity Section */}
            <Card className="shadow-sm border-slate-200 mt-4">
                <CardHeader className="border-b border-slate-100 pb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
                                <Activity className="h-5 w-5 text-indigo-500" />
                                Global Network Activity
                            </CardTitle>
                        </div>
                        <span className="text-xs bg-slate-100 text-slate-600 font-medium px-3 py-1 rounded-md">Last 24 Hours</span>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="flex flex-col gap-6">
                        {[
                            { time: "10 mins ago", event: "New tenant 'Acme Corp' provisioned successfully.", type: "provision" },
                            { time: "1 hour ago", event: "System automated backup completed.", type: "system" },
                            { time: "3 hours ago", event: "Form Template updated by Admin.", type: "config" },
                        ].map((log, i) => (
                            <div key={i} className="flex items-start gap-4">
                                <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${log.type === 'provision' ? 'bg-emerald-500 ring-4 ring-emerald-50' :
                                        log.type === 'system' ? 'bg-indigo-500 ring-4 ring-indigo-50' :
                                            'bg-amber-500 ring-4 ring-amber-50'
                                    }`} />
                                <div>
                                    <p className="text-sm font-medium text-slate-700">{log.event}</p>
                                    <p className="text-xs text-slate-400 mt-0.5">{log.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
