import mongoose from "mongoose";

import Unit from "./units";
import Supplier from "./supplier";
import Category from "./category";


const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    status: {
        type: Boolean,
        default: true,
    },
    unit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Unit,
        //required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Category,
        //required: true,
    },
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Supplier,
        //required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    deletedAt: {
        type: Date,
        default: null,
    },
    deleted: {
        type: Boolean,
        default: false,
    },
}, {timestamps: true});


export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
