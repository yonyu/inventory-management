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

        // Validate input structure
        for (const detail of invoiceDetails) {
            if (!detail.product || !detail.invoice || typeof detail.quantity !== 'number' || detail.quantity <= 0) {
                return NextResponse.json({ err: "Invalid detail structure" }, { status: 400 });
            }
        }

        // Get unique product and invoice IDs
        const productIds = [...new Set(invoiceDetails.map(d => d.product))];
        const invoiceIds = [...new Set(invoiceDetails.map(d => d.invoice))];

        // Fetch all products and invoices at once
        const [products, invoices] = await Promise.all([
            Product.find({ _id: { $in: productIds } }),
            Invoice.find({ _id: { $in: invoiceIds } })
        ]);

        // Create maps for quick lookup
        const productMap = new Map(products.map(p => [p._id.toString(), p]));
        const invoiceMap = new Map(invoices.map(i => [i._id.toString(), i]));

        // Validate all products and calculate stock changes
        const stockChanges = new Map();
        for (const detail of invoiceDetails) {
            const product = productMap.get(detail.product);
            if (!product) {
                return NextResponse.json({ err: "Product not found" }, { status: 404 });
            }
            if (!invoiceMap.has(detail.invoice)) {
                return NextResponse.json({ err: "Invoice not found" }, { status: 404 });
            }

            const currentChange = stockChanges.get(detail.product) || 0;
            const newChange = currentChange + detail.quantity;
            
            if (product.quantity < newChange) {
                return NextResponse.json({ err: `Insufficient stock of ${product.name}` }, { status: 400 });
            }
            stockChanges.set(detail.product, newChange);
        }

        // Apply all changes atomically
        const bulkProductOps = Array.from(stockChanges.entries()).map(([productId, quantity]) => ({
            updateOne: {
                filter: { _id: productId },
                update: { $inc: { quantity: -quantity } }
            }
        }));

        const bulkInvoiceOps = invoiceIds.map(invoiceId => ({
            updateOne: {
                filter: { _id: invoiceId },
                update: { status: true }
            }
        }));

        await Promise.all([
            Product.bulkWrite(bulkProductOps),
            Invoice.bulkWrite(bulkInvoiceOps)
        ]);

        const updatedInvoice = await Invoice.findById(invoiceIds[0]);
        return NextResponse.json({ invoice: updatedInvoice, msg: "Invoice approved successfully" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ err: error.message }, { status: 500 });
    }
}
