import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";


import dbConnect from "@/utils/dbConnect";
import Subscription from "@/models/subscription";
import User from "@/models/user";


export async function POST(req: Request, context: any) {
    await dbConnect();

    const session = await getServerSession(authOptions);

    try {
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const user = await User.findOne({ _id: session.user?._id });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const params = await context?.params;

        const res = params.id?.toString() === user._id.toString();
        console.log("res", res);
        if (!res) {
            console.log("Unauthorized");
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const subscription = await Subscription.findOne({ user: user._id });

        if (!subscription) {
            console.log("Subscription not found");
            return NextResponse.json({ message: "Subscription not found" }, { status: 404 });
        }
        if (subscription.endDate > new Date()) {
            console.log("Subscription already active");
            return NextResponse.json({ message: "Subscription already active" }, { status: 200 });
        } else {
            console.log("Subscription expired");
            return NextResponse.json({ message: "Subscription expired" }, { status: 500 });
        }

        return NextResponse.json({ subscription }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}