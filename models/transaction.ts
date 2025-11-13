import mongoose from "mongoose";

const Schema = mongoose.Schema;

import User from "./user";

const TransactionSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    status: {
        type: String,
        default: 'Completed',
    },
    paymentMethod: {
        type:String,
        default: "Credit Card",
    },
    paymentStatus: {
        type: String,
        default: "Paid",

    },
    transactionId: {
        type: String,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },

}, {timestamps: true});


export default mongoose.models.Transaction || mongoose.model("Transaction", TransactionSchema);