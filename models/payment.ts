import mongoose from "mongoose";

import "./customer";
import "./invoice";

const PaymentSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    invoice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Invoice",
        required: true,
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true,
    },    
    status: {
        type: String,
        required: false,
    },
    paid_amount: {
        type: Number,
        required: false,
    },
    due_amount: {
        type: Number,
        required: false,
    },
    total_amount: {
        type: Number,
        required: false,
    },
    discount_amount: {
        type: Number,
        required: false,
    },

    // paymentMethod: {
    //     type: String,
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
}, {timestamps: true});


export default mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);