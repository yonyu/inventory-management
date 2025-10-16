import { NextResponse } from "next/server";

import supplier from "@/models/supplier";

import dbConnect from "@/utils/dbConnect";


export async function PUT(req: Request, { params } : { params: {id: string}}) {
    await dbConnect();

    try {
        const { ...updateBody } = await req.json();
        if (!updateBody.name) {
            return NextResponse.json({ err: "Name is required" }, { status: 400 });
        };
        if (!updateBody.email) {
            return NextResponse.json({ err: "Email is required" }, { status: 400 });
        };
        if (!updateBody.phone) {
            return NextResponse.json({ err: "Phone is required" }, { status: 400 });
        };
        if (!updateBody.address) {
            return NextResponse.json({ err: "Address is required" }, { status: 400 });
        };

        const updatingSupp = await supplier.findByIdAndUpdate(params.id, updateBody, { new: true });
        if (!updatingSupp) {
            return NextResponse.json({ err: "Supplier not found" }, { status: 404 });
        }

        return NextResponse.json(updatingSupp); //({ updatingSupp }, { status: 200 });
    } catch (error: any) {
        //console.log(error);
        return NextResponse.json({ err: error.message }, { status: 500 });
    }   
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    await dbConnect();

    try {
        const deletingSupp = await supplier.findByIdAndDelete(params.id);
        if (!deletingSupp) {
            return NextResponse.json({ err: "Supplier not found" }, { status: 404 });
        }

        return NextResponse.json({ deletingSupp }, { status: 200 });
    } catch (error: any) {
        //console.log(error);
        return NextResponse.json({ err: error.message }, { status: 500 });
    }
}