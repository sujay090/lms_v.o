import { IFormField } from '../models/superAdmin/studentFormTemplate.model';

export const defaultStudentRegistrationFields: IFormField[] = [
    { id: 'name', label: 'Full Name', type: 'text', required: true, isActive: true },
    { id: 'email', label: 'Email Address', type: 'email', required: true, isActive: true },
    { id: 'phone', label: 'Phone Number', type: 'number', required: true, isActive: true },
    { id: 'motherName', label: 'Mother\'s Name', type: 'text', required: true, isActive: true },
    { id: 'fatherName', label: 'Father\'s Name', type: 'text', required: true, isActive: true },
    { id: 'courseName', label: 'Course Name', type: 'text', required: true, isActive: true },
    { id: 'image', label: 'Student Photo', type: 'file', required: false, isActive: true },
    { id: 'documents', label: 'Supporting Documents', type: 'file', required: false, isActive: true }
];
