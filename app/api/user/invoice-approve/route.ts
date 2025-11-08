import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Invoice from "@/models/invoice";
import Product from "@/models/product";

export async function POST(req: Request) {
    await dbConnect();

    try {
        const body = await req.json();

        const { invoiceDetails } = body;
        
        if (!invoiceDetails || !Array.isArray(invoiceDetails) || invoiceDetails.length === 0) {
            return NextResponse.json({ err: "Invalid invoice details" }, { status: 400 });
        }

        let updatedInvoice = null;

        for (const detail of invoiceDetails) {
            const product = await Product.findById(detail.product);
            if (!product) {
                return NextResponse.json({ err: "Product not found" }, { status: 404 });
            }
            product.quantity -= detail.quantity;
            if (product.quantity < 0) {
                return NextResponse.json({ err: "Insufficient stock of " + product.name }, { status: 400 });
            }
            await product.save();

            const updated = await Invoice.findByIdAndUpdate(
                detail.invoice,
                { status: true },
                { new: true }
            );
            if (!updated) {
                return NextResponse.json({ err: `Invoice ${detail.invoice} not found` }, { status: 404 });
            } else if (!updatedInvoice) {
                updatedInvoice = updated;
            }
        }

        return NextResponse.json({ invoice: updatedInvoice, msg: "Invoice approved successfully" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ err: error.message }, { status: 500 });
    }
}
