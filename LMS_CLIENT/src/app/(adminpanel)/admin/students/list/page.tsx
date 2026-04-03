"use client"

import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Plus, MoreVertical, Edit, Trash, FileText } from "lucide-react"
import Image from "next/image"
import { getRegistrationForm, getAllStudents, deleteStudent } from "@/api"

export default function StudentsManagementPage() {

    const queryClinet = useQueryClient()

    // useQuery caches the results — navigating away and back won't re-fetch
    // Both queries share the "registration-form" key with the register page
    const { data: formData, isLoading: loadingForm } = useQuery({
        queryKey: ["registration-form"],     // same key as register page = shared cache!
        queryFn: getRegistrationForm,
    })

    const { data: studentsData, isLoading: loadingStudents } = useQuery({
        queryKey: ["all-students"],
        queryFn: getAllStudents,
    })

    const studentMutation = useMutation({
        mutationFn: deleteStudent,
        onSuccess: () => {
            queryClinet.invalidateQueries({ queryKey: ["all-students"] })
        }
    })


    const fields = formData?.success ? (formData.data?.fields || []) : []
    const students = studentsData?.success ? (studentsData.data || []) : []
    const loading = loadingForm || loadingStudents

    if (loading) return <div className="p-8 text-slate-500">Loading student directory...</div>

    return (
        <div className="flex flex-col gap-6">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Students Directory</h2>
                    <p className="text-slate-500 mt-1">Manage enrollments, track progress, and update student profiles dynamically.</p>
                </div>
                <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => window.location.href = '/admin/students/register'}>
                    <Plus className="mr-2 h-4 w-4" /> Add Student
                </Button>
            </header>

            {/* Action Bar */}
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input placeholder="Search students..." className="pl-9 bg-slate-50 border-slate-200" />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <Button variant="outline" className="w-full sm:w-auto">Filter</Button>
                    <Button variant="outline" className="w-full sm:w-auto">Export CSV</Button>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-x-auto">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead className="font-semibold text-slate-900 w-[60px]">Photo</TableHead>
                            <TableHead className="font-semibold text-slate-900">Student Name</TableHead>
                            <TableHead className="font-semibold text-slate-900">Email Address</TableHead>
                            <TableHead className="font-semibold text-slate-900">Phone</TableHead>
                            <TableHead className="font-semibold text-slate-900">Course</TableHead>
                            <TableHead className="text-right font-semibold text-slate-900">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {students.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={fields.length + 1} className="text-center py-8 text-slate-500">
                                    No students found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            students.map((student: any) => {
                                const findFieldVal = (patterns: string[], exactType?: string) => {
                                    if (!student.dynamicData) return null;

                                    let field = fields.find((f: any) =>
                                        (f.label && patterns.some(p => f.label.toLowerCase().includes(p))) ||
                                        (f.id && patterns.some(p => f.id.toLowerCase().includes(p)))
                                    );

                                    if (!field && exactType) {
                                        field = fields.find((f: any) => f.type === exactType);
                                    }

                                    if (field && student.dynamicData[field.id]) {
                                        return student.dynamicData[field.id];
                                    }

                                    const keyMatch = Object.keys(student.dynamicData).find(k =>
                                        patterns.some(p => k.toLowerCase().includes(p))
                                    );
                                    if (keyMatch) return student.dynamicData[keyMatch];

                                    // Strong fallback: if we requested a specific type and found one, just use it
                                    if (exactType) {
                                        const fallbackField = fields.find((f: any) => f.type === exactType);
                                        if (fallbackField && student.dynamicData[fallbackField.id]) {
                                            return student.dynamicData[fallbackField.id];
                                        }
                                    }

                                    return null;
                                };

                                const photoUrl = findFieldVal(['photo', 'image', 'picture', 'avatar', 'profile'], 'file');
                                const name = findFieldVal(['name', 'first', 'last']);
                                const email = findFieldVal(['email', 'mail'], 'email');
                                const phone = findFieldVal(['phone', 'mobile', 'whatsapp']);
                                const course = findFieldVal(['course', 'program', 'class', 'batch', 'department', 'discipline']);

                                return (
                                    <TableRow key={student._id} className="hover:bg-slate-50/50">
                                        <TableCell>
                                            {photoUrl ? (
                                                <div className="h-10 w-10 rounded-full overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
                                                    <img src={photoUrl} alt="Student" className="h-full w-full object-cover" />
                                                </div>
                                            ) : (
                                                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
                                                    {(name || 'S')[0]?.toUpperCase()}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-slate-900 font-medium">
                                            {name || '-'}
                                        </TableCell>
                                        <TableCell className="text-slate-600">
                                            {email || '-'}
                                        </TableCell>
                                        <TableCell className="text-slate-600">
                                            {phone || '-'}
                                        </TableCell>
                                        <TableCell className="text-slate-600">
                                            {course || '-'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100">
                                                        <MoreVertical className="h-4 w-4 text-slate-500" />
                                                        <span className="sr-only">Open menu</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48">
                                                    <DropdownMenuItem className="cursor-pointer">
                                                        <FileText className="mr-2 h-4 w-4 text-slate-500" /> View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="cursor-pointer">
                                                        <Edit className="mr-2 h-4 w-4 text-slate-500" /> Edit Profile
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50" onClick={() => studentMutation.mutate(student._id)} >
                                                        <Trash className="mr-2 h-4 w-4" /> Delete Student
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
