import { NextResponse } from "next/server";

import dbConnect from "@/utils/dbConnect";
import Supplier from "@/models/supplier";
import Category from "@/models/category";
import Product from "@/models/product";

export async function GET() {
  try {
    await dbConnect();

    const suppliers = await Supplier.find({});

    const categories = await Category.find({});

    // const products = await Product.find({})
    //   .populate('category');

    return NextResponse.json({ suppliers, categories }, { status: 200 });
  } catch (error) {
    //console.error('Stock report error:', error);
    return NextResponse.json({ err: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export async function POST(request: Request) {

  try {
    await dbConnect();

    const { reportType, name } = await request.json();
    console.log(reportType, name);

    const data = reportType === "supplier" 
      ? await Product.find({ supplier: name })
        .populate('supplier')
        .populate('category') 
      : await Product.find({ category: name })
        .populate('supplier')
        .populate('category');

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ err: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

