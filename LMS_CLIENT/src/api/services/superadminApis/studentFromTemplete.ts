import api from '../../axiosInstance';

// Get a form template by formId
export const getFormTemplate = async (formId: string) => {
    const response = await api.get(`/superadmin/forms/${formId}`);
    return response.data;
};

// Save (upsert) a form template
export const saveFormTemplate = async (formId: string, data: {
    name: string;
    fields: Array<{
        id: string;
        label: string;
        type: string;
        required: boolean;
        options?: string[];
    }>;
}) => {
    const response = await api.put(`/superadmin/forms/${formId}`, data);
    return response.data;
};
