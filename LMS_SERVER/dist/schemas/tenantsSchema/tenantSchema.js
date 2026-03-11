"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = __importDefault(require("zod"));
const tenantSchema = zod_1.default.object({
    tenantName: zod_1.default.string().min(3).max(100),
    tenantDomainName: zod_1.default.string().min(3).max(100),
    tenantEmail: zod_1.default.email(),
    tenantDbName: zod_1.default.string().min(3).max(100),
    tenantExpireDate: zod_1.default.string().min(3).max(100),
    tenantStatus: zod_1.default.string().min(3).max(100)
});
exports.default = tenantSchema;
