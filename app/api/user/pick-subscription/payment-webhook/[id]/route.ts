import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth";

import dbConnect from "@/utils/dbConnect";
import { authOptions } from "@/utils/authOptions";
import User from "@/models/user";
import Subscription from "@/models/subscription";
import Transaction from "@/models/transaction";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");


export async function GET(req: Request, {params}: {params: Promise<{id: string}>}) {
    await dbConnect();

    try {
        const userSession = await getServerSession(authOptions);
        if (!userSession?.user?.id) {
            return NextResponse.json({ err: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const stripeSession = await stripe.checkout.sessions.retrieve(id);
        console.log("stripeSession", stripeSession);

        if (stripeSession?.payment_status === "paid") {
            console.log("Payment verified, processing...");
            
            const user = await User.findOne({ _id: userSession.user.id });
            if (!user) {
                console.log("User not found:", userSession.user.id);
                return NextResponse.json({ err: "User not found" }, { status: 404 });
            }
            console.log("User found:", user._id);
            
            const existingSubscription = await Subscription.findOne({ user: user._id });
            console.log("Existing subscription:", existingSubscription);

            const currentDate = new Date();
            const billingPeriod = stripeSession?.metadata?.billing;
            const userId = stripeSession?.metadata?.userId;

            const amount = (stripeSession?.amount_total || 0) / 100;
            console.log("Amount:", amount, "Billing:", billingPeriod);
            
            if (amount === 0) {
                return NextResponse.json({ err: "Amount is zero" }, { status: 400 });
            }

            if (existingSubscription) {
                const baseDate = currentDate < existingSubscription.endDate 
                    ? new Date(existingSubscription.endDate) 
                    : new Date();
                
                if (billingPeriod === "Year") {
                    baseDate.setFullYear(baseDate.getFullYear() + 1);
                } else if (billingPeriod === "Month") {
                    baseDate.setMonth(baseDate.getMonth() + 1);
                }

                await Subscription.findByIdAndUpdate(existingSubscription._id, { endDate: baseDate });
                console.log("Updated existing subscription to:", baseDate);

                const transaction = new Transaction({
                    user: userId,
                    transactionId: stripeSession.id,
                    status: "Completed",
                    paymentMethod: "Credit Card",
                    paymentStatus: "Paid",
                    totalPrice: amount,
                });

                await transaction.save();

            } else {
                const endDate = new Date();

                if (billingPeriod === "Year") {
                    endDate.setFullYear(endDate.getFullYear() + 1);
                } else if (billingPeriod === "Month") {
                    endDate.setMonth(endDate.getMonth() + 1);
                }

                const newSubscription = new Subscription({
                    user: userId,
                    stripeSubscriptionId: stripeSession.id,
                    startDate: new Date(),
                    endDate: endDate,
                    price: amount,
                });
                await newSubscription.save();

                const transaction = new Transaction({
                    user: userId,
                    transactionId: stripeSession.id,
                    status: "Completed",
                    paymentMethod: "Credit Card",
                    paymentStatus: "Paid",
                    totalPrice: amount,
                });

                await transaction.save();

                await User.findByIdAndUpdate(userId, { subscription: newSubscription._id });
            }

            return NextResponse.redirect(`${process.env.CLIENT_URL}/success?session_id=${id}`);
        } else {
            return NextResponse.redirect(`${process.env.CLIENT_URL}/cancel`);
        }

    } catch(error: any) {
        console.log("Payment error:", error);
        return NextResponse.json({ err: error.message || "Payment error. Please try again." }, { status: 500 });
    }
}