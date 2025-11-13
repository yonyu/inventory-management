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

        const res = context?.paramss.id?.toString() === user._id.toString();
        console.log("res", res);


        const subscription = await Subscription.findOne({ user: user._id });

        if (!subscription) {
            return NextResponse.json({ message: "Subscription not found" }, { status: 404 });
        }

        return NextResponse.json({ subscription }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}