"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Typography } from "@mui/material";
import { FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";


const Success = () => {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push("/dashboard/user");
        }, 10000);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                // backgroundColor: "#141414",
                // color: "#ffffff",
                textAlign: "center",
            }}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <FaCheckCircle size={100} color="#4CAF50" />
            </motion.div>
            <Typography variant="h4" gutterBottom>
                Payment Successful!
            </Typography>
            <Typography variant="body1" gutterBottom>
                Thank you for your subscription. Redirecting to dashboard...
            </Typography>

            <Button
                type="submit"
                variant="contained"
                onClick={ ()=> router.push("/dashboard/user")}
                sx={{
                    backgroundColor: 'blue',
                    color: 'white',
                    "&:hover": {
                        backgroundColor: 'blue',
                    },

                }}
            >
                Go to Dashboard
            </Button>
        </Box>
    );
}

export default Success;