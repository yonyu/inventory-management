"use client"

import DashboardAdmin from "../../../components/dashboard/admin/Admin"; // DashboardAdmin can be any name that makes sense
import React, { useEffect, useState } from "react";

export default function AdminLayout({children}: {children: React.ReactNode}) {
    return (
        <>
            <DashboardAdmin>
                {children}
            </DashboardAdmin>
        </>
    )
}
