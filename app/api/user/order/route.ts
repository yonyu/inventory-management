import { NextResponse } from "next/server";

import dbConnect from "@/utils/dbConnect";
import Order from "@/models/order";

export async function GET(req: Request) {
    await dbConnect();

    try {
        const { searchParams } = new URL(req.url);
        const name = searchParams.get('name');

        let orders;
        if (name) {
            orders = await Order.find({ name: { $regex: name, $options: 'i' } })
                .populate('product')
                .populate('category')
                .populate('supplier');
        } else {
            orders = await Order.find({})
                .populate('product')
                .populate('category')
                .populate('supplier');
        }

        return NextResponse.json({ orders: orders }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ err: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    await dbConnect();
    //const body = await req.json();

    try {
        // const savedOrder = await Promise.all(body.map(async (orderData: any) => {
        //     const order = await Order.create({ 
        //         product: orderData.product,
        //         supplier: orderData.supplier,
        //         category: orderData.category,
        //         date: orderData.date,
        //         order_number: orderData.order_number,
        //         description: orderData.description,
        //         quantity: orderData.quantity,
        //         unit_price: orderData.unit_price,
        //         total_cost: orderData.total_cost,
        //         status: orderData.status,
        //         deletedAt: orderData.deletedAt,
        //         deleted: orderData.deleted
        //     });
        //     return order;
        // }));

        // return NextResponse.json({ order: savedOrder }, { status: 201 });


        const { product, supplier, category, date, order_number, decription, quantity, unit_price, total_cost, status, deletedAt, deleted } = await req.json();

        const order = await Order.create({ product, supplier, category, date, order_number, decription, quantity, unit_price, total_cost, status, deletedAt, deleted });

        return NextResponse.json({ order: order }, { status: 201 });

    } catch (error: any) {
        return NextResponse.json({ err: error.message }, { status: 500 });
    }
}