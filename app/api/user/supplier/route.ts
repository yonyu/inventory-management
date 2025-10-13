import { NextResponse } from "next/server";

import dbConnect from "@/utils/dbConnect";

import suppplier from "@/models/suppplier";


export async function GET(req: Request) {
    await dbConnect();

    try {
        const { searchParams } = new URL(req.url);
        const name = searchParams.get('name');

        let supppliers;
        if (name) {
            supppliers = await suppplier.find({ name: { $regex: name, $options: 'i' } }).sort({ createdAt: -1 });
        } else {
            supppliers = await suppplier.find({}).sort({ createdAt: -1 });
        }

        return NextResponse.json({ suppliers: supppliers }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ err: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    await dbConnect();

    try {
        const { name, email, phone, address, status } = await req.json();

        const supp = await suppplier.create({ name, email, phone, address, status });

        return NextResponse.json({ supp }, { status: 201 });

    } catch (error: any) {
        return NextResponse.json({ err: error.message }, { status: 500 });
    }
}