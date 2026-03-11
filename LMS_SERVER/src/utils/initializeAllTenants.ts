import Tenant from "../models/tenantsModel/tenants.model";
import { initTenantData } from "./tenantDataInit";

export const initializeAllTenantsData = async () => {
    try {
        console.log("Starting initialization of all tenants data...");
        const allTenants = await Tenant.find({});
        for (const tenant of allTenants) {
            console.log(`Initializing data for tenant: ${tenant.tenantName} (${tenant.tenantDbName})`);
            await initTenantData(tenant);
        }
        console.log("Finished initializing all tenants data.");
    } catch (error) {
        console.error("Error initializing all tenants data:", error);
    }
};
