import mongoose from "mongoose";

import Invoice from "./invoice";
import Category from "./category";
import Product from "./product";

const InvoiceDetailsSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now,
    },
    invoice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Invoice",
        //required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        //required: true,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    unitPrice: {
        type: Number,
        required: true,
    },

    totalCost: {
        type: Number,
        required: true,
    },
    // discount: {
    //     type: Number,
    //     //required: true,
    // },

    status: {
        type: Boolean,
        default: true,
    },
    // total_cost: {
    //     type: Number,
    //     required: true,
    // },
    // createdAt: {
    //     type: Date,
    //     default: Date.now,
    // },
    // updatedAt: {
    //     type: Date,
    //     default: Date.now,
    // },
    // deletedAt: {
    //     type: Date,
    //     default: null,
    // },
    // deleted: {
    //     type: Boolean,
    //     default: false,
    // },
}, {timestamps: true});


export default mongoose.models.InvoiceDetails || mongoose.model('InvoiceDetails', InvoiceDetailsSchema);
