"use client";

import { Container } from "@mui/material";

import Transactions from "@/components/subscriptions/TransactionList";


export default function Pos() {

    return (
        <>
            <Container maxWidth="xl" sx={{width: "100%", height: "100%"}}>
                <Transactions />
            </Container>
        </>
    )
}