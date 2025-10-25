import { NextResponse } from "next/server";

import dbConnect from "@/utils/dbConnect";
import Order from "@/models/order";
import Product from "@/models/product";
import Supplier from "@/models/supplier";
import Category from "@/models/category";
//import Unit from "@/models/units";

// Ensure models are registered
// Product;
// Supplier;
// Category;
// Unit;

export async function GET(req: Request) {
    await dbConnect();

    try {
        const { searchParams } = new URL(req.url);
        const order_number = searchParams.get('order_number');

        let orders;
        if (order_number) {
            orders = await Order.find({ order_number: { $regex: order_number, $options: 'i' } })
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
    const body = await req.json();

    try {
        const ordersArray = Array.isArray(body) ? body : [body];
        const savedOrders = await Order.insertMany(ordersArray);
        return NextResponse.json({ orders: savedOrders }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ err: error.message }, { status: 500 });
    }
}