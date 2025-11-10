import React from "react";
import Transactions from "./Transaction";
import Analytics from "./Analytics";
import { Container, Typography } from "@mui/material";
import Ai from "../../../ai/Ai";

const HomePage = () => {
  return (
    <Container maxWidth="xl">
      <Typography
        variant="h4"
        style={{
          fontSize: "3rem",
          color: "#0073e6", // a nice blue color
          marginBottom: "20px",
          textAlign: "center",
          fontWeight: "bold",
          textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)", // Subtle sh
          padding: "10px", // Add padding for better visibility
          borderBottom: "2px solid #0073e6", // underline effect
          letterSpacing: "1px",
        }}
      >
        Welcome to the Inventory System
      </Typography>

      <Ai />

      <Analytics />

      <Typography variant="h5" sx={{ p: "8px" }}>
        Recent Transactions
      </Typography>

      <Transactions />
    </Container>
  );
};

export default HomePage;
