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
    paidAmount: {
        type: Number,
        required: false,
    },
    dueAmount: {
        type: Number,
        required: false,
    },
    totalAmount: {
        type: Number,
        required: false,
    },
    discountAmount: {
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