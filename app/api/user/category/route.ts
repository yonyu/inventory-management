import { NextResponse } from 'next/server';

import dbConnect from '../../../../utils/dbConnect';

import Category from '../../../../models/category';


export async function GET() {
    await dbConnect();

    try {
        const categories = await Category.find({}).sort({ createdAt: -1});
        return NextResponse.json({ categories }, { status: 200 });

    } catch(error: any) {
        //console.log(error);
        return NextResponse.json({ err: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    await dbConnect();

    try {
        const { name, description } = await req.json();

        const category = await Category.create({ name });

        return NextResponse.json({ category }, { status: 201 });

    } catch(error: any) {
        //console.log(error);
        return NextResponse.json({ err: error.message }, { status: 500 });
    }
}
