import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    businessName: {
        type: String,
        require: true
    },
    businessDomain: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    role: {
        type: String,
        enum: ['admin', 'superAdmin', 'staff'],
        default: 'admin'
    },
    
})

export const getUserModel = (connection: mongoose.Connection) => {
    return connection.models.User || connection.model('User', userSchema);
};