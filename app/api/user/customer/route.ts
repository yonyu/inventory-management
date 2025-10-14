import { NextResponse } from "next/server";

import dbConnect from "@/utils/dbConnect";

import customer from "@/models/customer";


export async function GET(req: Request) {
    await dbConnect();

    try {
        const { searchParams } = new URL(req.url);
        const name = searchParams.get('name');

        let customers;
        if (name) {
            customers = await customer.find({ name: { $regex: name, $options: 'i' } }).sort({ createdAt: -1 });
        } else {
            customers = await customer.find({}).sort({ createdAt: -1 });
        }

        return NextResponse.json({ customers: customers }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ err: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    await dbConnect();

    try {
        const { name, email, phone, address, status } = await req.json();

        const cust = await customer.create({ name, email, phone, address, status });

        return NextResponse.json({ cust }, { status: 201 });

    } catch (error: any) {
        return NextResponse.json({ err: error.message }, { status: 500 });
    }
}

