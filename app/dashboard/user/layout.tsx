"use client"

import DashboardUser from "../../../components/dashboard/user/User";
import React, { useEffect, useState } from "react";

export default function AdminLayout({children}: {children: React.ReactNode}) {
    return (
        <>
            <DashboardUser>
                {children}
            </DashboardUser>
        </>
    )
}
