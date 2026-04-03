import api from '../../axiosInstance';
import axios from 'axios';

export const uploadFile = async (file: File): Promise<{ success: boolean; message: string; data?: { url: string } }> => {
    try {
        // Step 1: Get presigned URL
        const safeFileType = file.type || 'application/octet-stream';
        
        const presignResponse = await api.post('/admin/files/get-upload-url', {
            fileName: file.name,
            fileType: safeFileType,
        });

        if (!presignResponse.data?.success) {
            return { success: false, message: presignResponse.data?.message || 'Failed to get upload URL' };
        }

        const { uploadUrl, url } = presignResponse.data.data;

        // Step 2: Upload directly to S3 using the presigned URL
        // Using native fetch instead of axios to prevent axios from adding default headers
        // that could cause a SignatureDoesNotMatch 403 error (which appears as a CORS error)
        const uploadResponse = await fetch(uploadUrl, {
            method: 'PUT',
            body: file,
            headers: {
                'Content-Type': safeFileType,
            },
        });

        if (!uploadResponse.ok) {
            console.error('S3 Upload Failed:', uploadResponse.statusText);
            return { success: false, message: 'Failed to upload to S3 directly' };
        }

        // Return the proxy url just like before
        return { success: true, message: 'File uploaded successfully', data: { url } };
    } catch (error: any) {
        console.error('Error uploading file:', error);
        return { success: false, message: error.response?.data?.message || 'File upload failed' };
    }
};

export const deleteFile = async (fileUrl: string): Promise<{ success: boolean; message: string }> => {
    try {
        const response = await api.delete('/admin/files/delete', {
            data: { fileUrl }
        });
        return response.data;
    } catch (error: any) {
        console.error('Error deleting file:', error);
        return { success: false, message: error.response?.data?.message || 'File deletion failed' };
    }
};
