import mongoose from "mongoose";

import "./invoice";

const PaymentDetailsSchema = new mongoose.Schema({
    invoice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Invoice",
    },
    current_paid_amount: {
        type: Number,
        required: false,
    },
    date: {
        type: Date,
        required: false,
    },
    // createdAt: {
    //     type: Date,
    //     default: Date.now,
    // },
    // updatedAt: {
    //     type: Date,
    //     default: Date.now,
    // },
}, {timestamps: true});

export default mongoose.models.PaymentDetails || mongoose.model("PaymentDetails", PaymentDetailsSchema);