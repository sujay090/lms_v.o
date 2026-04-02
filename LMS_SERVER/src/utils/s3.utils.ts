import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const getS3Client = () => {
    return new S3Client({
        region: process.env.AWS_REGION!,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        },
    });
};

export const uploadFileToS3 = async (
    fileBuffer: Buffer,
    fileName: string,
    mimetype: string
): Promise<string> => {
    try {
        const s3Client = getS3Client();
        const bucketName = process.env.AWS_S3_BUCKET_NAME!;

        if (!bucketName) {
            throw new Error("AWS_S3_BUCKET_NAME is not defined in environment variables.");
        }

        const uniqueFileName = `${Date.now()}-${fileName.replace(/\s+/g, '-')}`;

        const uploadCommand = new PutObjectCommand({
            Bucket: bucketName,
            Key: uniqueFileName,
            Body: fileBuffer,
            ContentType: mimetype,
        });

        await s3Client.send(uploadCommand);

        // Return just the key for private objects
        return uniqueFileName;
    } catch (error) {
        console.error("Error uploading file to S3:", error);
        throw error;
    }
};

export const deleteFileFromS3 = async (key: string): Promise<any> => {
    try {
        const s3Client = getS3Client();
        const bucketName = process.env.AWS_S3_BUCKET_NAME;

        if (!bucketName) {
            throw new Error("AWS_S3_BUCKET_NAME is not defined in environment variables.");
        }

        const deleteCommand = new DeleteObjectCommand({
            Bucket: bucketName,
            Key: key,
        });

        return await s3Client.send(deleteCommand);
    } catch (error) {
        console.error("Error deleting file from S3:", error);
        throw error;
    }
};

export const getFilePresignedUrl = async (key: string): Promise<string> => {
    const s3Client = getS3Client();
    const bucketName = process.env.AWS_S3_BUCKET_NAME!;
    if (!bucketName) {
        throw new Error("AWS_S3_BUCKET_NAME is not defined in environment variables.");
    }
    const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: key,
    });
    // Link expires in 1 hour
    return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
};
