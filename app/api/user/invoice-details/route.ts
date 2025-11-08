import { NextResponse } from "next/server";

import dbConnect from "@/utils/dbConnect";

import invoiceDetails from "@/models/invoice-details";


export async function GET(req: Request) {
    await dbConnect();

    try {
        const { searchParams } = new URL(req.url);
        const invoiceid = searchParams.get('invoiceid');

        const invoiceDetailsArray = await invoiceDetails.find({ invoiceid: invoiceid })
            .populate('product');

        return NextResponse.json({ invoiceDetails: invoiceDetailsArray }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ err: error.message }, { status: 500 });
    }
})