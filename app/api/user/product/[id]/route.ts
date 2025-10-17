import { NextResponse } from "next/server";

import Product from "@/models/product";

import dbConnect from "@/utils/dbConnect";


export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> })
 {
    await dbConnect();

    try {
        const { id } = await params;
        const { ...updateBody } = await req.json();
        if (!updateBody.name) {
            return NextResponse.json({ err: "Name is required" }, { status: 400 });
        };

        const updatingProduct = await Product.findByIdAndUpdate(id, updateBody, { new: true });
        if (!updatingProduct) {
            return NextResponse.json({ err: "Product not found" }, { status: 404 });
        }

        return NextResponse.json(updatingProduct); //({ updatingProduct }, { status: 200 });
    } catch (error: any) {
        //console.log(error);
        return NextResponse.json({ err: error.message }, { status: 500 });
    }   
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    await dbConnect();

    try {
        const { id } = await params;
        const deletingProduct = await Product.findByIdAndDelete(id);
        if (!deletingProduct) {
            return NextResponse.json({ err: "Product not found" }, { status: 404 });
        }

        return NextResponse.json({ deletingProduct: deletingProduct }, { status: 200 });
    } catch (error: any) {
        //console.log(error);
        return NextResponse.json({ err: error.message }, { status: 500 });
    }
}