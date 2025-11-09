import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Invoice from "@/models/invoice";

// http://localhost:3000/api/user/invoice-approve/507f1f77bcf86cd799439011

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    await dbConnect();

    try {
        const { id } = await params;
        console.log("Received invoice to approve: " + id);
        
        const updatedInvoice = await Invoice.findByIdAndUpdate(
            id,
            { status: true },
            { new: true }
        );

        if (!updatedInvoice) {
            return NextResponse.json({ err: "Invoice not found" }, { status: 404 });
        }

        return NextResponse.json({ invoice: updatedInvoice, msg: "Invoice approved successfully" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ err: error.message }, { status: 500 });
    }
}
