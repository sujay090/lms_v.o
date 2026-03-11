import mongoose from 'mongoose';
import { ITenant } from '../models/tenantsModel/tenants.model';

declare global {
    namespace Express {
        interface Request {
            tenant?: any;
            tenantDb?: mongoose.Connection;
        }
    }
}
