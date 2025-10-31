import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Customer from "@/models/customer";
import Invoice from "@/models/invoice";
import InvoiceDetails from "@/models/invoice-details";
import Payment from "@/models/payment";
import PaymentDetails from "@/models/payment-details";
import "@/models/category";
import "@/models/product";


interface ICategory {
    name: string;
    //description: string;
    status: boolean;
}

interface ISupplier {
    name: string;
    email: string;
    phone: string;
    address: string;
    status: boolean;
}

interface IProduct {
    name: string;
    quantity: number;
    unit: string;
    category: ICategory;
    supplier: ISupplier;
    description: string;
    status: boolean;
}

interface IInvoice {
    invoiceDate: Date;
    invoiceNumber: string;
    description: string;
    status: boolean;
}

interface IInvoiceDetails {
    date: Date;
    invoice: IInvoice;
    category: ICategory;
    product: string;
    quantity: number;
    unitPrice: number;
    status: boolean;
}

interface ICustomer {
    name: string;
    mobileNumber: string;
    image: string;
    address: string;
    status: boolean;
    email: string;
}

interface IPayment {
    date: Date;
    invoice: IInvoice;
    customer: ICustomer;
    paymentNumber: string;
    description: string;
    status: boolean;
}

interface IPaymentDetails {
    date: Date;
    invoice: IInvoice;
    currentPaidAmount: number;
}




export async function GET(req: Request) {
    await dbConnect();

    try {
        const [invoices, invoiceDetails, payment, paymentDetails] = await Promise.all([
            Invoice.find().sort({ invoiceDate: -1 }),
            InvoiceDetails.find().populate("invoice", "invoiceNumber").populate("product", "name").populate("category", "name").sort({ date: -1 }),
            Payment.find().populate("customer", "name").populate("invoice", "invoiceNumber").sort({ date: -1 }),
            PaymentDetails.find().populate("invoice", "invoiceNumber").sort({ date: -1 })
        ]);

        return NextResponse.json({ invoices, payment, invoiceDetails, paymentDetails }, { status: 200 });
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
            purchaseData: purchaseData,
            status,
        } = await req.json();

        if (!purchaseData || !Array.isArray(purchaseData) || purchaseData.length === 0) {
            return NextResponse.json({ err: "Purchase data is required" }, { status: 400 });
        }

        const parsedPartialAmount = parseFloat(partialAmount) || 0;
        const parsedGrandTotal = parseFloat(grandTotal);
        const parsedDiscount = parseFloat(discount) || 0;
        const parsedPurchaseDate = new Date(date);

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
            invoiceDate: parsedPurchaseDate,
            description,
            status: status === "full_paid",
        });

        const invoice_details = await Promise.all(
            purchaseData.map(async (invoiceDetail: any) => {
                return InvoiceDetails.create({
                    invoice: newInvoice._id,
                    product: invoiceDetail.product,
                    category: invoiceDetail.category,
                    date: invoiceDetail.date,
                    quantity: invoiceDetail.quantity,
                    unitPrice: invoiceDetail.price,
                    totalCost: invoiceDetail.total,
                    discount: invoiceDetail.discount,
                    status: status === "full_paid",
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

        let paidAmount = 0, dueAmount = 0, currentPaidAmount = 0;

        if (status === 'full_paid') {
            paidAmount = parsedGrandTotal;
            currentPaidAmount = parsedGrandTotal;
        } else if (status === 'full_due') {
            dueAmount = parsedGrandTotal;
        } else if (status === 'partial_paid') {
            paidAmount = parsedPartialAmount;
            dueAmount = parsedGrandTotal - parsedPartialAmount;
            currentPaidAmount = parsedPartialAmount;
        } else {
            return NextResponse.json({ err: "Invalid payment status" }, { status: 400 });
        }

        await Payment.create({
            date: parsedPurchaseDate,
            invoice: newInvoice._id,
            customer: customerId,
            status,
            discountAmount: parsedDiscount,
            totalAmount: parsedGrandTotal,
            paidAmount: paidAmount,
            dueAmount: dueAmount,
        });

        await PaymentDetails.create({
            currentPaidAmount: currentPaidAmount,
            invoice: newInvoice._id,
            date: parsedPurchaseDate,
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