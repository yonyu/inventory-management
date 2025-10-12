import { NextResponse } from "next/server";

import dbConnect from "@/utils/dbConnect";

import Unit from "@/models/units";



export async function GET(req: Request){
    await dbConnect();

    try {
        const { searchParams } = new URL(req.url);
        const name = searchParams.get('name');
        
        let units;
        if (name) {
            units = await Unit.find({ name: { $regex: name, $options: 'i' } }).sort({ createdAt: -1 });
        } else {
            units = await Unit.find({}).sort({ createdAt: -1 });
        }
        
        return NextResponse.json({ units }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ err: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    await dbConnect();

    try {
        const { name } = await req.json();

        const unit = await Unit.create({ name });

        return NextResponse.json({ unit }, { status: 201 });

    } catch(error: any) {
        return NextResponse.json({ err: error.message }, { status: 500 });
    }
}
