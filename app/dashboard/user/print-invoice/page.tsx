"use client";


import { useSearchParams } from "next/navigation";



import PrintInvoicePage from "@/components/print-invoice/Print";

export default function Pos() {

    const searchParams = useSearchParams();

    const search = searchParams.get("invoiceid");

    // URL -> `dashboard?invoiceid=690d981862d713045354aa69`

    return (
        <>
            <PrintInvoicePage search={search || ""} />       
        </>
    )
}
