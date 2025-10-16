import mongoose from "mongoose";

import User from "./user";


const SupplierSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    phone: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        default: true,
    },
    // user: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "User",
    //     //required: true,
    // },
}, {
    timestamps: true,
}); 

export default mongoose.models.Supplier || mongoose.model("Supplier", SupplierSchema)