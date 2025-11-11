"use client";

// components\invoice-list\InvoiceList.tsx

import React, { useEffect, useState } from "react";

import {
    Box,
    Button,
    TextField,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Paper,
    Snackbar,
    Alert,
} from "@mui/material";

import Grid from '@mui/material/Grid';
import PrintIcon from '@mui/icons-material/Print';
import CircularProgress from "@mui/material/CircularProgress";

import { useRouter } from "next/navigation";

import { useAppSelector, useAppDispatch } from "@/lib/hooks";

import { useAddInvoiceMutation, useGetInvoicesQuery, useDeleteInvoiceMutation } from "@/lib/features/invoices/invoicesApiSlice";
import { useGetUnitsQuery } from "@/lib/features/units/unitsApiSlice";
import { useGetSuppliersQuery } from "@/lib/features/suppliers/suppliersApiSlice";
import { useGetCategoriesQuery } from "@/lib/features/categories/categoriesApiSlice";
import { useGetPaymentsQuery } from "@/lib/features/payments/paymentsApiSlice";


const InvoiceTable = () => {

    const dispatch = useAppDispatch();

    const { data: invoiceData, error, isLoading: loading } = useGetInvoicesQuery();
    const { data: unitData } = useGetUnitsQuery();
    const { data: supplierData } = useGetSuppliersQuery();
    const { data: categoryData } = useGetCategoriesQuery();
    const { data: paymentData } = useGetPaymentsQuery();

    const router = useRouter();

    let invoices: any;
    invoices = invoiceData?.invoices || [];
    //console.log("Invoices", invoices);
    let units: any;
    units = unitData?.units || [];
    //console.log("Units", units);
    let suppliers: any;
    suppliers = supplierData?.suppliers || [];
    //console.log("Suppliers", suppliers);
    let categories: any;
    categories = categoryData?.categories || [];
    //console.log("Categories", categories);

    const [page, setPage] = React.useState(0);

    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const payments = paymentData?.payments || [];

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });


    const [filter, setFilter] = useState("");
    
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const filteredInvoices = invoices.filter((invoice: any) => {
        const searchTerm = filter.toLowerCase().trim();
        return (
            invoice?.invoiceNumber?.toLowerCase().includes(searchTerm) ||
            invoice?.description?.toLowerCase().includes(searchTerm)
        );
    })

    const handleFilterChange = (e: any) => {
        setFilter(e.target.value);
    }

    return (
        <Box sx={{ p: 2, maxWidth: "100%", width: "2048px" }} >
            <Typography variant="h4" sx={{ mb: 2 }}
                style={{
                    fontSize: "3rem",
                    color: "0073e6", // a nice blue color
                    marginBottom: "20px", // 1rem = 16px
                    textAlign: "center",
                    fontWeight: "bold",
                    textShadow: "1px 1px 2px rgba(109, 71, 71, 0.2)", // add a subtle shadow
                    padding: "10px",
                    borderBottom: "2px solid #0073e6", // underline effect
                    letterSpacing: "1px",
                }}

            >
                Invoice List
            </Typography>


            <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid size={{ xs: 12, sm: 12 }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Search......"

                        value={filter}
                        onChange={handleFilterChange}

                        sx={{
                            input: { color: "white", },
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                    borderColor: "blue",
                                },
                                "&:hover fieldset": {
                                    borderColor: "blue",
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: "blue",
                                },
                            },
                        }}
                    />
                </Grid>
            </Grid>

            <TableContainer component={Paper} sx={{ overflowX: 'auto' }} >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>S.No</TableCell>
                            <TableCell>Invoice Number</TableCell>
                            <TableCell>Invoice Date</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Customer Name</TableCell>
                            <TableCell>Amount</TableCell>                   
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={3}>
                                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }} >
                                        <CircularProgress color="inherit" />
                                        <Typography sx={{ ml: 2 }}>Loading...</Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ) : error ? (
                            <TableRow>
                                <TableCell colSpan={3}>Error: {JSON.stringify(error)}</TableCell>
                            </TableRow>
                        ) : (
                            filteredInvoices.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((invoice: any, index: number) => (
                                <TableRow key={invoice._id}>
                                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                    <TableCell>{invoice?.invoiceNumber}</TableCell>
                                    <TableCell>{new Date(invoice?.invoiceDate).toLocaleDateString()}</TableCell>
                                    <TableCell>{invoice?.description}</TableCell>
                                    {
                                        (() => {
                                            const matchingPayment = Array.isArray(payments) ? payments.find((payment: any) => payment?.invoice?._id?.toString() === invoice._id.toString()) : null;
                                            const customerName = matchingPayment && typeof matchingPayment.customer === 'object' ? matchingPayment.customer.name : 'n/a';
                                            return (
                                                <>
                                                    <TableCell>{customerName}</TableCell>
                                                    <TableCell>{matchingPayment?.totalAmount || 'n/a'}</TableCell>
                                                </>
                                            );
                                        })()
                                    }

                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredInvoices.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{ backgroundColor: "white" }}
                />
            </TableContainer>

            {/* snackbar */}
            <Snackbar
                open={snackbar.open}
                onClose={handleCloseSnackbar}
                autoHideDuration={6000}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity as "success" | "error" | "info" | "warning" | undefined}
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>

        </Box>
    );
} // end InvoiceTable()

export default InvoiceTable;
