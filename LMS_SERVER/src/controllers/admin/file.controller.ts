import { Request, Response } from "express";
import { uploadFileToS3, deleteFileFromS3, getFilePresignedUrl } from "../../utils/s3.utils";

export const uploadFile = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file provided" });
        }

        const key = await uploadFileToS3(req.file.buffer, req.file.originalname, req.file.mimetype);

        const fileUrl = `${req.protocol}://${req.get("host")}/api/admin/files/view/${key}`;

        res.status(200).json({ success: true, message: "File uploaded successfully", data: { url: fileUrl, key } });
    } catch (error) {
        console.error("Upload file error:", error);
        res.status(500).json({ success: false, message: "Failed to upload file" });
    }
};

export const deleteFile = async (req: Request, res: Response) => {
    try {
        const { fileUrl } = req.body;

        if (!fileUrl) {
            return res.status(400).json({ success: false, message: "No file URL provided" });
        }

        let key = fileUrl;
        if (fileUrl.includes("/api/admin/files/view/")) {
            key = fileUrl.split("/api/admin/files/view/")[1];
        } else if (fileUrl.startsWith("http")) {
            try {
                const urlObj = new URL(fileUrl);
                key = urlObj.pathname.substring(1);
            } catch (e) {
                // ignore
            }
        }

        await deleteFileFromS3(key);

        res.status(200).json({ success: true, message: "File deleted successfully" });
    } catch (error) {
        console.error("Delete file error:", error);
        res.status(500).json({ success: false, message: "Failed to delete file" });
    }
};

export const getFile = async (req: Request, res: Response) => {
    try {
        const key = req.params.key as string;
        if (!key) {
             res.status(400).json({ message: "No key provided" });
             return;
        }

        const presignedUrl = await getFilePresignedUrl(key);
        res.redirect(presignedUrl);
    } catch (error) {
        console.error("Get file error:", error);
        res.status(500).json({ message: "Failed to get file" });
    }
};
