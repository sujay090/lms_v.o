"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2, Plus, GripVertical, Save } from "lucide-react"
import { getFormTemplate, saveFormTemplate } from "@/api"

export default function FormBuilderPage() {
    const [fields, setFields] = useState<any[]>([])
    const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null)
    const queryClient = useQueryClient()

    const handleDragStart = (index: number) => {
        setDraggedItemIndex(index)
    }

    const handleDragEnter = (index: number) => {
        if (draggedItemIndex === null || draggedItemIndex === index) return

        const newFields = [...fields]
        const draggedItem = newFields[draggedItemIndex]

        newFields.splice(draggedItemIndex, 1)
        newFields.splice(index, 0, draggedItem)

        setDraggedItemIndex(index)
        setFields(newFields)
    }

    const handleDragEnd = () => {
        setDraggedItemIndex(null)
    }

    const { data: initialData, isLoading } = useQuery({
        queryKey: ['student_registration_template'],
        queryFn: () => getFormTemplate('student_registration')
    })

    // Sync React Query data to local state for the builder exactly once when loaded
    useEffect(() => {
        if (initialData?.success && initialData.data?.fields) {
            setFields(initialData.data.fields)
        }
    }, [initialData])

    const addField = () => {
        setFields([...fields, { id: `field_${Date.now()}`, label: 'New Field', type: 'text', required: false, isActive: true }])
    }

    const removeField = (index: number) => {
        setFields(fields.filter((_, i) => i !== index))
    }

    const updateField = (index: number, key: string, value: any) => {
        const newFields = [...fields];
        if (key === 'options') {
            newFields[index][key] = value.split(',').map((v: string) => v.trim()).filter((v: string) => v);
        } else {
            newFields[index][key] = value;
        }
        setFields(newFields);
    }

    const saveMutation = useMutation({
        mutationFn: (fieldsData: any[]) => saveFormTemplate('student_registration', {
            name: "Student Registration Form",
            fields: fieldsData
        }),
        onSuccess: (data) => {
            if (data.success) {
                queryClient.invalidateQueries({ queryKey: ['student_registration_template'] })
                alert("Form templates updated successfully!");
            } else {
                alert("Error saving form");
            }
        },
        onError: () => {
            alert("Error saving form configuration");
        }
    })

    const saveForm = () => {
        saveMutation.mutate(fields)
    }

    if (isLoading) return (
        <div className="p-8 text-slate-500 flex items-center justify-center h-[50vh]">
            Loading form configuration...
        </div>
    )

    return (
        <div className="p-8 max-w-[1100px] mx-auto flex flex-col gap-6 bg-[#f8fafc] min-h-screen">

            {/* Header */}
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h2 className="text-[32px] font-bold tracking-tight text-[#1e293b]">Form Template Builder</h2>
                    <p className="text-[#64748b] mt-1 text-[15px]">Configure the dynamic Student Registration form that all tenants will use.</p>
                </div>
                <Button
                    onClick={saveForm}
                    disabled={saveMutation.isPending}
                    className="bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-lg px-5 h-11 font-medium shadow-sm transition-all flex items-center gap-2 mt-2 text-[15px] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    <Save className="h-4 w-4" /> {saveMutation.isPending ? 'Saving...' : 'Save Configuration'}
                </Button>
            </div>

            {/* Main Builder Card */}
            <Card className="shadow-sm border-[#e2e8f0] rounded-xl bg-white">
                <CardHeader className="flex flex-row items-center justify-between pb-4 pt-6 px-6">
                    <div className="space-y-1">
                        <CardTitle className="text-[18px] font-bold text-[#0f172a]">Registration Fields</CardTitle>
                        <CardDescription className="text-[14px] text-[#64748b]">
                            Add and configure the inputs that students must or can fill out during registration.
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="px-6 pb-8 pt-2 space-y-4">
                    {/* Empty State */}
                    {fields.length === 0 && (
                        <div className="text-center py-12 px-6 border border-dashed border-[#cbd5e1] rounded-xl text-[#64748b]">
                            No fields defined. Click "Add Field" to start building.
                        </div>
                    )}

                    {/* Field List */}
                    {fields.map((field, index) => (
                        <div
                            key={field.id || index}
                            className={`relative flex border ${draggedItemIndex === index ? 'border-[#4f46e5] shadow-lg opacity-80 scale-[1.01] z-10' : 'border-[#e2e8f0]'} rounded-xl ${field.isActive === false ? 'bg-slate-50 opacity-60' : 'bg-white'} overflow-hidden group transition-all`}
                            draggable
                            onDragStart={() => handleDragStart(index)}
                            onDragEnter={() => handleDragEnter(index)}
                            onDragOver={(e) => e.preventDefault()}
                            onDragEnd={handleDragEnd}
                        >

                            {/* Drag Handle */}
                            <div className="w-10 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing text-[#cbd5e1] hover:text-[#94a3b8] active:text-[#4f46e5] bg-slate-50 border-r border-[#e2e8f0]">
                                <GripVertical className="h-5 w-5" />
                            </div>

                            <div className="flex-1 px-5 py-5 pr-14 relative flex flex-col gap-6">

                                {/* Trash Icon */}
                                <button
                                    className="absolute top-4 right-4 text-[#94a3b8] hover:text-[#ef4444] transition-colors bg-transparent border-0 cursor-pointer"
                                    onClick={() => removeField(index)}
                                    title="Delete field"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>

                                {/* 4 Column Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-4 pr-4">

                                    {/* Col 1: Field ID */}
                                    <div className="flex flex-col gap-2">
                                        <Label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">FIELD IDENTIFIER</Label>
                                        <Input
                                            className="h-[42px] border-[#e2e8f0] rounded-lg shadow-sm focus-visible:ring-[#4f46e5] text-[14px] text-[#0f172a] bg-white"
                                            value={field.id}
                                            onChange={(e) => updateField(index, 'id', e.target.value)}
                                        />
                                    </div>

                                    {/* Col 2: Label */}
                                    <div className="flex flex-col gap-2">
                                        <Label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">DISPLAY LABEL</Label>
                                        <Input
                                            className="h-[42px] border-[#e2e8f0] rounded-lg shadow-sm focus-visible:ring-[#4f46e5] text-[14px] text-[#0f172a] bg-white"
                                            value={field.label}
                                            onChange={(e) => updateField(index, 'label', e.target.value)}
                                        />
                                    </div>

                                    {/* Col 3: Type */}
                                    <div className="flex flex-col gap-2">
                                        <Label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">FIELD TYPE</Label>
                                        <div className="relative">
                                            <select
                                                className="w-full h-[42px] appearance-none rounded-lg border border-[#e2e8f0] bg-white px-3 text-[14px] shadow-sm focus:outline-none focus:ring-1 focus:ring-[#4f46e5] focus:border-[#4f46e5] text-[#0f172a] pr-8 cursor-pointer"
                                                value={field.type}
                                                onChange={(e) => updateField(index, 'type', e.target.value)}
                                            >
                                                <option value="text">Text</option>
                                                <option value="email">Email</option>
                                                <option value="number">Number</option>
                                                <option value="date">Date</option>
                                                <option value="textarea">Textarea</option>
                                                <option value="file">File/Image Upload</option>
                                                <option value="select">Select Dropdown</option>
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#64748b]">
                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Col 4: Toggles */}
                                    <div className="flex flex-col justify-end gap-3 pb-2">
                                        <label className="flex items-center gap-2.5 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={field.required}
                                                onChange={(e) => updateField(index, 'required', e.target.checked)}
                                                className="w-[18px] h-[18px] rounded-[4px] border-[#e2e8f0] text-[#4f46e5] focus:ring-[#4f46e5] cursor-pointer"
                                            />
                                            <span className="text-[14px] font-medium text-[#334155] whitespace-nowrap">Required Field</span>
                                        </label>

                                        <label className="flex items-center gap-2.5 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={field.isActive !== false} // default to true if undefined
                                                onChange={(e) => updateField(index, 'isActive', e.target.checked)}
                                                className="w-[18px] h-[18px] rounded-[4px] border-[#e2e8f0] text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                                            />
                                            <span className="text-[14px] font-medium text-[#334155] whitespace-nowrap">Active Status</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Dropdown Options (only for select type) */}
                                {field.type === 'select' && (
                                    <div className="pt-4 border-t border-[#f1f5f9]">
                                        <div className="flex flex-col gap-2 pr-4">
                                            <Label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">DROPDOWN OPTIONS</Label>
                                            <Input
                                                className="h-[42px] border-[#e2e8f0] rounded-lg shadow-sm focus-visible:ring-[#4f46e5] text-[14px] bg-white"
                                                value={field.options?.join(', ') || ''}
                                                onChange={(e) => updateField(index, 'options', e.target.value)}
                                                placeholder="Enter options separated by comma: Math, Science, History"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    <div className="pt-4 mt-2 border-t border-[#e2e8f0] flex justify-center">
                        <Button variant="outline" onClick={addField} className="h-10 px-6 rounded-lg font-semibold text-[#0f172a] bg-white border border-dashed border-[#cbd5e1] hover:bg-[#f1f5f9] hover:border-[#94a3b8] flex items-center gap-2 shadow-sm text-[14px] w-full max-w-[400px]">
                            <Plus className="h-4 w-4" /> Add New Field
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
