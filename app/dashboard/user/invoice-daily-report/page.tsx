"use client";

import { Container } from "@mui/material";
import InvoiceDailyReport from "@/components/invoice-daily-report/InvoiceDailyReport";


export default function Pos() {

    return (
        <>
            <Container maxWidth="xl" sx={{width: "100%", height: "100%"}}>
                <h1
                    style={{
                        fontSize: '3rem',
                        color: '#0073e6',
                        marginBottom: '20px',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
                        padding: '10px',
                        borderBottom: '2px solid #0073e6',
                        letterSpacing: '1px',

                    }}
                >
                    Daily Invoice Report
                </h1>
                
                <InvoiceDailyReport />
            </Container>
        </>
    )
}