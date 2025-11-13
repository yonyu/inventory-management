"use client"

import DashboardUser from "../../../components/dashboard/user/User";
import React, { useEffect, useState } from "react";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLayout({children}: {children: React.ReactNode}) {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [plan, setPlan] = useState();
    const [subscription, setSubscription] = useState();

    const [loading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!session?.user?.id) return;
        const fetchSubscription = async () => {
            const userId = session?.user?.id;

            try {
                const res = await fetch(`${process.env.API}/user/active/${userId}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ userId }),
                });
                const data = await res.json();

                if (!res.ok) {
                    toast.error(data.message);
                    router.push("/billing-toggle")
                } else {
                    console.log(data);
                    setPlan(data?.msg);
                    //setSubscription(data.subscription);
                    setIsLoading(false);
                }

            } catch (error) {
                console.log(error);
                setIsLoading(false);
            }


        };
        // if (status === "unauthenticated") {
        //     router.push("/login");
        // }
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
