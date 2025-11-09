"use client";

import React, { useState, useEffect } from "react";
import {
    Alert,
    Box, Button, TextField, Typography, Paper,
    IconButton,
    Modal,
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

import DeleteIcon from "@mui/icons-material/Delete";
import PrintIcon from "@mui/icons-material/Print";
import AddTaskIcon from "@mui/icons-material/AddTask";
import { Add, Delete, Edit, Refresh } from "@mui/icons-material";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";

import CircularProgress from "@mui/material/CircularProgress";

import { useRouter } from "next/navigation";


import { useGetInvoicesQuery, useDeleteInvoiceMutation } from "@/lib/features/invoices/invoicesApiSlice";
import { useApproveInvoiceMutation, useApproveAndUpdateMutation } from "@/lib/features/invoice-approve/invoicesApproveApiSlice";
import { useGetPaymentsQuery } from "@/lib/features/payments/paymentsApiSlice";
import { useGetInvoiceDetailsByInvoiceQuery, useGetInvoiceWithDetailsQuery } from "@/lib/features/invoice-details/invoiceDetailsApiSlice";

const InvoiceTable = ({search}: {search: string})=> {
    //console.log("Search: ", search);

    const dispatch = useAppDispatch();
    const router = useRouter();

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

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

    const [deleteInvoice, { isLoading: isDeleting }] = useDeleteInvoiceMutation();
    const [approveAndUpdate] = useApproveAndUpdateMutation();

    const { data: details, isLoading: loading, error } = useGetInvoiceWithDetailsQuery(search, {
        skip: !search
    });

    const invoices = details?.invoice ? [details.invoice] : [];
    const invoiceDetails = details?.invoiceDetails || [];
    const payments = details?.payment || [];
    const paymentDetails = details?.paymentDetails || [];

    useEffect(() => {
        if (invoices.length > 0) {
            setSelectedInvoice(invoices[0]);
        }
    }, [invoices]);

    const subTotal = invoiceDetails && invoiceDetails?.reduce((acc: number, item: any)=> acc+item.totalCost, 0);

    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

    const handleOpenDeleteModal = (invoice: any) => {
        setSelectedInvoice(invoice);
        //console.log("Selecting Invoice: ", invoice);
        setOpenDeleteModal(true);
    }



    const handleCloseDeleteModal = () => setOpenDeleteModal(false);

    const [filter, setFilter] = useState("");

    const handleFilterChange = (e: any) => {
        setFilter(e.target.value);
    }

    const filteredInvoices = invoices.filter((invoice: any) => {
        const searchTerm = filter.toLowerCase().trim();
        return (
            invoice?.invoiceNumber?.toLowerCase().includes(searchTerm) ||
            invoice?.description?.toLowerCase().includes(searchTerm)
        );
    })

    const handleApprove = async () =>  {
        if (!selectedInvoice?._id) {
            setSnackbar({ open: true, message: "No invoice selected", severity: "error" });
            return;
        }

        // for (const detail of invoiceDetails) {
        //     console.log("Invoice Detail: ", detail);
        //     // const product = detail.product;
        //     // const quantity = detail.quantity;

        //     // if (product.quantity < quantity) {
        //     //     setSnackbar({ open: true, message: `Insufficient stock of ${product.name}`, severity: "error" });
        //     //     return;
        //     // }
        // }

        const formattedDetails = invoiceDetails.map((detail: any) => ({
            product: detail.product._id || detail.product,
            invoice: selectedInvoice._id,
            quantity: detail.quantity
        }));

        //console.log("Formatted Details:", formattedDetails);

        try {
            await approveAndUpdate(formattedDetails).unwrap();
            setSnackbar({ open: true, message: "Invoice approved successfully", severity: "success" });
        } catch(error: any) {
            setSnackbar({ open: true, message: error?.data?.err || "Failed to approve the invoice", severity: "error" });
            //console.log("Error Approving Invoice: ", error);
        }
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
                    textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)", // add a subtle shadow
                    padding: "10px",
                    borderBottom: "2px solid #0073e6", // underline effect
                    letterSpacing: "1px",
                }}

            >
                Print Invoice
            </Typography>

            <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <Button
                        fullWidth
                        variant="contained"
                        startIcon={<PrintIcon />}
                        //onClick={()=> router.push(`/dashboard/user/invoices`)}
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


            <Box
            
            >
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

                <TableContainer component={Paper} sx={{ overflowX: 'auto', mt: 4 }} >
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


                            <TableRow>

                                <TableCell colSpan={7} align="center">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={ handleApprove }

                                    >
                                        Approve
                                    </Button>
                                </TableCell>
                            </TableRow>


                        </TableBody>
                    </Table>

                </TableContainer>

            </Box>


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


const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "#000",
    border: "2px solid blue",
    boxShadow: 24,
    borderRadius: 2,
    p: 4,
    color: "white",
};

const modalBackdropStyle = {
    backdropFilter: "blur(5px)",
    WebkitBackdropFilter: "blur(5px)",
};

export default InvoiceTable;