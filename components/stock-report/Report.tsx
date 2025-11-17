"use client";

import { useState, useEffect, useRef } from "react";

import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

import Grid from "@mui/material/Grid";
import PrintIcon from "@mui/icons-material/Print";

import { useGetPaymentsQuery } from "@/lib/features/payments/paymentsApiSlice";

import SnapPOS from "@/components/nav/SnapPOS";

const StockReport = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [stockReport, setStockReport] = useState([]);

  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const response = await fetch("/api/user/stock-report", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      const products = data.products;
      setStockReport(products);
    } catch (error) {
      console.error("Error fetching report:", error);
    }
  };

  const printTable = () => {
    if (!tableRef.current) return;
    const printContent = tableRef.current.innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent;
    window.print();

    // This destroys the React component tree, making it impossible to print again.
    //document.body.innerHTML = originalConent; // restore the content;
    // Reloads the page to restore the React component tree, so that it can be printed again.
    window.location.reload();
  };

  return (
    <>
      <Box ref={tableRef}>
        <h1
          style={{
            fontSize: "3rem",
            color: "#0073E6",
            marginBottom: "20px",
            textAlign: "center",
            fontWeight: "bold",
            textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
            padding: "10px",
            borderBottom: "2px solid #0073E6",
            letterSpacing: "1px",
          }}
        >
          Stock Report
        </h1>
        <SnapPOS />

        <Table
          sx={{
            backgroundColor: "white",
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>S.No</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Category Name</TableCell>
              <TableCell>Stock</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stockReport &&
              stockReport
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((product: any, index: number) => (
                  <TableRow key={product._id}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{product?.name}</TableCell>
                    <TableCell>
                      {typeof product?.category === "object"
                        ? product?.category?.name
                        : product?.category}
                    </TableCell>
                    <TableCell>{product?.quantity}</TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid sx={{ xs: 12, sm: 12 }}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<PrintIcon />}
              onClick={printTable}
              sx={{
                p: 3,
                alignContent: "center",
                backgroundColor: "blue",
                "&:hover": {
                  backgroundColor: "blue",
                },
                height: "100%",
                minWidth: "600px",
              }}
            >
              Print
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default StockReport;
