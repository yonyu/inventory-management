"use client";

import { Container } from "@mui/material";
import InvoiceList from "@/components/invoice-list/InvoiceList";
//import AddInvoice from "@/components/invoices/AddInvoice";


export default function Pos() {

    return (
        <>
            <Container maxWidth="xl" sx={{width: "100%", height: "100%"}}>
                <InvoiceList />
            </Container>
        </>
    )
}