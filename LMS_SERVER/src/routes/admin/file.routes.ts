import { Router } from "express";
import multer from "multer";
import { uploadFile, deleteFile, getFile } from "../../controllers/admin/file.controller";
import { isAuthenticated } from "../../middlewares/authMiddleware";

export const publicFileRouter = Router();
publicFileRouter.get("/view/:key", getFile as any);

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", isAuthenticated, upload.single("file"), uploadFile as any);
router.delete("/delete", isAuthenticated, deleteFile as any);

export default router;
