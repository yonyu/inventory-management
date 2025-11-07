"use client";

import { Container } from "@mui/material";
import PendingInvoice from "@/components/invoices/pending-invoice/PendingInvoice";

export default function Pos() {
    return (
        <>
            <Container maxWidth="xl" sx={{width: "100%", height: "100%"}}>
                <PendingInvoice />
            </Container>
        </>
    )
}
