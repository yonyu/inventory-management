import mongoose from "mongoose";


const UnitSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
}, {timestamps: true});

export default mongoose.models.Unit || mongoose.model('Unit', UnitSchema);
