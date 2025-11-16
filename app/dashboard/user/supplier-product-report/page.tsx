"use client";

import { Container } from "@mui/material";
import Report from "@/components/supplier-product-report/Report";

export default function Pos() {

    return (
        <>
            <Container maxWidth="xl" sx={{width: "100%", height: "100%"}}>
                <Report />
            </Container>
        </>
    )
}
