"use client";

import { Container } from "@mui/material";
//import Invoices from "@/components/invoices/InvoiceList";
import AddInvoice from "@/components/invoices/AddInvoice";


export default function Pos() {

    return (
        <>
            <Container maxWidth="xl" sx={{width: "100%", height: "100%"}}>
                <AddInvoice />
                {/* <Invoices /> */}
            </Container>
        </>
    )
}