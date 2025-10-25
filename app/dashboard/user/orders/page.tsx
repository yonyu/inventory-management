"use client";

import React from "react";
import { Container } from "@mui/material";
import Orders from "@/components/orders/OrderList"
import AddOrder from "@/components/orders/AddOrder";

export default function OrderPage() {
    return (
        <>
            <Container maxWidth="xl" sx={{ width: "100%", height: "100%" }}>
                <AddOrder />
            </Container>
        </>
    );
}
