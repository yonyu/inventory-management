import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Invoice from "@/models/invoice";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    await dbConnect();

    try {
        const { id } = await params;
        
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
