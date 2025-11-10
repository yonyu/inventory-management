"use client";

import Pages from "@/components/dashboard/admin/dashboard/Pages";
import ChartDisplay from "@/components/admin/chart";

export default function Pos() {

    return (
        <>
            <Pages />

            <div style={{ padding: "20px" }}>
                <ChartDisplay />  
            </div>
        </>
    )
}
