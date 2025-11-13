import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth";

import dbConnect from "@/utils/dbConnect";
import { authOptions } from "@/utils/authOptions";
import User from "@/models/user";
import subscription from "@/models/subscription";
import MoneyOrder from "@/models/money-order";
import Subscription from "@/models/subscription"
import { current } from "@reduxjs/toolkit";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");


export async function GET(req: Request, {params}: {params: {id: string}}) {
    await dbConnect();

    try {
        const userSession = await getServerSession(authOptions);
        if (!userSession?.user?.id) {
            return NextResponse.json({ err: "Unauthorized" }, { status: 401 });
        }


        // const { searchParams } = new URL(req.url);
        // const sessionId = searchParams.get("session_id");

        // if (!sessionId) {
        //     return NextResponse.json({ err: "Session ID not found" }, { status: 400 });
        // }

        const stripeSession = await stripe.checkout.sessions.retrieve(/*sessionId*/params.id);
        console.log("stripeSession", stripeSession);

        if (stripeSession?.payment_status === "paid") {
            const user = await User.findOne({ _id: userSession.user.id });
            if (!user) {
                return NextResponse.json({ err: "User not found" }, { status: 404 });
            }
            //console.log("user", user);
            const existingSubscription = Subscription.findOne({ userId: user._id });

            const currentDate = new Date();

            const startDate = new Date();
            const endDate = new Date();
            const billingPeriod = stripeSession?.metadata?.billing;
            const userId = stripeSession?.metadata?.userId;

            const amount = (stripeSession?.amount_total || 0) / 100;
            if (amount === 0) {
                return NextResponse.json({ err: "Amount is zero" }, { status: 400 });
            }

            if (existingSubscription) {
                if (currentDate < existingSubscription.endDate) {
                    const updatedEndDate = new Date(existingSubscription.endDate);
                    if (billingPeriod === "Year") {
                        updatedEndDate.setFullYear(updatedEndDate.getFullYear() + 1);
                    } else if (billingPeriod === "Month") {
                        updatedEndDate.setMonth(updatedEndDate.getMonth() + 1);                       
                    }
                    existingSubscription.endDate = updatedEndDate;

                    const moneyOrder = new MoneyOrder({
                        user: userId,
                        transactionId: stripeSession.id,
                        status: "Completed",
                        paymentMethod: "Credit Card",
                        paymentStatus: "Paid",
                        totalPrice: amount,

                    });

                    await moneyOrder.save();

                } else {
                    const newEndDate = new Date();
                    if (billingPeriod === "Year") {
                        newEndDate.setFullYear(newEndDate.getFullYear() + 1);
                    } else if (billingPeriod === "Month") {
                        newEndDate.setMonth(newEndDate.getMonth() + 1);
                    }
                    existingSubscription.endDate = newEndDate;

                    const moneyOrder = new MoneyOrder({
                        user: userId,
                        transactionId: stripeSession.id,
                        status: "Completed",
                        paymentMethod: "Credit Card",
                        paymentStatus: "Paid",
                        totalPrice: amount,

                    });

                    await moneyOrder.save();
                }

                await existingSubscription.save();

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

                const moneyOrder = new MoneyOrder({
                    user: userId,
                    transactionId: stripeSession.id,
                    status: "Completed",
                    paymentMethod: "Credit Card",
                    paymentStatus: "Paid",
                    totalPrice: amount,
                });

                await moneyOrder.save();

                await User.findByIdAndUpdate(userId, { subscription: newSubscription._id });
            }

            return NextResponse.json({ message: "Payment verified" }, { status: 200 });


            // const subscription = await stripe.subscriptions.retrieve(stripeSession.subscription as string);

            // await User.findByIdAndUpdate(user._id, {
            //     isSubscribed: true,
            //     subscription: {
            //         id: subscription.id,
            //         billing: subscription.metadata.billing,
            //         startDate,
            //         endDate,
            //     },
            // });

            // await MoneyOrder.create({
            //     userId: user._id,
            //     amount: subscription.plan.amount / 100,
            //     currency: subscription.plan.currency,
            //     status: "paid",
            //     subscriptionId: subscription.id,
            //     billing: subscription.metadata.billing,
            //     startDate,
            //     endDate,
            // });

            //return NextResponse.redirect(`${process.env.CLIENT_URL}/success?session_id=${sessionId}`);
        } else {
            return NextResponse.redirect(`${process.env.CLIENT_URL}/cancel`);
        }

    } catch(error: any) {
        console.log("Payment error:", error);
        return NextResponse.json({ err: error.message || "Payment error. Please try again." }, { status: 500 });
    }
}