import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";

import dbConnect from "@/utils/dbConnect";

//import User from "@/models/user";
import Transaction from "@/models/transaction";


export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        await dbConnect();
        const transactions = await Transaction.find({ user: session?.user?._id });
        return NextResponse.json(transactions, { status: 200 });
    } catch (error) {
        return NextResponse.json({ err: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}
