import api from '../../axiosInstance';

// Create a new tenant
export const createTenant = async (data: {
    tenantName: string;
    tenantDomainName: string;
    tenantEmail: string;
    tenantExpireDate: string;
    tenantStatus: string;
}) => {
    const response = await api.post('/tenants', data);
    return response.data;
};

// Get all tenants
export const getAllTenants = async () => {
    const response = await api.get('/tenants');
    return response.data;
};

// Update a tenant by ID
export const updateTenant = async (id: string, data: {
    tenantName: string;
    tenantDomainName: string;
    tenantEmail: string;
    tenantExpireDate: string;
    tenantStatus: string;
}) => {
    const response = await api.patch(`/tenants/${id}`, data);
    return response.data;
};

// Delete a tenant by ID
export const deleteTenant = async (id: string) => {
    const response = await api.delete(`/tenants/${id}`);
    return response.data;
};
