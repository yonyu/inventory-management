import { NextResponse } from "next/server";

import dbConnect from "@/utils/dbConnect";
import Product from "@/models/product";


export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    await dbConnect();

    try {
        const { id } = await params;
        const product = await Product.findById(id);

        return NextResponse.json({ product: product }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ err: error.message }, { status: 500 });
    }
}