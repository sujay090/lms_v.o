"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Search, Plus, MoreVertical, Edit, Trash, Server, AlertCircle, Loader2 } from "lucide-react"
import { getAllTenants, createTenant, updateTenant, deleteTenant } from "@/api"

interface Tenant {
    _id: string;
    tenantName: string;
    tenantDomainName: string;
    tenantEmail: string;
    tenantDbName: string;
    tenantExpireDate: string;
    tenantStatus: string;
}

export default function TenantsManagementPage() {
    const [tenants, setTenants] = useState<Tenant[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    const [isRegisterOpen, setIsRegisterOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null)

    // Form State
    const [formData, setFormData] = useState({
        tenantName: "", tenantDomainName: "", tenantEmail: "", tenantExpireDate: "", tenantStatus: "active"
    })

    const resetForm = () => {
        setFormData({ tenantName: "", tenantDomainName: "", tenantEmail: "", tenantExpireDate: "", tenantStatus: "active" })
    }

    // Fetch all tenants from the backend
    const fetchTenants = useCallback(async () => {
        try {
            const data = await getAllTenants()
            if (data.success) {
                setTenants(data.data)
            }
        } catch (err) {
            console.error("Failed to fetch tenants:", err)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchTenants()
    }, [fetchTenants])

    // Register a new tenant
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        try {
            const data = await createTenant(formData)
            if (data.success) {
                resetForm()
                setIsRegisterOpen(false)
                fetchTenants()
            } else {
                alert(data.message || "Failed to create tenant")
            }
        } catch (err: any) {
            alert(err.response?.data?.message || "Error creating tenant")
        } finally {
            setSaving(false)
        }
    }

    // Open edit dialog
    const handleEditOpen = (tenant: Tenant) => {
        setCurrentTenant(tenant)
        setFormData({
            tenantName: tenant.tenantName,
            tenantDomainName: tenant.tenantDomainName,
            tenantEmail: tenant.tenantEmail,
            tenantExpireDate: tenant.tenantExpireDate ? tenant.tenantExpireDate.split('T')[0] : "",
            tenantStatus: tenant.tenantStatus
        })
        setIsEditOpen(true)
    }

    // Save edit
    const handleEditSave = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!currentTenant) return
        setSaving(true)
        try {
            const data = await updateTenant(currentTenant._id, formData)
            if (data.success) {
                setIsEditOpen(false)
                fetchTenants()
            } else {
                alert(data.message || "Failed to update tenant")
            }
        } catch (err: any) {
            alert(err.response?.data?.message || "Error updating tenant")
        } finally {
            setSaving(false)
        }
    }

    // Delete tenant
    const handleDeleteConfirm = async () => {
        if (!currentTenant) return
        setSaving(true)
        try {
            const data = await deleteTenant(currentTenant._id)
            if (data.success) {
                setIsDeleteOpen(false)
                fetchTenants()
            } else {
                alert(data.message || "Failed to delete tenant")
            }
        } catch (err: any) {
            alert(err.response?.data?.message || "Error deleting tenant")
        } finally {
            setSaving(false)
        }
    }

    // Client-side search filter
    const filteredTenants = tenants.filter(t =>
        t.tenantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.tenantDomainName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.tenantEmail.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Format date for display
    const formatDate = (dateStr: string) => {
        if (!dateStr) return "-"
        return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    }

    return (
        <div className="flex flex-col gap-8">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                        Tenants
                    </h2>
                    <p className="text-slate-500 mt-1">Manage tenant organizations, database provisioning, and billing status.</p>
                </div>

                {/* Register Dialog */}
                <Dialog open={isRegisterOpen} onOpenChange={(open) => { setIsRegisterOpen(open); if (!open) resetForm(); }}>
                    <DialogTrigger>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-sm">
                            <Plus className="mr-2 h-4 w-4" /> Register Tenant
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Register New Tenant</DialogTitle>
                            <DialogDescription>
                                Provision a new database and subdomain for the client organization.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleRegister} className="space-y-4 pt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Organization Name</Label>
                                    <Input id="name" required value={formData.tenantName} onChange={e => setFormData({ ...formData, tenantName: e.target.value })} placeholder="e.g. Acme Corp" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="domain">Domain Alias</Label>
                                    <Input id="domain" required value={formData.tenantDomainName} onChange={e => setFormData({ ...formData, tenantDomainName: e.target.value })} placeholder="acme.lms.com" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Admin Email</Label>
                                    <Input id="email" type="email" required value={formData.tenantEmail} onChange={e => setFormData({ ...formData, tenantEmail: e.target.value })} placeholder="admin@acme.com" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="expireDate">Expiry Date</Label>
                                    <Input id="expireDate" type="date" required value={formData.tenantExpireDate} onChange={e => setFormData({ ...formData, tenantExpireDate: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="status">Initial Status</Label>
                                    <select
                                        id="status"
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                        value={formData.tenantStatus}
                                        onChange={e => setFormData({ ...formData, tenantStatus: e.target.value })}
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                            <DialogFooter className="pt-4">
                                <Button type="button" variant="outline" onClick={() => setIsRegisterOpen(false)}>Cancel</Button>
                                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700" disabled={saving}>
                                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Provision Tenant
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </header>

            {/* Action Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search domains, emails, or names..."
                        className="pl-9 bg-slate-50 border-slate-200"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>
                <span className="text-sm text-slate-500 font-medium">{filteredTenants.length} tenant{filteredTenants.length !== 1 ? 's' : ''}</span>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-20 text-slate-500 gap-3">
                        <Loader2 className="h-5 w-5 animate-spin" /> Loading tenants...
                    </div>
                ) : (
                    <Table>
                        <TableHeader className="bg-slate-50/80 border-b border-slate-200">
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="font-semibold text-slate-700 h-11">Tenant Details</TableHead>
                                <TableHead className="font-semibold text-slate-700 h-11">Database</TableHead>
                                <TableHead className="font-semibold text-slate-700 h-11">Expiry Date</TableHead>
                                <TableHead className="font-semibold text-slate-700 h-11">Status</TableHead>
                                <TableHead className="text-right font-semibold text-slate-700 h-11">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredTenants.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-12 text-slate-500">
                                        {searchQuery ? "No tenants match your search." : "No tenants registered yet. Click \"Register Tenant\" to add your first."}
                                    </TableCell>
                                </TableRow>
                            )}
                            {filteredTenants.map((tenant) => (
                                <TableRow key={tenant._id} className="hover:bg-slate-50/50 group transition-colors">
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-slate-900">{tenant.tenantName}</span>
                                            <span className="text-sm text-slate-500">{tenant.tenantDomainName}</span>
                                            <span className="text-xs text-slate-400 mt-0.5">{tenant.tenantEmail}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-slate-600 font-mono text-sm bg-slate-100 w-fit px-2 py-1 rounded">
                                            <Server className="h-3 w-3 text-slate-400" />
                                            {tenant.tenantDbName}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-slate-600 font-medium">{formatDate(tenant.tenantExpireDate)}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={
                                                tenant.tenantStatus === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50' :
                                                    tenant.tenantStatus === 'inactive' ? 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-100' :
                                                        'bg-red-50 text-red-700 border-red-200 hover:bg-red-50'
                                            }
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current"></span>
                                            {tenant.tenantStatus.charAt(0).toUpperCase() + tenant.tenantStatus.slice(1)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity">
                                                    <MoreVertical className="h-4 w-4" />
                                                    <span className="sr-only">Open menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-40">
                                                <DropdownMenuItem onClick={() => handleEditOpen(tenant)} className="cursor-pointer font-medium">
                                                    <Edit className="mr-2 h-4 w-4 text-slate-400" /> Edit Details
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => { setCurrentTenant(tenant); setIsDeleteOpen(true) }} className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50 font-medium">
                                                    <Trash className="mr-2 h-4 w-4" /> Delete Tenant
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Edit Tenant</DialogTitle>
                        <DialogDescription>Update configuration for {currentTenant?.tenantName}.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEditSave} className="space-y-4 pt-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-name">Organization Name</Label>
                                <Input id="edit-name" required value={formData.tenantName} onChange={e => setFormData({ ...formData, tenantName: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-domain">Domain Alias</Label>
                                <Input id="edit-domain" required value={formData.tenantDomainName} onChange={e => setFormData({ ...formData, tenantDomainName: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-email">Admin Email</Label>
                                <Input id="edit-email" type="email" required value={formData.tenantEmail} onChange={e => setFormData({ ...formData, tenantEmail: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-dbName">Database Name</Label>
                                <Input id="edit-dbName" disabled value={currentTenant?.tenantDbName || ''} className="bg-slate-50 text-slate-500 cursor-not-allowed" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-expireDate">Expiry Date</Label>
                                <Input id="edit-expireDate" type="date" required value={formData.tenantExpireDate} onChange={e => setFormData({ ...formData, tenantExpireDate: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-status">Status</Label>
                                <select
                                    id="edit-status"
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    value={formData.tenantStatus}
                                    onChange={e => setFormData({ ...formData, tenantStatus: e.target.value })}
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="expired">Expired</option>
                                </select>
                            </div>
                        </div>
                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700" disabled={saving}>
                                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-600 border-b border-red-100 pb-4">
                            <AlertCircle className="h-5 w-5" /> Confirm Deletion
                        </DialogTitle>
                        <DialogDescription className="pt-4 text-slate-600 text-base">
                            Are you absolutely sure you want to delete the tenant <strong>{currentTenant?.tenantName}</strong>?
                            <br /><br />
                            This action cannot be undone and will orphan the database `<span className="font-mono text-sm bg-slate-100 p-1 rounded">{currentTenant?.tenantDbName}</span>`.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="pt-4 mt-2">
                        <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDeleteConfirm} disabled={saving}>
                            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Yes, Delete Tenant
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
