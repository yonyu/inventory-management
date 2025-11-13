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
        console.log("1. Connecting to DB...");
        await dbConnect();
        console.log("2. DB connected");

        const body = await req.json();
        const { billingPeriod, price } : { billingPeriod: string; price: number} = body;
        console.log("3. Billing-Period", billingPeriod );
        console.log("4. Price", price);

        console.log("5. Getting session...");
        const session = await getServerSession(authOptions);
        console.log("6. Server session", session);
        
        if (!session?.user?.id) {
            console.log("7. No session - Unauthorized");
            return NextResponse.json(
                { err: "Unauthorized" }, 
                { 
                    status: 401,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'POST, OPTIONS',
                        'Access-Control-Allow-Headers': 'Content-Type',
                    }
                }
            );
        }

        console.log("8. Finding user...");
        const user = await User.findOne({ _id: session.user.id });
        if (!user) {
            console.log("9. User not found");
            return NextResponse.json(
                { err: "User not found" }, 
                { 
                    status: 404,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'POST, OPTIONS',
                        'Access-Control-Allow-Headers': 'Content-Type',
                    }
                }
            );
        }
        console.log("10. User found:", user.email);

        console.log("11. Creating Stripe session...");
        const stripeSession = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{ 
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `${billingPeriod} Basic Plan`,
                    },
                    unit_amount: price * 100, // Stripe requires amounts in cents
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

        return NextResponse.json(
            { id: stripeSession.url }, 
            { 
                status: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type',
                }
            }
        );

    } catch(error: any) {
        console.log("ERROR CAUGHT:", error);
        console.log("ERROR MESSAGE:", error.message);
        console.log("ERROR STACK:", error.stack);
        return NextResponse.json(
            { err: error.message || "Something went wrong" }, 
            { 
                status: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type',
                }
            }
        );
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
