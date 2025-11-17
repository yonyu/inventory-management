"use client";

import React, { useState, useEffect, useRef } from "react";
import {
    Alert,
    Box, Button, Typography, Paper,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination

} from "@mui/material";

import Grid from "@mui/material/Grid";
import PrintIcon from "@mui/icons-material/Print";
import CircularProgress from "@mui/material/CircularProgress";

import { useRouter } from "next/navigation";

import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { useDeleteInvoiceMutation } from "@/lib/features/invoices/invoicesApiSlice";
import { useApproveAndUpdateMutation } from "@/lib/features/invoice-approve/invoicesApproveApiSlice";
import { useGetInvoiceWithDetailsQuery } from "@/lib/features/invoice-details/invoiceDetailsApiSlice";

const InvoiceTable = ({search}: {search: string})=> {
    //console.log("Search: ", search);

    const dispatch = useAppDispatch();
    const router = useRouter();

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const tableRef = useRef<HTMLDivElement>(null);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const { data: details, isLoading: loading, error } = useGetInvoiceWithDetailsQuery(search, {
        skip: !search
    });

    const invoices = details?.invoice ? [details.invoice] : [];
    const invoiceDetails = details?.invoiceDetails || [];
    const payments = details?.payment || [];

    useEffect(() => {
        if (invoices.length > 0) {
            setSelectedInvoice(invoices[0]);
        }
    }, [invoices]);

    const subTotal = invoiceDetails && invoiceDetails?.reduce((acc: number, item: any)=> acc+item.totalCost, 0);

    const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

    const printTable = () => {
        if (!tableRef.current) return;
        const printContent = tableRef.current.innerHTML;
        const originalConent = document.body.innerHTML;
        document.body.innerHTML = printContent;
        window.print();

        //document.body.innerHTML = originalConent; // restore the content; but it destroys the React component tree, making it impossible to print again. 
        // Reloads the page to restore the React component tree, so that it can be printed again.
        window.location.reload();
    }

    
    return ( 
        <Box sx={{ p: 2 }} >
            {/* Page Title */}
            <Typography variant="h4" sx={{ mb: 2 }}
                style={{
                    fontSize: "3rem",
                    color: "0073e6", // a nice blue color
                    marginBottom: "20px", // 1rem = 16px
                    textAlign: "center",
                    fontWeight: "bold",
                    textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)", // add a subtle shadow
                    padding: "10px",
                    borderBottom: "2px solid #0073e6", // underline effect
                    letterSpacing: "1px",
                }}

            >
                Print Invoice
            </Typography>
            {/* End Page Title */}

            {/* Print button */}
            <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <Button
                        fullWidth
                        variant="contained"
                        startIcon={<PrintIcon />}
                        onClick={printTable}
                        sx={{
                            p: 1,
                            backgroundColor: 'blue',                            
                            "&:hover": {
                                borderColor: "blue",
                            },
                            height: '100%',                           
                        }}
                    >
                        Print
                    </Button>
                </Grid>
            </Grid>
            {/* End Print button */}

            {/* Begin table zone */}
            <Box
                ref={tableRef}
            >
                {/* Invoice & cutomer briefs */}
                <TableContainer component={Paper} sx={{ overflowX: 'auto', mt: 4 }} >
                    <Table>

                        <TableBody>

                            <TableRow key={1}>
                                <TableCell colSpan={2}>
                                    <div>Invoice: #{selectedInvoice?.invoiceNumber}</div>
                                    <div>Date: {new Date(selectedInvoice?.invoiceDate).toLocaleDateString()}</div>
                                </TableCell>
                            </TableRow>

                            <TableRow key={3}>
                                <TableCell colSpan={2}>
                                    <div>Customer Details</div>
                                    <div>Name: {payments[0]?.customer?.name}</div>
                                    <div>Email: {payments[0]?.customer?.email}</div>
                                    <div>Phone: {payments[0]?.customer?.mobileNumber}</div>
                                </TableCell>
                            </TableRow>

                        </TableBody>
                    </Table>

                </TableContainer>
                {/* End Invoice & cutomer briefs */}
                
                {/* Invoice List */}
                <TableContainer component={Paper} sx={{ overflowX: 'auto', mt: 2 }} >
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
                                invoices.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((invoice: any, index: number) => (
                                    <TableRow key={invoice._id}>
                                        <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                        <TableCell>{invoice?.invoiceNumber}</TableCell>
                                        <TableCell>{new Date(invoice?.invoiceDate).toLocaleDateString()}</TableCell>
                                        <TableCell>{invoice?.description}</TableCell>
                                        <TableCell>{payments[0]?.customer?.name || 'n/a'}</TableCell>
                                        <TableCell>{payments[0]?.totalAmount || 'n/a'}</TableCell>
                                        
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={invoices.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        sx={{ backgroundColor: "white" }}
                    />
                </TableContainer>
                {/* End Invoice List */}

                {/* Invoice Details */}
                <TableContainer component={Paper} sx={{ overflowX: 'auto', mt: 2 }} >
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Sl</TableCell>
                                <TableCell align="center">Category</TableCell>
                                <TableCell align="center">Product Name</TableCell>
                                <TableCell align="center">Current Stock</TableCell>
                                <TableCell align="center">Quantity</TableCell>
                                <TableCell align="center">Unit Price</TableCell>
                                <TableCell align="center">Total Price</TableCell>                       
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {
                                invoiceDetails.map((details: any, index: number) => (
                                    <TableRow key={index}>
                                        <TableCell align="center">{index + 1}</TableCell>
                                        <TableCell align="center">{details?.category.name}</TableCell>
                                        <TableCell align="center">{details?.product.name}</TableCell>
                                        <TableCell align="center">{details?.product.quantity}</TableCell>
                                        <TableCell align="center">{details?.quantity}</TableCell>
                                        <TableCell align="center">{details?.unitPrice}</TableCell>
                                        <TableCell align="center">{details?.totalCost}</TableCell>

                                    </TableRow>
                                ))
                            }

                            {/* Subtotal row */}
                            <TableRow>
                                <TableCell colSpan={6} align="right" style={{fontWeight:'bold'}}>
                                    Subtotal
                                </TableCell>
                                <TableCell align="center" style={{fontWeight:'bold'}}>
                                    ${subTotal}
                                </TableCell>
                            </TableRow>
                            {/* End Subtotal row */}

                            {/* Begin payment details */}
                            {payments && payments.map((payment: any, index: number) => (
                                <React.Fragment key={payment._id}>
                                    <TableRow>
                                        <TableCell colSpan={6} align="right" style={{fontWeight:'bold'}}>
                                            Discount
                                        </TableCell>
                                        <TableCell align="center" style={{fontWeight:'bold'}}>
                                            ${payment.discountAmount}
                                        </TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell colSpan={6} align="right" style={{fontWeight:'bold'}}>
                                            Paid Amount
                                        </TableCell>
                                        <TableCell align="center" style={{fontWeight:'bold'}}>
                                            ${payment.paidAmount}
                                        </TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell colSpan={6} align="right" style={{fontWeight:'bold'}}>
                                            Due Amount
                                        </TableCell>
                                        <TableCell align="center" style={{fontWeight:'bold'}}>
                                            ${payment.dueAmount}
                                        </TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell colSpan={6} align="right" style={{fontWeight:'bold'}}>
                                            Grand Amount
                                        </TableCell>
                                        <TableCell align="center" style={{fontWeight:'bold'}}>
                                            ${payment.totalAmount}
                                        </TableCell>
                                    </TableRow>
                                </React.Fragment>

                            ))}
                            {/* End payment details */}
                        </TableBody>
                    </Table>

                </TableContainer>
                {/* End Invoice Details */}

            </Box>
            {/* End table zone */}


            {/* snackbar */}
            <Snackbar
                open={snackbar.open}
                onClose={handleCloseSnackbar}
                autoHideDuration={6000}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
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
    )    
}

export default InvoiceTable;