import { Request, Response } from 'express';
import { getStudentModel } from '../../models/adminModels/student.model';
import { getFormTemplateModel } from '../../models/superAdmin/studentFormTemplate.model';

export const registerStudent = async (req: Request, res: Response) => {
    try {
        if (!req.tenantDb) {
            return res.status(500).json({ success: false, message: "Tenant database connection missing" });
        }

        const { dynamicData } = req.body;

        const Student = getStudentModel(req.tenantDb);
        const newStudent = new Student({ dynamicData });
        await newStudent.save();

        res.status(201).json({ success: true, data: newStudent });
    } catch (error) {
        console.error('Error registering student:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export const getStudents = async (req: Request, res: Response) => {
    try {
        if (!req.tenantDb) {
            return res.status(500).json({ success: false, message: "Tenant database connection missing" });
        }

        const Student = getStudentModel(req.tenantDb);
        const students = await Student.find().sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: students });
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export const getRegistrationForm = async (req: Request, res: Response) => {
    try {
        if (!req.tenantDb) {
            return res.status(500).json({ success: false, message: "Tenant database connection missing" });
        }

        const FormTemplate = getFormTemplateModel(req.tenantDb);
        // Fetch the global student_registration form template
        const template = await FormTemplate.findOne({ formId: 'student_registration' });

        if (!template) {
            return res.status(404).json({ success: false, message: 'Registration form not configured by Superadmin' });
        }

        res.status(200).json({ success: true, data: template });
    } catch (error) {
        console.error('Error fetching registration form:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
