import { NextResponse } from "next/server";

import dbConnect from "@/utils/dbConnect";

import PaymentDetails from "@/models/payment-details";


export async function GET(req: Request) {
    await dbConnect();

    try {
        const { searchParams } = new URL(req.url);
        const invoiceid = searchParams.get('invoiceid');

        const paymentDetailsList = invoiceid 
            ? await PaymentDetails.find({ invoiceid: invoiceid })
            : await PaymentDetails.find();
            
        return NextResponse.json({ paymentDetailsList: paymentDetailsList }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ err: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    await dbConnect();

    try {
        const body = await req.json();
        const newPaymentDetails = new PaymentDetails(body);
        const savedPaymentDetails = await newPaymentDetails.save();
        return NextResponse.json({ savedPaymentDetails: savedPaymentDetails }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ err: error.message }, { status: 500 });
    }
}