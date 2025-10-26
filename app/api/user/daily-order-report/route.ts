import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";

import Order from "@/models/order";

export async function POST(req: Request) {
    await dbConnect();

    try {
        const { startDate, endDate } = await req.json();

        const start = new Date(startDate);
        const end = new Date(endDate);

        end.setHours(23, 59, 59, 999);

        const query = {
            date: {
                $gte: start,
                $lte: end,
            },
        };

        const orders = await Order.find(query)
            .populate("supplier")
            .populate("category")
            .populate("product")
            .sort({ date: -1 });

        console.log("Orders: ", orders);

        return NextResponse.json({ orders }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ err: error.message }, { status: 500 });
    }
}
