import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Invoice from "@/models/invoice";
import InvoiceDetails from "@/models/invoice-details";
import "@/models/supplier";
import "@/models/category";
import "@/models/product";

export async function POST(req: Request) {
    await dbConnect();

    try {
        const { startDate, endDate } = await req.json();

        const start = new Date(startDate);
        const end = new Date(endDate);

        end.setHours(23, 59, 59, 999);

        const query = {
            invoiceDate: {
                $gte: start,
                $lte: end,
            },
        };

        const invoices = await Invoice.find(query).sort({createdAt: -1});


        //console.log("Orders: ", invoices);

        return NextResponse.json({ invoices: invoices }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ err: error.message }, { status: 500 });
    }
}
