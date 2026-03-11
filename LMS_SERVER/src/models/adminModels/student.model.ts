import mongoose, { Document, Schema } from 'mongoose';

export interface IStudent extends Document {
    dynamicData: Map<string, any>;
}

const studentSchema = new Schema<IStudent>({
    dynamicData: {
        type: Map,
        of: Schema.Types.Mixed,
        required: true,
        default: {}
    },
    
}, { timestamps: true });

// We do NOT call mongoose.model() globally because this is a tenant-specific model.
// It must be registered on the specific tenantDb connection.
export const getStudentModel = (connection: mongoose.Connection) => {
    // Check if the model is already registered on this connection to prevent OverwriteModelError
    return connection.models.Student || connection.model<IStudent>('Student', studentSchema);
};
