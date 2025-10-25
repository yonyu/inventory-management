import { NextResponse }  from "next/server";

import dbConnect from "@/utils/dbConnect";

import Unit from "@/models/unit";


export async function PUT( req: Request, { params }: { params: Promise<{ id: string }> }) {
    await dbConnect();

    try {
        const { id } = await params;
        const { ...updateBody } = await req.json();
        const updatingUnit = await Unit.findByIdAndUpdate(id, updateBody, { new: true });

        return NextResponse.json(updatingUnit); //({ updatingUnit }, { status: 200 });
    } catch (error: any) {
        //console.log(error);
        return NextResponse.json({ err: error.message }, { status: 500 });
    } 
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    await dbConnect();

    try {
        const { id } = await params;
        const deletingUnit = await Unit.findByIdAndDelete(id);

        return NextResponse.json({ deletingUnit }, { status: 200 });
    } catch (error: any) {
        //console.log(error);
        return NextResponse.json({ err: error.message }, { status: 500 });
    }
}