"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./utils/db");
const tenants_routes_1 = __importDefault(require("./routes/tenantsRoutes/tenants.routes"));
const tenantResolver_1 = require("./middlewares/tenantResolver");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
(0, db_1.connectDB)();
app.use("/api/health", (req, res) => {
    res.status(200).json({ message: "server is running " });
});
app.use("/api/tenants", tenants_routes_1.default);
// Example usage of the tenantResolver middleware
app.get("/api/tenant-test", tenantResolver_1.tenantResolver, (req, res) => {
    // req.tenant contains the tenant document
    // req.tenantDb is the specific database connection for this tenant
    res.status(200).json({
        message: "Tenant resolved successfully",
        tenantDomain: req.tenant.tenantDomainName,
        tenantDbName: req.tenantDb?.name // get db name from connection
    });
});
exports.default = app;
