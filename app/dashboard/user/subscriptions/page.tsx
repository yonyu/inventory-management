"use client";

import { Container } from "@mui/material";

import Subscriptions from "@/components/subscriptions/SubscriptionList";


export default function Pos() {

    return (
        <>
            <Container maxWidth="xl" sx={{width: "100%", height: "100%"}}>
                <Subscriptions />
            </Container>
        </>
    )
}