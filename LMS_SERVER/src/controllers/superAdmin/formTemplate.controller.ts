import { Request, Response } from 'express';
import { getFormTemplateModel } from '../../models/superAdmin/studentFormTemplate.model';

// Upsert a form template
export const saveFormTemplate = async (req: Request, res: Response) => {
    try {
        const { formId } = req.params;
        const { name, fields } = req.body;

        if (!req.tenantDb) {
            return res.status(500).json({ success: false, message: "Tenant database connection missing" });
        }

        const FormTemplate = getFormTemplateModel(req.tenantDb);

        const template = await FormTemplate.findOneAndUpdate(
            { formId },
            { name, fields },
            { new: true, upsert: true }
        );

        res.status(200).json({ success: true, data: template });
    } catch (error) {
        console.error('Error saving form template:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Get a form template
export const getFormTemplate = async (req: Request, res: Response) => {
    try {
        const { formId } = req.params;
        if (!req.tenantDb) {
            return res.status(500).json({ success: false, message: "Tenant database connection missing" });
        }

        const FormTemplate = getFormTemplateModel(req.tenantDb);
        const template = await FormTemplate.findOne({ formId });
        if (!template) {
            return res.status(404).json({ success: false, message: 'Form template not found' });
        }

        res.status(200).json({ success: true, data: template });
    } catch (error) {
        console.error('Error fetching form template:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
