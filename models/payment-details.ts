import mongoose from "mongoose";

import "./invoice";

const PaymentDetailsSchema = new mongoose.Schema({
    invoice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Invoice",
    },
    currentPaidAmount: {
        type: Number,
        required: false,
    },
    date: {
        type: Date,
        default: Date.now,
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