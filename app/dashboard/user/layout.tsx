"use client"

import DashboardUser from "../../../components/dashboard/user/User";
import React, { useEffect, useState, useRef } from "react";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';


export default function AdminLayout({children}: {children: React.ReactNode}) {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [plan, setPlan] = useState(false);
    const [subscription, setSubscription] = useState();
    const hasCalledApi = useRef(false);

    const [loading, setIsLoading] = useState(true);

    const fetchSubscription = async () => {
        const userId = (session?.user as any)?._id;

        try {
            const result = await fetch(`${process.env.API}/user/active/${userId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId }),
            });
            const response = await result.json();

            if (!result.ok) {
                toast.error(response?.message);
                router.push("/billing-toggle")
            } else {
                //alert(response?.message);
                setPlan(response?.message);
                //setSubscription(response?.subscription);
                setIsLoading(false);
            }

        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!(session?.user as any)?._id || hasCalledApi.current) return;

        hasCalledApi.current = true;
        fetchSubscription();

    }, [session]);

    

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    return (
        <>
            <DashboardUser>
                {children}
            </DashboardUser>
        </>
    )
}
