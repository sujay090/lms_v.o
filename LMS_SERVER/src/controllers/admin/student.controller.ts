import { Request, response, Response } from 'express';
import { getStudentModel } from '../../models/adminModels/student.model';
import { getFormTemplateModel } from '../../models/superAdmin/studentFormTemplate.model';
import { z } from 'zod';
import { deleteFileFromS3 } from '../../utils/s3.utils';

const registerStudentSchema = z.object({
    dynamicData: z.record(z.string(), z.any())
});


const editStudentSchema = z.object({
    dynamicData: z.record(z.string(), z.any())
})

export const registerStudent = async (req: Request, res: Response) => {
    try {
        if (!req.tenantDb) {
            return res.status(500).json({ success: false, message: "Tenant database connection missing" });
        }

        const validation = registerStudentSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: validation.error.format()
            });
        }

        const { dynamicData } = validation.data;

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

export const editStudent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { success, error, data } = editStudentSchema.safeParse(req.body);
        if (!success) {
            return res.status(400).json({ success: false, message: "Validation error", errors: error.format() });
        }

        if (!req.tenantDb) {
            return res.status(500).json({ success: false, message: "Tenant database connection missing" });
        }

        const Student = getStudentModel(req.tenantDb);
        const student = await Student.findByIdAndUpdate(id, data);

        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export const deleteStudent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!req.tenantDb) {
            return res.status(500).json({ success: false, message: "Tenant database connection missing" });
        }
        const Student = getStudentModel(req.tenantDb);
        // before the document delete we need to delete the object from s3
        const student = await Student.findById(id).select("dynamicData.image dynamicData.documents");
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        if (student.dynamicData.image) {
            const response = await deleteFileFromS3(student.dynamicData.image.split("/").pop()!);
            if (response?.$metadata.httpStatusCode !== 204) {
                return res.status(500).json({ success: false, message: 'Failed to delete student image' });
            }
        }

        if (student.dynamicData.documents) {
            const response = await deleteFileFromS3(student.dynamicData.documents.split("/").pop()!);
            if (response?.$metadata.httpStatusCode !== 204) {
                return res.status(500).json({ success: false, message: 'Failed to delete student documents' });
            }

        }
        await Student.findByIdAndDelete(id);

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error deleting student:', error);
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
        const template = await FormTemplate.aggregate([
            {
                $match: { formId: "student_registration" }
            },
            {
                $project: {
                    name: 1,
                    formId: 1,
                    fields: {
                        $filter: {
                            input: { $ifNull: ["$fields", []] },
                            as: "field",
                            cond: { $ne: ["$$field.isActive", false] }
                        }
                    }
                }
            }
        ]);

        if (template.length === 0) {
            return res.status(404).json({ success: false, message: 'Registration form not configured by Superadmin' });
        }
        // Return template[0] because the frontend expects `data.data.fields`
        res.status(200).json({ success: true, data: template[0] });
    } catch (error) {
        console.error('Error fetching registration form:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};




