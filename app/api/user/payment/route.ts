import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";

import Payment from "@/models/payment";


export async function GET(req: Request) {
    await dbConnect();

    try {
        const { searchParams } = new URL(req.url);
        const invoiceId = searchParams.get('invoiceId');

        const payments = invoiceId 
            ? await Payment.find({ invoice: invoiceId }).populate("customer", "name").populate("invoice", "invoiceNumber")
            : await Payment.find().populate("customer", "name").populate("invoice", "invoiceNumber");

        return NextResponse.json({ payments }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ err: error.message }, { status: 500 });
    }
}
