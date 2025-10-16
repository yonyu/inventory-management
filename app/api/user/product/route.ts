import { NextResponse } from "next/server";

import dbConnect from "@/utils/dbConnect";

import product from "@/models/product";


export async function GET(req: Request) {
    await dbConnect();

    try {
        const { searchParams } = new URL(req.url);
        const name = searchParams.get('name');

        let products;
        if (name) {
            products = await product.find({ name: { $regex: name, $options: 'i' } })
                .populate('unit')
                .populate('category')
                .populate('supplier');            
        } else {
            products = await product.find({})
                .populate('unit')
                .populate('category')
                .populate('supplier');
        }

        return NextResponse.json({ products: products }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ err: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    await dbConnect();

    try {
        const { name, quantity, status, unit, category, supplier } = await req.json();

        const prdct = await product.create({ name, quantity, status, unit, category, supplier });

        return NextResponse.json({ prdct: prdct }, { status: 201 });

    } catch (error: any) {
        return NextResponse.json({ err: error.message }, { status: 500 });
    }
}

