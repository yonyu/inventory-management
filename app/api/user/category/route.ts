import { NextResponse } from 'next/server';

import dbConnect from '../../../../utils/dbConnect';

import Category from '../../../../models/category';



export async function GET(req: Request) {
    await dbConnect();

    try {
        const { searchParams } = new URL(req.url);
        const name = searchParams.get('name');
        
        let categories;
        if (name) {
            categories = await Category.find({ name: { $regex: name, $options: 'i' } }).sort({ createdAt: -1 });
        } else {
            categories = await Category.find({}).sort({ createdAt: -1 });
        }
        
        return NextResponse.json({ categories }, { status: 200 });

    } catch(error: any) {
        return NextResponse.json({ err: error.message }, { status: 500 });
    }





}




export async function POST(req: Request) {
    await dbConnect();


    const body = await req.json();
    const { name } = body;




    try {










        const category = await Category.create({ name });


        return NextResponse.json({ category }, { status: 201 });

    } catch(error: any) {
        return NextResponse.json({ err: error.message }, { status: 500 });
    }



}
