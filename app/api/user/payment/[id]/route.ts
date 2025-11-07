import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Payment from "@/models/payment";


export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {

    await dbConnect();

    try {
        const { id } = await params;
        const deletingPayment = await Payment.findByIdAndDelete(id);
        if (!deletingPayment) {
            return NextResponse.json({ err: "Payment not found" }, { status: 404 });
        }

        return NextResponse.json({ deletingPayment: deletingPayment }, { status: 200 });
    } catch (error: any) {
        //console.log(error);
        return NextResponse.json({ err: error.message }, { status: 500 });
    }
}