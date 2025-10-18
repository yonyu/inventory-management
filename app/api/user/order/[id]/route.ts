import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Order from "@/models/order";


export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> })
 {
    await dbConnect();

    try {
        const { id } = await params;
        const { ...updateBody } = await req.json();
        // if (!updateBody.name) {
        //     return NextResponse.json({ err: "Name is required" }, { status: 400 });
        // };

        const order = await Order.findById(id);
        if (!order) {
            return NextResponse.json({ err: "Order not found" }, { status: 404 });
        }

        if (order.status === true) {
            return NextResponse.json({ err: "Order is already completed" }, { status: 400 });
        }

        const updatingOrder = await Order.findByIdAndUpdate(id, updateBody, { new: true });
        if (!updatingOrder) {
            return NextResponse.json({ err: "Order not found" }, { status: 404 });
        }

        return NextResponse.json({ updatingOrder }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ err: error.message }, { status: 500 });
    }   
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    await dbConnect();

    try {
        const { id } = await params;
        const deletingOrder = await Order.findByIdAndDelete(id);
        if (!deletingOrder) {
            return NextResponse.json({ err: "Order not found" }, { status: 404 });
        }

        return NextResponse.json({ deletingOrder: deletingOrder }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ err: error.message }, { status: 500 });
    }
}