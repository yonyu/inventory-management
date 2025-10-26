import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Order from "@/models/order";
import Product from "@/models/product";


export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    await dbConnect();

    try {
        const { id } = await params;
        
        const order = await Order.findById(id);
        if (!order) {
            return NextResponse.json({ err: "Order not found" }, { status: 404 });
        }

        // Ensure we update product quantity only once
        if (order.status === true) {
            return NextResponse.json({ err: "Order is already completed" }, { status: 400 });
        }

        // update product quantity
        const product = await Product.findById(order.product);
        if (!product) {
            return NextResponse.json({ err: "Product not found" }, { status: 404 });
        }

        const newQuantity = product?.quantity | 0 + order.quantity | 0;
        await Product.findByIdAndUpdate(order.product, { quantity: newQuantity }, { new: true });

        order.status = !order.status; // true
        await order.save();

        return NextResponse.json({ order }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ err: error.message }, { status: 500 });
    }
}
