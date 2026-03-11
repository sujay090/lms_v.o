import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import tenantsModel from '../models/tenantsModel/tenants.model';

export const tenantResolver = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        let tenantDomain = req.hostname;

        // If local development, hostname might be localhost. 
        // We use req.headers['x-tenant-id'] as fallback or override.
        const tenantHeader = req.headers['x-tenant-id'] as string;
        if (tenantHeader) {
            tenantDomain = tenantHeader;
        }

        if (!tenantDomain) {
            res.status(400).json({ success: false, message: "Tenant domain or x-tenant-id header is missing" });
            return;
        }

        const tenant = await tenantsModel.findOne({
            $or: [
                { tenantDomainName: tenantDomain },
                { tenantName: tenantDomain }
            ]
        });

        if (!tenant) {
            res.status(404).json({ success: false, message: "Tenant not found" });
            return;
        }

        if (tenant.tenantStatus !== "active") {
            res.status(403).json({ success: false, message: "Tenant is not active" });
            return;
        }

        // We use mongoose.connection.useDb to get or create a connection for this specific db name
        // useCache: true ensures that we don't create a new connection pool every time.
        const tenantDb = mongoose.connection.useDb(tenant.tenantDbName, { useCache: true });

        req.tenant = tenant;
        req.tenantDb = tenantDb;

        next();
    } catch (error) {
        console.error("Tenant Resolver Error:", error);
        res.status(500).json({ success: false, message: "Internal server error resolving tenant" });
    }
};
