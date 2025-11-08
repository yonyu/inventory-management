import { NextResponse } from "next/server";

import dbConnect from "@/utils/dbConnect";

import InvoiceDetails from "@/models/invoice-details";
import Invoice from "@/models/invoice";
import Payment from "@/models/payment";
import PaymentDetails from "@/models/payment-details";

// The API supports queries like:
// /api/user/invoice-details?invoiceid=123 (default pagination)
// /api/user/invoice-details?invoiceid=123&page=2&limit=20 (custom pagination)
export async function GET(req: Request) {
    await dbConnect();

    try {
        const { searchParams } = new URL(req.url);
        const invoiceid = searchParams.get('invoiceid');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');
        const skip = (page - 1) * limit;

        if (!invoiceid) {
            return NextResponse.json({ err: "Invoice ID is required" }, { status: 400 });
        }

        const [invoice, invoiceDetailsResult, payment, paymentDetailsResult] = await Promise.all([
            Invoice.findById(invoiceid),
            InvoiceDetails.find({ invoice: invoiceid })
                .populate('category')
                .populate('product')
                .limit(limit)
                .skip(skip)
                .sort({ date: -1 }),
            Payment.find({ invoice: invoiceid })
                .populate('customer')
                .sort({ date: -1 }),
            PaymentDetails.find({ invoice: invoiceid })
                .limit(limit)
                .skip(skip)
                .sort({ date: -1 })
        ]);

        if (!invoice) {
            return NextResponse.json({ err: "Invoice not found" }, { status: 404 });
        }

        const [invoiceDetailsCount, paymentDetailsCount] = await Promise.all([
            InvoiceDetails.countDocuments({ invoice: invoiceid }),
            PaymentDetails.countDocuments({ invoice: invoiceid })
        ]);

        return NextResponse.json({ 
            invoice,
            invoiceDetails: invoiceDetailsResult,
            payment,
            paymentDetails: paymentDetailsResult,
            pagination: {
                page,
                limit,
                totalInvoiceDetails: invoiceDetailsCount,
                totalPaymentDetails: paymentDetailsCount,
                totalPages: Math.ceil(Math.max(invoiceDetailsCount, paymentDetailsCount) / limit)
            }
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ err: error.message }, { status: 500 });
    }
}