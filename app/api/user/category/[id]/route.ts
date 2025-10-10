import { NextResponse } from "next/server";

import dbConnect from "@/utils/dbConnect";

import Category from "@/models/category";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();

  const { id } = await params;
  const body = await req.json();

  try {
    const { _id, ...updateBody } = body;
    const updatingCategory = await Category.findByIdAndUpdate(
      id,
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
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();

  const { id } = await params;

  try {
    const deletingCategory = await Category.findByIdAndDelete(id);

    return NextResponse.json({ deletingCategory }, { status: 200 });
  } catch (error: any) {
    //console.log(error);
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}
