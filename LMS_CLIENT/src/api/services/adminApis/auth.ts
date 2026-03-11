import api from '../../axiosInstance';

// Login admin
export const loginAdmin = async (data: { email: string; password: string }) => {
    const response = await api.post('/admin/auth/login', data);
    return response.data;
};

// Verify auth (get current user)
export const verifyAuth = async () => {
    const response = await api.get('/admin/auth/me');
    return response.data;
};

// Logout admin
export const logoutAdmin = async () => {
    const response = await api.post('/admin/auth/logout');
    return response.data;
};
