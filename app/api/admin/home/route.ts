import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";

import Category from "@/models/category";
import Customer from "@/models/customer";
import Invoice from "@/models/invoice";
import InvoiceDetails from "@/models/invoice-details";
import Payment from "@/models/payment";
import PaymentDetails from "@/models/payment-details";

import Product from "@/models/product";
import Order from "@/models/order"; // purchase is better, some customers bought. order is we order

//import Subscription from "@/models/subscription";

import Supplier from "@/models/supplier";
import Unit from "@/models/unit";


export async function GET() {
    await dbConnect();

    try {
        const categoryCount = await Category.countDocuments({});
        const customerCount = await Customer.countDocuments({});
        const invoiceCount = await Invoice.countDocuments({});
        const invoiceDetailsCount = await InvoiceDetails.countDocuments({});
        const paymentCount = await Payment.countDocuments({});
        const paymentDetailsCount = await PaymentDetails.countDocuments({});
        const productCount = await Product.countDocuments({});
        const orderCount = await Order.countDocuments({});
        //const subscriptionCount = await Subscription.countDocuments({});
        const supplierCount = await Supplier.countDocuments({});
        const unitCount = await Unit.countDocuments({});

        return NextResponse.json({
            categoryCount: categoryCount,
            customerCount: customerCount,
            invoiceCount: invoiceCount,
            invoiceDetailsCount: invoiceDetailsCount,
            paymentCount: paymentCount,
            paymentDetailsCount: paymentDetailsCount,
            productCount: productCount,
            orderCount: orderCount,
            //subscriptionCount: subscriptionCount,
            supplierCount: supplierCount,
            unitCount: unitCount,

        }, { status: 201 });

    } catch (error: any) {
        return NextResponse.json({ err: error.message }, { status: 500 });
    }
}