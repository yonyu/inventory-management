"use client";

import { Container } from "@mui/material";
import Units from "@/components/all-units/AllUnits";

export default function Pos() {

    return (
        <>
            <Container maxWidth="xl" sx={{width: "100%", height: "100%"}}>
                <Units />
            </Container>
        </>
    )
}
