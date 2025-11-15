"use client";

import { Container } from "@mui/material";

import Transactions from "@/components/transactions/TransactionList";


export default function Pos() {

    return (
        <>
            <Container maxWidth="xl" sx={{width: "100%", height: "100%"}}>
                <Transactions />
            </Container>
        </>
    )
}