"use client"

import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle2, AlertCircle, UploadCloud, Loader2 } from "lucide-react"
import { getRegistrationForm, registerStudent, uploadFile } from "@/api"
import { FormField } from "@/types/admin"

export default function RegisterStudentPage() {
    const [formData, setFormData] = useState<Record<string, any>>({})
    const [filesToUpload, setFilesToUpload] = useState<Record<string, File>>({})
    const [submitting, setSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')
    const queryClient = useQueryClient()

    const { data, isLoading } = useQuery({
        queryKey: ["registration-form"],
        queryFn: getRegistrationForm,
    })

    const fields: FormField[] = data?.success ? (data.data?.fields || []) : []

    const handleInputChange = (id: string, value: any) => {
        setFormData(prev => ({ ...prev, [id]: value }))
    }

    const handleFileSelect = (id: string, file: File) => {
        if (!file) return;
        setFilesToUpload(prev => ({ ...prev, [id]: file }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            // First, upload all pending files sequentially
            const finalFormData = { ...formData };
            const fileEntries = Object.entries(filesToUpload);
            
            for (const [id, file] of fileEntries) {
                const result = await uploadFile(file);
                if (result.success && result.data && result.data.url) {
                    finalFormData[id] = result.data.url;
                } else {
                    setError(result.message || `Failed to upload ${file.name}`);
                    setSubmitting(false);
                    return; // Abort submission
                }
            }

            // After all files successfully uploaded, register student
            const result = await registerStudent(finalFormData);

            if (result.success) {
                setSuccess(true);
                const resetData: Record<string, any> = {};
                fields.forEach((f: any) => resetData[f.id] = '');
                setFormData(resetData);
                setFilesToUpload({});
                queryClient.invalidateQueries({ queryKey: ["all-students"] });

                // Disappear success message after 3 seconds
                setTimeout(() => setSuccess(false), 3000)
            } else {
                setError(result.message || "Failed to register student.");
            }
        } catch (err: any) {
            const message = err.response?.data?.message || "Server error during registration.";
            setError(message);
        } finally {
            setSubmitting(false);
        }
    }

    if (isLoading) return <div className="text-slate-500">Loading form template...</div>

    if (fields.length === 0 && !isLoading && !error) {
        return (
            <div className="bg-amber-50 rounded-lg p-6 border border-amber-200">
                <h3 className="text-amber-800 font-semibold mb-2 flex items-center gap-2"><AlertCircle className="h-5 w-5" /> Configuration Required</h3>
                <p className="text-amber-700 text-sm">The Superadmin has not configured the Student Registration form yet. Please contact the administrator to define the required fields in the Form Builder before enrolling.</p>
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto flex flex-col gap-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Register Student</h2>
                <p className="text-slate-500 mt-1">Enroll a new student. Fields are dynamically generated via configurations set by the Superadmin.</p>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200 text-sm font-medium">
                    {error}
                </div>
            )}

            {success && (
                <div className="p-4 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200 text-sm font-medium flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" /> Student registered successfully!
                </div>
            )}

            <Card className="shadow-sm border-slate-200">
                <CardHeader>
                    <CardTitle>Enrollment Form</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {fields.map((field) => (
                                <div key={field.id} className={`space-y-2 ${field.type === 'textarea' ? 'col-span-1 md:col-span-2' : ''}`}>
                                    <Label className="text-slate-700 font-semibold">
                                        {field.label} {field.required && <span className="text-red-500">*</span>}
                                    </Label>

                                    {field.type === 'text' && (
                                        <Input
                                            required={field.required}
                                            value={formData[field.id] || ''}
                                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                                            className="bg-slate-50 border-slate-200"
                                        />
                                    )}

                                    {field.type === 'email' && (
                                        <Input
                                            type="email"
                                            required={field.required}
                                            value={formData[field.id] || ''}
                                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                                            className="bg-slate-50 border-slate-200"
                                        />
                                    )}

                                    {field.type === 'number' && (
                                        <Input
                                            type="number"
                                            required={field.required}
                                            value={formData[field.id] || ''}
                                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                                            className="bg-slate-50 border-slate-200"
                                        />
                                    )}

                                    {field.type === 'date' && (
                                        <Input
                                            type="date"
                                            required={field.required}
                                            value={formData[field.id] || ''}
                                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                                            className="bg-slate-50 text-slate-600 border-slate-200"
                                        />
                                    )}

                                    {field.type === 'select' && (
                                        <select
                                            required={field.required}
                                            value={formData[field.id] || ''}
                                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                                            className="flex h-9 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
                                        >
                                            <option value="" disabled>Select an option</option>
                                            {field.options?.map((opt: string, idx: number) => (
                                                <option key={idx} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    )}

                                    {field.type === 'textarea' && (
                                        <textarea
                                            required={field.required}
                                            value={formData[field.id] || ''}
                                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                                            className="flex min-h-[100px] w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
                                        />
                                    )}

                                    {field.type === 'file' && (
                                        <div className="relative border-2 border-dashed border-slate-300 rounded-lg p-4 bg-slate-50 flex items-center justify-center transition focus-within:ring-2 focus-within:ring-indigo-500">
                                            {submitting && filesToUpload[field.id] ? (
                                                <div className="flex items-center gap-2 text-indigo-600 p-2">
                                                    <Loader2 className="h-5 w-5 animate-spin" />
                                                    <span className="text-sm font-medium">Uploading {filesToUpload[field.id].name}...</span>
                                                </div>
                                            ) : filesToUpload[field.id] ? (
                                                <div className="flex flex-col items-center gap-2 relative z-10 w-full">
                                                    <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                                                    <span className="text-sm text-slate-700 font-medium truncate max-w-[200px]" title={filesToUpload[field.id].name}>{filesToUpload[field.id].name}</span>
                                                    <span className="text-xs text-slate-500">Ready to upload</span>
                                                    <Button variant="outline" size="sm" className="mt-2" onClick={(e) => { 
                                                        e.preventDefault(); 
                                                        setFilesToUpload(prev => {
                                                            const copy = {...prev};
                                                            delete copy[field.id];
                                                            return copy;
                                                        });
                                                    }}>Remove File</Button>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="flex flex-col items-center gap-2 pointer-events-none p-2">
                                                        <UploadCloud className="h-6 w-6 text-slate-400" />
                                                        <span className="text-sm text-slate-500 font-medium">Click to select file</span>
                                                    </div>
                                                    <Input
                                                        type="file"
                                                        required={field.required}
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) handleFileSelect(field.id, file);
                                                        }}
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                    />
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="pt-4 flex justify-end">
                            <Button type="submit" disabled={submitting} className="bg-indigo-600 hover:bg-indigo-700 px-8">
                                {submitting ? 'Registering...' : 'Register Student'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
