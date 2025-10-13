import { NextResponse } from "next/server";

import suppplier from "@/models/suppplier";

import dbConnect from "@/utils/dbConnect";


export async function PUT(req: Request, { params } : { params: {id: string}}) {
    await dbConnect();

    try {
        const { ...updateBody } = await req.json();
        const updatingSupp = await suppplier.findByIdAndUpdate(params.id, updateBody, { new: true });

        return NextResponse.json(updatingSupp); //({ updatingSupp }, { status: 200 });
    } catch (error: any) {
        //console.log(error);
        return NextResponse.json({ err: error.message }, { status: 500 });
    }   
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    await dbConnect();

    try {
        const deletingSupp = await suppplier.findByIdAndDelete(params.id);

        return NextResponse.json({ deletingSupp }, { status: 200 });
    } catch (error: any) {
        //console.log(error);
        return NextResponse.json({ err: error.message }, { status: 500 });
    }
}