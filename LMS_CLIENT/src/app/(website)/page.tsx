import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Trophy, Users, Star, ArrowRight, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function WebsitePage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            {/* Navigation Bar */}
            <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-200">
                <div className="container mx-auto px-4 h-16 max-w-6xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-indigo-600 p-2 rounded-lg">
                            <BookOpen className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-indigo-700 to-indigo-500 bg-clip-text text-transparent">Nexus Institute</span>
                    </div>
                    <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
                        <Link href="#programs" className="hover:text-indigo-600 transition-colors">Programs</Link>
                        <Link href="#success" className="hover:text-indigo-600 transition-colors">Success Stories</Link>
                        <Link href="#about" className="hover:text-indigo-600 transition-colors">About Us</Link>
                    </nav>
                    <div className="flex gap-4">
                        <Link href="/admin" className="hidden md:flex">
                            <Button variant="ghost">Staff Login</Button>
                        </Link>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20">Enroll Now</Button>
                    </div>
                </div>
            </header>

            <main className="flex-1 pt-16">
                {/* Hero Section */}
                <section className="relative overflow-hidden bg-white pt-24 pb-32">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                    <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-indigo-500 opacity-20 blur-[100px]"></div>

                    <div className="container mx-auto px-4 max-w-5xl relative z-10 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-medium mb-8">
                            <Star className="h-4 w-4 fill-indigo-700" />
                            <span>Admissions open for 2026 Batch</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-8">
                            Shape your future with <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">
                                expert guidance
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                            Join thousands of successful students who have achieved their dreams through our structured curriculum, expert faculty, and personalized mentorship.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Button size="lg" className="h-12 px-8 text-base bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/25 w-full sm:w-auto">
                                Explore Programs
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                            <Button size="lg" variant="outline" className="h-12 px-8 text-base w-full sm:w-auto bg-white border-slate-200">
                                Book a Counseling Session
                            </Button>
                        </div>

                        <div className="mt-16 flex flex-wrap justify-center gap-8 text-slate-500 text-sm font-medium">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                <span>Top Tier Faculty</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                <span>98% Success Rate</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                <span>Comprehensive Study Material</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features/Stats Section */}
                <section className="py-20 bg-slate-50 border-t border-slate-200">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
                                <CardHeader>
                                    <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4 text-blue-600">
                                        <Trophy className="h-6 w-6" />
                                    </div>
                                    <CardTitle className="text-xl">Proven Excellence</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-slate-600">Consistently producing top ranks with our rigorous testing and personalized feedback loops.</p>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
                                <CardHeader>
                                    <div className="h-12 w-12 rounded-lg bg-indigo-100 flex items-center justify-center mb-4 text-indigo-600">
                                        <Users className="h-6 w-6" />
                                    </div>
                                    <CardTitle className="text-xl">Expert Mentorship</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-slate-600">Learn directly from industry veterans and academicians dedicated to your success.</p>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
                                <CardHeader>
                                    <div className="h-12 w-12 rounded-lg bg-violet-100 flex items-center justify-center mb-4 text-violet-600">
                                        <BookOpen className="h-6 w-6" />
                                    </div>
                                    <CardTitle className="text-xl">Smart Curriculum</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-slate-600">Adaptive learning paths designed to strengthen fundamentals while mastering advanced concepts.</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-400 py-12 text-sm text-center">
                <div className="container mx-auto px-4">
                    <p>© 2026 Nexus Institute. All Rights Reserved.</p>
                    <div className="mt-4 flex justify-center gap-4">
                        <Link href="/superadmin" className="hover:text-white transition-colors">Superadmin Portal</Link>
                    </div>
                </div>
            </footer>
        </div>
    )
}
