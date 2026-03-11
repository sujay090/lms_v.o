import mongoose, { Document, Schema } from 'mongoose';

export interface IFormField {
    id: string;
    label: string;
    type: 'text' | 'email' | 'number' | 'date' | 'select' | 'textarea' | 'file';
    required: boolean;
    isActive?: boolean;
    options?: string[];
}

export interface IFormTemplate extends Document {
    formId: string;
    name: string;
    fields: IFormField[];
}

const formFieldSchema = new Schema<IFormField>({
    id: { type: String, required: true },
    label: { type: String, required: true },
    type: { type: String, required: true, enum: ['text', 'email', 'number', 'date', 'select', 'textarea', 'file'] },
    required: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    options: [{ type: String }]
}, { _id: false });

const formTemplateSchema = new Schema<IFormTemplate>({
    formId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    fields: [formFieldSchema]
}, { timestamps: true });

export const getFormTemplateModel = (connection: mongoose.Connection) => {
    return connection.model<IFormTemplate>('FormTemplate', formTemplateSchema);
};
