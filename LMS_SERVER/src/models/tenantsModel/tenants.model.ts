import mongoose from "mongoose";

export interface ITenant extends mongoose.Document {
    tenantName: string;
    tenantDomainName: string;
    tenantEmail: string;
    tenantDbName: string;
    tenantExpireDate: Date;
    tenantStatus: string;
}

const tenantsSchema = new mongoose.Schema<ITenant>({
    tenantName: {
        type: String,
        required: true
    },
    tenantDomainName: {
        type: String,
        required: true,
        unique: true
    },
    tenantEmail: {
        type: String,
        required: true,
        unique: true
    },
    tenantDbName: {
        type: String,
        required: true,
        unique: true
    },
    tenantExpireDate: {
        type: Date,
        required: true
    },
    tenantStatus: {
        type: String,
        required: true
    }
})

export default mongoose.model("tenants", tenantsSchema);