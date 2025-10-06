import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/user";
import bcrypt from "bcrypt";
import dbConnect from "@/utils/dbConnect";

export const authOptions = {
    session: {
        strategy: "jwt",
    },
    providers: [
        CredentialsProvider({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }
                
                await dbConnect();
                const { email, password } = credentials;
                const user = await User.findOne({ email });
                
                if (!user?.password) {
                    throw new Error("Please log in via the method you used to sign up");
                }
                
                const isPasswordValid = await bcrypt.compare(password, user.password);
                
                if (!isPasswordValid) {
                    throw new Error("Invalid credentials");
                }
                
                // Return only safe user data (no password!)
                return user; 
                // { 
                //     id: user._id.toString(),
                //     email: user.email,
                //     name: user.name // include other safe fields as needed
                // };
            },
        }),
    ],
};