import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";

import PaymentDetails from "@/models/payment-details";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    await dbConnect();

    try {
        const body = await req.json();
        const { invoiceid } = body;
        
        if (invoiceid) {
            const deletedPaymentDetails = await PaymentDetails.deleteMany({ invoiceid: invoiceid });
            return NextResponse.json({ deletedCount: deletedPaymentDetails.deletedCount }, { status: 200 });
        } else {
            const { id } = await params;
            const deletingPaymentDetails = await PaymentDetails.findByIdAndDelete(id);
            if (!deletingPaymentDetails) {
                return NextResponse.json({ err: "Payment Details not found" }, { status: 404 });
            }
            return NextResponse.json({ deletingPaymentDetails: deletingPaymentDetails }, { status: 200 });
        }
    } catch (error: any) {
        return NextResponse.json({ err: error.message }, { status: 500 });
    }
}
