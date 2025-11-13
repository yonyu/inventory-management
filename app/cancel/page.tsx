"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Typography } from "@mui/material";
import { FaTimesCircle } from "react-icons/fa";
import { motion } from "framer-motion";


const Failure = () => {
    const router = useRouter();

    useEffect(() => {

        const timer = setTimeout(() => {
            router.push("/billing-toggle");
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
                backgroundColor: "black",//"#141414",
                textAlign: "center",
            }}
        >
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <FaTimesCircle size={100} color="#F44336" />
            </motion.div>
            <Typography variant="h4" gutterBottom>
                Payment Failed!
            </Typography>
            <Typography variant="body1" gutterBottom>
                Unfortunately, your payment was not successful. Please try again. Redirecting to billing...
            </Typography>

            <Button
                type="submit"
                variant="contained"
                color="secondary"
                onClick={ ()=> router.push("/billing-toggle")}
                // sx={{
                //     backgroundColor: 'blue',
                //     color: 'white',
                //     "&:hover": {
                //         backgroundColor: 'blue',
                //     },

                // }}
            >
                Try Again
            </Button>
        </Box>
    );
}

export default Failure;
