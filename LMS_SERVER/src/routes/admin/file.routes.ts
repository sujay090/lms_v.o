import { Router } from "express";
import { getUploadUrl, deleteFile, getFile } from "../../controllers/admin/file.controller";
import { isAuthenticated } from "../../middlewares/authMiddleware";

export const publicFileRouter = Router();
publicFileRouter.get("/view/:key", getFile as any);

const router = Router();

router.post("/get-upload-url", isAuthenticated, getUploadUrl as any);
router.delete("/delete", isAuthenticated, deleteFile as any);

export default router;
