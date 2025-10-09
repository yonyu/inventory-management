import { NextResponse } from "next/server";

import dbConnect from "@/utils/dbConnect";

import Category from "@/models/category";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();

  const body = await req.json();

  try {
    const { _id, ...updateBody } = body;
    const updatingCategory = await Category.findByIdAndUpdate(
      params.id,
      updateBody,
      { new: true }
    );

    return NextResponse.json(updatingCategory); //({ updatingCategory }, { status: 200 });
  } catch (error: any) {
    //console.log(error);
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();

  try {
    const deletingCategory = await Category.findByIdAndDelete(params.id);

    return NextResponse.json({ deletingCategory }, { status: 200 });
  } catch (error: any) {
    //console.log(error);
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}
