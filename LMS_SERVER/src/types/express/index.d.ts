import { Connection, Document } from 'mongoose';

declare global {
    namespace Express {
        interface Request {
            tenant?: any; // You can type this more strictly later with the Tenant document type
            tenantDb?: Connection;
        }
    }
}
