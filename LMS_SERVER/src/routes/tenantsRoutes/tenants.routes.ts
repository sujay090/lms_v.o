import express from 'express'
import { createTenant, getAllTenants, updateTenant, deleteTenant } from '../../controllers/tenatnsControllers/tenants.controller';

const router = express.Router();

router.post("/", createTenant);
router.get("/", getAllTenants);
router.patch("/:id", updateTenant);
router.delete("/:id", deleteTenant);

export default router;