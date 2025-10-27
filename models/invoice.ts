import mongoose from "mongoose";

const InvoiceSchema = new mongoose.Schema({
    invoiceNumber: {
        type: String,
        required: true,
        unique: true
    },
    invoiceDate: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: false
    },


    // dueDate: {
    //     type: Date,
    //     required: true
    // },
    // customer: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Customer',
    //     required: true
    // },
    // items: [{
    //     description: {
    //         type: String,
    //         required: true
    //     },
    //     quantity: {
    //         type: Number,
    //         required: true
    //     },
    //     price: {
    //         type: Number,
    //         required: true
    //     }
    // }],
    // totalAmount: {
    //     type: Number,
    //     required: true
    // }

}, {timestamps: true});

export default mongoose.models.Invoice || mongoose.model('Invoice', InvoiceSchema);
