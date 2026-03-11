import mongoose, { Document, Schema } from "mongoose";

export interface ISession extends Document {
    userId: mongoose.Types.ObjectId;
    expiresAt: Date;
    createdAt: Date;
}

const SessionSchema = new Schema<ISession>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    expiresAt: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });


export const getSessionModel = (connection: mongoose.Connection) => {
    return connection.models.Session || connection.model('Session', SessionSchema);
};