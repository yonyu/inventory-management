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
    
    
if (status === "loading" || isLoading)
{  
    return (
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 1 }}        
        >
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",

                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                
                backgroundColor: "rgba(0, 0, 0, 0.4)",

                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',

                justifyContent: "center",
                alignItems: "center",

                zIndex: 9999,
            }}
        >
            <CloudDownload sx={{ color: "blue", fontSize: 60, marginBottom: 2, animation: 'spin 2s infinite linear' }} />
            <Typography variant="h4" sx={{ color: "white", fontWeight: "bold", mb: 3 }}>
                Loading...
            </Typography>
            <CircularProgress size={60} color="primary" sx={{ marginTop: 2 }} />
        </Box>
        </motion.div>
    )
    

}

    return (
        <DashboardUser>

            {children}
        </DashboardUser>
    )
}
