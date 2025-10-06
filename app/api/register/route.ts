import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import dbConnect from "@/utils/dbConnect";
import User from "@/models/user";


export async function POST(req: Request) {
    await dbConnect();
    
    const body = await req.json();
    const { name, email, phone, password } = body;

    try {
        const user = await new User({
            name, 
            email, 
            phone,
            password: await bcrypt.hash(password, 10),
        }).save();

        console.log("User created successfully", user);

        return NextResponse.json({ msg: "User created successfully" }, { 
            status: 201,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            }
        });

    } catch(error) {
        console.log(error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ err: errorMessage }, { 
            status: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            }
        });
    }
}

export async function OPTIONS() {
    return new Response(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}