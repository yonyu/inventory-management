"use client";

import { useSearchParams } from "next/navigation";
import InvoiceListPDF from "@/components/invoice-list-pdf/InvoiceListPDF";


export default function Pos() {
    const searchParams = useSearchParams();
    const search = searchParams.get("invoiceid");

    return (
        <>
            <InvoiceListPDF search={search || ""} />     
        </>
    )
}
