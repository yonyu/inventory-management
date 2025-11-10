"use client";

import { Container } from "@mui/material";
import { useSearchParams } from "next/navigation";
import InvoiceListPDF from "@/components/invoice-list-pdf/InvoiceListPDF";
//import AddInvoice from "@/components/invoices/AddInvoice";


export default function Pos() {
    const searchParams = useSearchParams();
    const search = searchParams.get("invoiceid");

    return (
        <>
            <Container maxWidth="xl" sx={{width: "100%", height: "100%"}}>
                <InvoiceListPDF search={search || ""} />     
            </Container>
        </>
    )
}
