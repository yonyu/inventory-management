import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth";

import dbConnect from "@/utils/dbConnect";
import { authOptions } from "@/utils/authOptions";
import User from "@/models/user";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export async function POST(req: Request) {
    console.log("POST*** /api/user/billing-toggle");
    try {
        await dbConnect();

        const body = await req.json();
        const { billingPeriod, price } : { billingPeriod: string; price: number} = body;
        console.log("Billing-Period", billingPeriod );
        console.log("Price", price);

        const session = await getServerSession(authOptions);
        console.log("Server session", session);
        
        if (!session?.user?.id) {
            return NextResponse.json({ err: "Unauthorized" }, { status: 401 });
        }

        const user = await User.findOne({ _id: session.user.id });
        if (!user) {
            return NextResponse.json({ err: "User not found" }, { status: 404 });
        }

        const stripeSession = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{ 
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `${billingPeriod} Basic Plan`,
                    },
                    unit_amount: price * 100,
                    // recurring: {
                    //     interval: billingPeriod,
                    // },
                },
                quantity: 1,
            }],
            mode: "payment",
            success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/cancel`,
            customer_email: user?.email,
            metadata: {
                userId: user?._id.toString(),
                billing: billingPeriod,
            },
        });

        console.log("stripeSession", stripeSession);

        return NextResponse.json({ id: stripeSession.url }, { status: 200 });

    } catch(error: any) {
        console.log("error ", error);
        return NextResponse.json({ err: error.message || "Something went wrong" }, { status: 500 });
    }   
}

export async function OPTIONS(req: Request) {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}
