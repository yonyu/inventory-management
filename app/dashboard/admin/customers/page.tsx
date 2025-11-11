"use client";

import { Container } from "@mui/material";
import Customers from "@/components/customers/CustomerList";

export default function Pos() {

    return (
        <>
            <Container maxWidth="xl" sx={{width: "100%", height: "100%"}}>
                <Customers />
            </Container>
        </>
    )
}
