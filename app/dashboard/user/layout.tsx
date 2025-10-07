"use client"

import Admin from "../../components/dashboard/user/User";
import React, { useEffect, useState } from "react";


export default function AdminLayout({children}: {children: React.ReactNode}) {
    return (
        <>
            <Admin>
                <h1>Admin Layout</h1>
                {children}
            </Admin>
        </>
    )
}