"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const tenantsSchema = new mongoose_1.default.Schema({
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
});
exports.default = mongoose_1.default.model("tenants", tenantsSchema);
