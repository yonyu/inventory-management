"use client";

import DailyReport from "@/components/daily-order-report/DailyReport";

export default function DailyReportPage() {
    return (
        <div>
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
                Daily Order Report
            </h1>
            <DailyReport />
        </div>
    );
}