"use client"

import DashboardUser from "../../../components/dashboard/user/User";
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

    const [plan, setPlan] = useState(false);
    const [subscription, setSubscription] = useState();

    useEffect(() => {
        if (!(session?.user as any)?._id || hasCalledApi.current) return;

        hasCalledApi.current = true;
        fetchSubscription();

    }, [session]);


    const fetchSubscription = async () => {
        const userId = (session?.user as any)?._id;

        try {
            const result = await fetch(`${process.env.API}/user/active/${userId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId }),
            });
            const response = await result.json();

            if (!result.ok) {
                toast.error(response?.message);
                router.push("/billing-toggle")
            } else {
                //alert(response?.message);
                setPlan(response?.message);
                //setSubscription(response?.subscription);
                setIsLoading(false);
            }

        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    }; 

    // if (status === "loading") {
    //     return <div>Loading...</div>;
    // }

    //if (status === "loading") {
    if (isLoading) {

        return (
            <>
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 1 }}           
            >

                <Box
                    sx={{
                        backgroundImage: "url('/images/pos1.png')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100vh",
                        backgroundColor: "rgba(0, 0, 0, 0.1)",
                        borderRadius: "16px",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        padding: 4,
                        flexDirection: "column",
                    }}
                >
                    <CloudDownload 
                        sx={{
                            color: "blue",
                            fontSize: 60,

                            marginBottom: 2,
                            animation: "spin 2s linear infinite", // Add a CSS animation for rotation
                        }}
                    />

                    <Typography
                        variant="h4"
                        sx={{
                            color: "#FFFFFF",
                            fontWeight: "bold",
                            marginBottom: 3,
                        }}
                    >
                        Loading...
                        <CircularProgress size={60} color="primary" sx={{ marginLeft: 2, marginTop: 1}}/>

                    </Typography>
                </Box>
            </motion.div>
            </>
        ); 
    }

    return (
        <>
            <DashboardUser>
                {children}
            </DashboardUser>
        </>
    )
}
