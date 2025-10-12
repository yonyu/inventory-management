import { NextResponse }  from "next/server";

import dbConnect from "@/utils/dbConnect";

import Unit from "@/models/units";
export async function PUT( req: Request, { params }: { params: { id: string } }) {
    await dbConnect();

    try {
        const { ...updateBody } = await req.json();
        const updatingUnit = await Unit.findByIdAndUpdate(params.id, updateBody, { new: true });

        return NextResponse.json(updatingUnit); //({ updatingUnit }, { status: 200 });
    } catch (error: any) {
        //console.log(error);
        return NextResponse.json({ err: error.message }, { status: 500 });
    } 
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    await dbConnect();

    try {
        const deletingUnit = await Unit.findByIdAndDelete(params.id);

        return NextResponse.json({ deletingUnit }, { status: 200 });
    } catch (error: any) {
        //console.log(error);
        return NextResponse.json({ err: error.message }, { status: 500 });
    }
}