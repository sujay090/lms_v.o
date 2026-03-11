import mongoose from "mongoose";
import { getUserModel } from "../models/adminModels/users.model";
import { getFormTemplateModel } from "../models/superAdmin/studentFormTemplate.model";
import { defaultStudentRegistrationFields } from "../seeds/studentFormTemplate.seed";
import bcrypt from "bcryptjs";

export const initTenantData = async (tenant: any): Promise<boolean> => {
    try {
        // 1. Connect to the specific tenant db
        const tenantDb = mongoose.connection.useDb(tenant.tenantDbName, { useCache: true });

        // 2. Get the specific User model for this tenant db
        const TenantUser = getUserModel(tenantDb);

        // 3. Hash passwords
        const salt = await bcrypt.genSalt(10);
        const adminPassword = await bcrypt.hash(process.env.ADMIN_PASS!, salt);
        const superAdminPassword = await bcrypt.hash(process.env.SUPERADMIN_PASS!, salt);

        // 4. Check if users already exist
        const adminExists = await TenantUser.findOne({ email: tenant.tenantEmail });
        const superAdminExists = await TenantUser.findOne({ email: "superadmin@gmail.com" });

        // 5. Insert default users only if they don't exist
        const usersToInsert = [];

        if (!adminExists) {
            usersToInsert.push({
                businessName: tenant.tenantName,
                businessDomain: tenant.tenantDomainName,
                email: tenant.tenantEmail,
                password: adminPassword,
                role: 'admin'
            });
        }

        if (!superAdminExists) {
            usersToInsert.push({
                businessName: tenant.tenantName,
                businessDomain: tenant.tenantDomainName,
                email: "superadmin@gmail.com",
                password: superAdminPassword,
                role: 'superAdmin'
            });
        }

        if (usersToInsert.length > 0) {
            await TenantUser.insertMany(usersToInsert);
            console.log(`Inserted ${usersToInsert.length} new default users for tenant.`);
        } else {
            console.log("Admin and SuperAdmin users already exist. Skipping creation.");
        }

        // 6. Initialize default student form template
        const FormTemplate = getFormTemplateModel(tenantDb);
        const formExists = await FormTemplate.findOne({ formId: 'student_registration' });

        if (!formExists) {
            await FormTemplate.create({
                formId: 'student_registration',
                name: 'Student Registration Form',
                fields: defaultStudentRegistrationFields
            });
            console.log("Initialized default student registration form template.");
        }

        console.log("Tenant data initialized successfully");
        return true;
    } catch (error) {
        console.error("Error initializing tenant data:", error);
        return false;
    }
}