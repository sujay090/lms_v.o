import api from '../../axiosInstance';

// Get the student registration form config
export const getRegistrationForm = async () => {
    const response = await api.get('/admin/students/form');
    return response.data;
};

// Register a new student
export const registerStudent = async (dynamicData: Record<string, any>) => {
    const response = await api.post('/admin/students', { dynamicData });
    return response.data;
};

// Get all students
export const getAllStudents = async () => {
    const response = await api.get('/admin/students');
    return response.data;
};

// edit the student
export const editStudent = async (id: string) => {
    const response = await api.patch(`/admin/students/${id}`);
    return response;
}

// delete student
export const deleteStudent = async (id: string) => {
    const response = await api.delete(`/admin/students/${id}`);
    return response;
}
