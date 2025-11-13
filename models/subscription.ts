import mongoose from "mongoose";

const Schema = mongoose.Schema;

import User from "./user";


const SubscriptionSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    stripeSubscriptionId: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date,
        default: Date.now,
    },
    endDate: {
        type: Date,
        required: true,
        default: Date.now,
    },
    price: {
        type: Number,
        required: true,
        default: 600,
    },
}, {timestamps: true});

export default mongoose.models.Subscription || mongoose.model("Subscription", SubscriptionSchema);