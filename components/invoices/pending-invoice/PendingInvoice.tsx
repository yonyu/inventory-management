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
import { useGetPaymentsQuery } from "@/lib/features/payments/paymentsApiSlice";


const PurchaseTable = () => {

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

    const { data: invoiceData, error, isLoading: loading } = useGetInvoicesQuery();
    const [deleteInvoice, { isLoading: isDeleting }] = useDeleteInvoiceMutation();

    let invoices: any = invoiceData?.invoices || [];
    console.log("Invoices", invoices);

    const { data: paymentData } = useGetPaymentsQuery();
    const payments = paymentData?.payments || [];

    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

    const handleOpenDeleteModal = (invoice: any) => {
        setSelectedInvoice(invoice);
        //console.log("Selecting Invoice: ", invoice);
        setOpenDeleteModal(true);
    }

    const handleCloseDeleteModal = () => setOpenDeleteModal(false);

    const handleDeleteInvoice = (/* selectedInvoice */) => {
        //console.log("Deleting product: ", selectedInvoice);
        deleteInvoice(selectedInvoice?._id).unwrap()
            .then(() => {
                setSnackbar({ open: true, message: "Invoice deleted successfully", severity: "success", });
                handleCloseDeleteModal();

            })
            .catch((error: any) => {
                //console.log("Error deleting product: ", selectedInvoice);
                setSnackbar({ open: true, message: error?.data?.err || error?.message || "Failed to delete product", severity: "error", });
            });
    }

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
                Approve Invoices
            </Typography>

            <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <Button
                        fullWidth
                        variant="contained"
                        startIcon={<Add />}
                        onClick={()=> router.push(`/dashboard/user/invoices`)}
                        sx={{
                            p: 1,
                            backgroundColor: 'blue',                            
                            "&:hover": {
                                borderColor: "blue",
                            },
                            height: '100%',                           
                        }}
                    >
                        Add New Invoice
                    </Button>
                </Grid>
            </Grid>

            {/* <Button
                variant="contained"
                color="primary"
                startIcon={<Refresh />}
                onClick={() => window.location.reload()}
                sx={{
                    backgroundColor: "blue",
                    "&:hover": {
                        backgroundColor: "blue",
                    },
                    height: "100%",
                }}
            >
                Reload
            </Button> */}

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
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>                           
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
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color={invoice?.status ? "success" : "warning"}
                                            style={{
                                                borderRadius: '20px',
                                                padding: '5px 10px,',
                                                minWidth: 'auto',
                                                fontSize: '0.8rem',
                                            }}
                                        >
                                            {invoice?.status ? "Active" : "Pending"}
                                        </Button>
                                    </TableCell>

                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            startIcon={ <AddTaskIcon /> }
                                            onClick={ ()=> router.push(`/dashboard/user/print-invoice?invoiceid=${invoice?._id}`) }
                                            sx={{
                                                m: 1,
                                                borderRadius: '20px',
                                                padding: '5px 10px',
                                                minWidth: 'auto',
                                                fontSize: '0.8rem',
                                            }}
                                        >
                                        </Button>

                                        <Button
                                            variant="outlined"
                                            color="error"
                                            startIcon={<DeleteIcon />}
                                            onClick={()=> handleOpenDeleteModal(invoice)}
                                            sx={{
                                                borderRadius: '20px',
                                                padding: '5px 10px',
                                                minWidth: 'auto',
                                                fontSize: '0.8rem',
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
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

            {/* start delete invoice modal */}
            <Modal
                open={openDeleteModal}
                onClose={handleCloseDeleteModal}
                aria-labelledby="delete-invoice-modal"
                aria-describedby="delet-invoice-modal-description"
                sx={modalBackdropStyle}
            >
                <Box sx={modalStyle}>
                    <Typography id="delete-invoice-modal" variant="h6" component="h2">
                        Delete Invoice
                    </Typography>
                    <Typography sx={{ mt: 2 }}>
                        Are you sure you want to delete
                        &nbsp;&quot;{selectedInvoice?.invoiceNumber}&quot;?
                    </Typography>
                    <Button
                        onClick={handleCloseDeleteModal}
                        variant="outlined"
                        sx={{
                            mt: 2,
                            ml: 2,
                            color: "white",
                            borderColor: "blue",
                            "&:hover": {
                                borderColor: "blue",
                            },
                        }}
                    >
                        Cancel
                    </Button>                    
                    <Button
                        variant="contained"
                        color="error"
                        sx={{
                            mt: 2,
                            backgroundColor: "red",
                            "&:hover": {
                                backgroundColor: "darkred",
                            },
                        }}
                        onClick={handleDeleteInvoice}
                    >
                        Delete
                    </Button>
                </Box>
            </Modal>

            {/* end delete invoice modal */}



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

// Inline styles
const customInputStyle = {
    minWidth: "730px",
    height: "60px",
    borderColor: "blue",
    borderWidth: "2px",
    BorderStyle: "solid",
    backgroundColor: "black",
    color: "white",
    padding: "5px",
    outline: "none",    
};

export default PurchaseTable; // 358
