import { NextResponse } from "next/server";

import customer from "@/models/customer";

import dbConnect from "@/utils/dbConnect";


export async function PUT(req: Request, { params }: { params: { id: string } })
 {
    await dbConnect();

    try {
        const { ...updateBody } = await req.json();
        if (!updateBody.name) {
            return NextResponse.json({ err: "Name is required" }, { status: 400 });
        };
        if (!updateBody.address) {
            return NextResponse.json({ err: "Address is required" }, { status: 400 });
        };
        if (!updateBody.mobileNumber) {
            return NextResponse.json({ err: "Mobile Number is required" }, { status: 400 });
        };
        if (!updateBody.image) {
            return NextResponse.json({ err: "Image is required" }, { status: 400 });
        };

        const updatingCustomer = await customer.findByIdAndUpdate(params.id, updateBody, { new: true });
        if (!updatingCustomer) {
            return NextResponse.json({ err: "Customer not found" }, { status: 404 });
        }

        return NextResponse.json(updatingCustomer); //({ updatingCustomer }, { status: 200 });
    } catch (error: any) {
        //console.log(error);
        return NextResponse.json({ err: error.message }, { status: 500 });
    }   
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    await dbConnect();

    try {
        const deletingCustomer = await customer.findByIdAndDelete(params.id);
        if (!deletingCustomer) {
            return NextResponse.json({ err: "Customer not found" }, { status: 404 });
        }

        return NextResponse.json({ deletingCustomer: deletingCustomer }, { status: 200 });
    } catch (error: any) {
        //console.log(error);
        return NextResponse.json({ err: error.message }, { status: 500 });
    }
}