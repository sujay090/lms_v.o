"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Plus, MoreVertical, Edit, Trash, FileText } from "lucide-react"
import { getRegistrationForm, getAllStudents } from "@/api"

export default function StudentsManagementPage() {
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
                            {/* Dynamically render table headers from the form template */}
                            {fields.map((field: any) => (
                                <TableHead key={field.id} className="font-semibold text-slate-900 whitespace-nowrap">
                                    {field.label}
                                </TableHead>
                            ))}
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
                            students.map((student: any) => (
                                <TableRow key={student._id} className="hover:bg-slate-50/50">
                                    {/* Dynamically render table cells from the student's dynamicData */}
                                    {fields.map((field: any) => {
                                        const val = student.dynamicData ? student.dynamicData[field.id] : ''
                                        return (
                                            <TableCell key={field.id} className="text-slate-600 max-w-[200px] truncate">
                                                {val ? val.toString() : '-'}
                                            </TableCell>
                                        )
                                    })}
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
                                                <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50">
                                                    <Trash className="mr-2 h-4 w-4" /> Delete Student
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
