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
                router.push("/pick-subscription");
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

    return (
        <DashboardUser>
            {(status === "loading" || isLoading) && (
                <Box
                    sx={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        backgroundColor: "rgba(0, 0, 0, 0.4)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                        zIndex: 9999,
                    }}
                >
                    <CloudDownload sx={{ color: "primary.main", fontSize: 60, mb: 2 }} />
                    <Typography variant="h4" sx={{ color: "white", fontWeight: "bold", textAlign: "center", mb: 2 }}>
                        Loading...
                    </Typography>
                    <CircularProgress size={30} color="primary" />
                </Box>
            )}
            {children}
        </DashboardUser>
    )
}
