import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";

import invoiceDetails from "@/models/invoice-details";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    await dbConnect();

    try {
        const body = await req.json();
        const { invoiceid } = body;
        
        if (invoiceid) {
            const deletedInvoiceDetails = await invoiceDetails.deleteMany({ invoiceid: invoiceid });
            return NextResponse.json({ deletedCount: deletedInvoiceDetails.deletedCount }, { status: 200 });
        } else {
            const { id } = await params;
            const deletingInvoiceDetails = await invoiceDetails.findByIdAndDelete(id);
            if (!deletingInvoiceDetails) {
                return NextResponse.json({ err: "Invoice Details not found" }, { status: 404 });
            }
            return NextResponse.json({ deletingInvoiceDetails: deletingInvoiceDetails }, { status: 200 });
        }
    } catch (error: any) {
        return NextResponse.json({ err: error.message }, { status: 500 });
    }
}