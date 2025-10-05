import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true,
        lowercase: true,
    },
    phone: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
        required: true
    },
    subscription: {
        type: String,
        enum: ['free', 'premium'],
        default: 'free',
        required: true
    },
    avatar: {
        type: String,
        default: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);