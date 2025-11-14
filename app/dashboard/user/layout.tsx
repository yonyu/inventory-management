"use client"

import DashboardUser from "@/components/dashboard/user/User";
import React, { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';
import { Box, CircularProgress, Typography } from "@mui/material";
import { CloudDownload } from "@mui/icons-material";
import { motion } from "framer-motion";

export default function AdminLayout({children}: {children: React.ReactNode}) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const hasCalledApi = useRef(false);

    const fetchSubscription = async () => {
        const userId = (session?.user as any)?._id;
        if (!userId) return;

        try {
            const result = await fetch(`${process.env.API}/user/subscription-check/${userId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }),
            });
            const response = await result.json();

            if (!result.ok) {
                toast.error(response?.message);
                router.push("/billing-toggle");
            } else {
                setIsLoading(false);
            }
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (status === "authenticated" && !hasCalledApi.current) {
            hasCalledApi.current = true;
            fetchSubscription();
        }
    }, [status]); 

    if (status === "loading" || isLoading) {

        return (
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Box
                    sx={{
                        backgroundImage: "url('/images/pos1.png')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100vh",
                        flexDirection: "column",
                        backgroundColor: "rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <CloudDownload sx={{ color: "primary.main", fontSize: 60, mb: 2 }} />
                    <Typography variant="h4" sx={{ color: "white", fontWeight: "bold", textAlign: "center", mb: 2 }}>
                        Loading...
                    </Typography>
                    <CircularProgress size={30} color="primary" />
                </Box>
            </motion.div>
        ); 
    }

    return (
        <DashboardUser>
            {children}
        </DashboardUser>
    )
}
