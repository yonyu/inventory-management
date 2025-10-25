import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Order from "@/models/order";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    await dbConnect();

    try {
        const { id } = await params;
        
        const order = await Order.findById(id);
        if (!order) {
            return NextResponse.json({ err: "Order not found" }, { status: 404 });
        }

        order.status = !order.status;
        await order.save();

        return NextResponse.json({ order }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ err: error.message }, { status: 500 });
    }
}
