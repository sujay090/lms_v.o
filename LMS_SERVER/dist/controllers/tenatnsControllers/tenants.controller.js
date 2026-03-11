"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTenant = exports.updateTenant = exports.getAllTenants = exports.createTenant = void 0;
const tenants_model_1 = __importDefault(require("../../models/tenantsModel/tenants.model"));
const tenantSchema_1 = __importDefault(require("../../schemas/tenantsSchema/tenantSchema"));
const createTenant = async (req, res) => {
    try {
        const { data, success, error } = tenantSchema_1.default.safeParse(req.body);
        if (!success) {
            return res.status(400).json({ message: "Invalid tenant data", errors: error });
        }
        await tenants_model_1.default.create(data);
        res.status(200).json({ message: "tenant created successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "tenant not created" });
    }
};
exports.createTenant = createTenant;
const getAllTenants = async (req, res) => {
    try {
        const tenants = await tenants_model_1.default.find();
        res.status(200).json({ tenants });
    }
    catch (error) {
        res.status(500).json({ message: "tenants not found" });
    }
};
exports.getAllTenants = getAllTenants;
const updateTenant = async (req, res) => {
    try {
        const { data, success, error } = tenantSchema_1.default.safeParse(req.body);
        if (!success) {
            return res.status(400).json({ message: "Invalid tenant data", errors: error });
        }
        await tenants_model_1.default.updateOne({ email: data.tenantEmail }, data);
        res.status(200).json({ message: "tenant updated successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "tenant not updated" });
    }
};
exports.updateTenant = updateTenant;
const deleteTenant = async (req, res) => {
    try {
        await tenants_model_1.default.deleteOne({ tenantEmail: req.body.tenantEmail });
        res.status(200).json({ message: "tenant deleted" });
    }
    catch (error) {
        res.status(500).json({ message: "tenant not deleted" });
    }
};
exports.deleteTenant = deleteTenant;
