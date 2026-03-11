import { Request, Response } from "express";
import Tenant from "../../models/tenantsModel/tenants.model";
import tenantSchema from "../../schemas/tenantsSchema/tenantSchema";
import { initTenantData } from "../../utils/tenantDataInit";

// Auto-generate database name from tenant name
const generateDbName = (name: string): string => {
    return 'db_' + name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
};

// Sanitize tenant name to snake_case for storage (no spaces or special chars)
const toSnakeCase = (name: string): string => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
};

const createTenant = async (req: Request, res: Response) => {
    try {
        const { data, success, error } = tenantSchema.safeParse(req.body);
        if (!success) {
            return res.status(400).json({ success: false, message: "Invalid tenant data", errors: error });
        }
        // Sanitize tenant name and auto-generate db name
        const sanitizedName = toSnakeCase(data.tenantName);
        let tenantDbName = generateDbName(data.tenantName);

        // Check if tenant email or domain already exists
        const existingEmail = await Tenant.findOne({ tenantEmail: data.tenantEmail });
        if (existingEmail) {
            return res.status(409).json({ success: false, message: "Tenant with this email already exists" });
        }

        const existingDomain = await Tenant.findOne({ tenantDomainName: data.tenantDomainName });
        if (existingDomain) {
            return res.status(409).json({ success: false, message: "Tenant with this domain already exists" });
        }

        // Check if tenant name already exists
        const existingName = await Tenant.findOne({ tenantName: sanitizedName });
        if (existingName) {
            // Business name exists but email is different (since email check passed)
            // Add unique suffix to dbName to prevent collision
            const uniqueSuffix = Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
            tenantDbName = `${tenantDbName}_${uniqueSuffix}`;
        }

        const tenant = await Tenant.create({ ...data, tenantName: sanitizedName, tenantDbName });

        const initData = await initTenantData(tenant);
        if (!initData) {
            return res.status(500).json({ success: false, message: "Tenant data not initialized" });
        }

        res.status(201).json({ success: true, message: "Tenant created successfully" });
    } catch (error: any) {
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: "A tenant with this domain, email, or database name already exists." });
        }
        res.status(500).json({ success: false, message: "Tenant not created" });
    }
}

const getAllTenants = async (req: Request, res: Response) => {
    try {
        const tenants = await Tenant.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: tenants });
    } catch (error) {
        res.status(500).json({ success: false, message: "Tenants not found" });
    }
}

const updateTenant = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { data, success, error } = tenantSchema.safeParse(req.body);
        if (!success) {
            return res.status(400).json({ success: false, message: "Invalid tenant data", errors: error });
        }
        // Sanitize tenant name, do NOT update tenantDbName — it is immutable after creation
        const sanitizedData = { ...data, tenantName: toSnakeCase(data.tenantName) };
        const updated = await Tenant.findByIdAndUpdate(id, sanitizedData, { new: true });
        if (!updated) {
            return res.status(404).json({ success: false, message: "Tenant not found" });
        }
        res.status(200).json({ success: true, message: "Tenant updated successfully", data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: "Tenant not updated" });
    }
}

const deleteTenant = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deleted = await Tenant.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ success: false, message: "Tenant not found" });
        }
        res.status(200).json({ success: true, message: "Tenant deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Tenant not deleted" });
    }
}

export { createTenant, getAllTenants, updateTenant, deleteTenant }