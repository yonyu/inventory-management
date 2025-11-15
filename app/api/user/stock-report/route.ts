import { NextResponse } from "next/server";

import dbConnect from "@/utils/dbConnect";
import Product from "@/models/product";
import "@/models/category";

export async function GET() {
  try {
    await dbConnect();

    const products = await Product.find({})
      .populate('category');

    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error('Stock report error:', error);
    return NextResponse.json({ err: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
