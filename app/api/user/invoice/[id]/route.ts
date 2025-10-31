import { NextResponse } from "next/server";

import dbConnect from "@/utils/dbConnect";
import Invoice from "@/models/invoice";
import InvoiceDetails from "@/models/invoice-details";
import Payment from "@/models/payment";
import PaymentDetails from "@/models/payment-details";


export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    await dbConnect();

    try {
        const { id } = await params;
        const deletingInvoice = await Invoice.findByIdAndDelete(id);
        if (!deletingInvoice) {
            return NextResponse.json({ err: "Invoice not found" }, { status: 404 });
        }

        const deletingInvoiceDetails = await InvoiceDetails.deleteMany({ invoice: id });
        const payment = await Payment.deleteMany({ invoice: id });
        const paymentDetails = await PaymentDetails.deleteMany({ invoice: id });


        return NextResponse.json({ deletingInvoice: deletingInvoice }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ err: error.message }, { status: 500 });
    }
}