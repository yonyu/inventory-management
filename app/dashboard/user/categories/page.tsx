"use client";

import { Container } from "@mui/material";
import AllCategories from "@/components/categories/AllCategories";

export default function Pos() {

    return (
        <>
            <Container maxWidth="xl" sx={{width: "100%", height: "100%"}}>
                <AllCategories />
            </Container>
        </>
    )
}
