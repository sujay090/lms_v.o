import api from '../../axiosInstance';

export const uploadFile = async (file: File): Promise<{ success: boolean; message: string; data?: { url: string } }> => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post('/admin/files/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
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
