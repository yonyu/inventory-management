import mongoose from "mongoose";

import User from "./user";
import Supplier from "./supplier";
import Category from "./category";
import Product from "./product";


// Purchase order
const OrderSchema = new mongoose.Schema({
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Supplier",
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    },
    date: {
        type: Date,
        default: Date.now,
    },
    order_number: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    unit_price: {
        type: Number,
        required: true,
    },
    total_cost: {
        type: Number,
        required: true,
    },
    status: {
        type: Boolean,
        default: false,
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

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);