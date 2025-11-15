import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";

import dbConnect from "@/utils/dbConnect";

import User from "@/models/user";
import Subscription from "@/models/subscription";


export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        await dbConnect();
        const user = await User.findOne({ _id: session?.user?._id });
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        const subscription = await Subscription.findOne({ user: user._id });
        if (!subscription) {
            return NextResponse.json({ message: "Subscription not found" }, { status: 404 });
        }
        return NextResponse.json(subscription, { status: 200 });
    } catch (error) {
        return NextResponse.json({ err: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}