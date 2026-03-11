"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tenants_controller_1 = require("../../controllers/tenatnsControllers/tenants.controller");
const router = express_1.default.Router();
router.post("/", tenants_controller_1.createTenant);
router.get("/", tenants_controller_1.getAllTenants);
router.patch("/", tenants_controller_1.updateTenant);
router.delete("/", tenants_controller_1.deleteTenant);
exports.default = router;
