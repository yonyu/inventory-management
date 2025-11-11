"use client";

import { Container } from "@mui/material";
import Products from "@/components/products/ProductList";

export default function Pos() {

    return (
        <>
            <Container maxWidth="xl" sx={{width: "100%", height: "100%"}}>
                <Products />
            </Container>
        </>
    )
}
