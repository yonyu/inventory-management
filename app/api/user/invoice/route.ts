import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Customer from "@/models/customer";
import Invoice from "@/models/invoice";
import InvoiceDetails from "@/models/invoice_details";
import Payment from "@/models/payment";
import PaymentDetails from "@/models/payment_details";
import "@/models/category";
import "@/models/product";


export async function GET(req: Request) {
    await dbConnect();

    try {
        const [invoice, invoiceDetails, payment, paymentDetails] = await Promise.all([
            Invoice.find().populate("customer", "name").sort({ date: -1 }),
            InvoiceDetails.find().populate("invoice", "invoiceNumber").populate("product", "name").sort({ date: -1 }),
            Payment.find().populate("customer", "name").populate("invoice", "invoiceNumber").sort({ date: -1 }),
            PaymentDetails.find().populate("payment", "paymentNumber").populate("product", "name").sort({ date: -1 })
        ]);

        return NextResponse.json({ invoice, payment, invoiceDetails, paymentDetails }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ err: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    await dbConnect();

    try {
        const {
            date,
            grandTotal,
            partialAmount,
            selectedCustomer,
            name,
            email,
            phone,
            discount,
            description,
            purchace_data,
            purchaseDate,
            status,
        } = await req.json();

        if (!purchace_data || !Array.isArray(purchace_data) || purchace_data.length === 0) {
            return NextResponse.json({ err: "Purchase data is required" }, { status: 400 });
        }

        const parsedPartialAmount = parseFloat(partialAmount) || 0;
        const parsedGrandTotal = parseFloat(grandTotal);
        const parsedDiscount = parseFloat(discount) || 0;
        const parsedPurchaseDate = new Date(purchaseDate);

        if (isNaN(parsedGrandTotal) || parsedGrandTotal <= 0) {
            return NextResponse.json({ err: "Invalid grand total" }, { status: 400 });
        }
        if (parsedGrandTotal < parsedPartialAmount) {
            return NextResponse.json({ err: "Partial amount cannot be greater than grand total" }, { status: 400 });
        }
        if (parsedPartialAmount < 0 || parsedDiscount < 0) {
            return NextResponse.json({ err: "Amount and discount cannot be negative" }, { status: 400 });
        }
        if (parsedPurchaseDate > new Date()) {
            return NextResponse.json({ err: "Purchase date cannot be in the future" }, { status: 400 });
        }

        const invoiceNumber = generateInvoiceNumber();

        const newInvoice = await Invoice.create({
            invoiceNumber,
            date,
            grandTotal: parsedGrandTotal,
            partialAmount: parsedPartialAmount,
            customer: selectedCustomer,
            name,
            email,
            phone,
            discount: parsedDiscount,
            description,
            purchaseDate: parsedPurchaseDate,
            status

        });

        const invoice_details = await Promise.all(
            purchace_data.map(async (invoiceDetail: any) => {
                return InvoiceDetails.create({
                    invoice: newInvoice._id,
                    product: invoiceDetail.product,
                    category: invoiceDetail.category,
                    date: invoiceDetail.date,
                    quantity: invoiceDetail.quantity,
                    unit_price: invoiceDetail.price,
                    total: invoiceDetail.total,
                    discount: invoiceDetail.discount,
                    status: true,
                });
            })
        );

        let customerId = selectedCustomer;

        if (selectedCustomer === 'new_customer') {
            const new_customer = await Customer.create({
                name,
                email,
                mobileNumber: phone,
            });
            customerId = new_customer._id;
        }

        let paid_amount = 0, due_amount = 0, current_paid_amount = 0;

        if (status === 'full_paid') {
            paid_amount = parsedGrandTotal;
            current_paid_amount = parsedGrandTotal;
        } else if (status === 'full_due') {
            due_amount = parsedGrandTotal;
        } else if (status === 'partial_paid') {
            paid_amount = parsedPartialAmount;
            due_amount = parsedGrandTotal - parsedPartialAmount;
            current_paid_amount = parsedPartialAmount;
        } else {
            return NextResponse.json({ err: "Invalid payment status" }, { status: 400 });
        }

        await Payment.create({
            invoice: newInvoice._id,
            customer: customerId,
            status,
            discount_amount: parsedDiscount,
            total_amount: parsedGrandTotal,
            paid_amount,
            due_amount,
        });

        await PaymentDetails.create({
            current_paid_amount,
            invoice: newInvoice._id,
            date
        });

        return NextResponse.json({ msg: "Data inserted successfully", invoiceNumber }, { status: 201 });

    } catch (error: any) {
        return NextResponse.json({ err: error.message }, { status: 500 });
    }
}

const generateInvoiceNumber = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');

    const randomDigits = Math.floor(1000 + Math.random() * 9000);

    const invoiceNumber = `INV-${year}${month}${day}${randomDigits}`;

    return invoiceNumber;
};