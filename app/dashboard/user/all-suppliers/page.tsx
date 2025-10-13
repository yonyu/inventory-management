"use client";

import { Container } from "@mui/material";
import Suppliers from "@/components/all-suppliers/AllSuppliers";

export default function Pos() {

    return (
        <>
            <Container maxWidth="xl" sx={{width: "100%", height: "100%"}}>
                <Suppliers />
            </Container>
        </>
    )
}
