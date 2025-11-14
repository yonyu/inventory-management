"use client";

import React, { useEffect, useState } from "react";

import {
    Box,
    Button,
    TextField,
    Typography,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Paper,
    Modal,
    Snackbar,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";

import Grid from '@mui/material/Grid';
import { Edit, Delete, Add, Refresh } from "@mui/icons-material";
import CircularProgress from "@mui/material/CircularProgress";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


import { useAppSelector, useAppDispatch } from "@/lib/hooks";


import { useAddTransactionMutation, useGetTransactionsQuery, useDeleteTransactionMutation } from "@/lib/features/subscriptions/transactionsApiSlice";
import { useGetUnitsQuery } from "@/lib/features/units/unitsApiSlice";
import { useGetSuppliersQuery } from "@/lib/features/suppliers/suppliersApiSlice";
import { useGetCategoriesQuery } from "@/lib/features/categories/categoriesApiSlice";
import { useGetCustomersQuery } from "@/lib/features/customers/customersApiSlice";
import { useGetPaymentsQuery } from "@/lib/features/payments/paymentsApiSlice";



const TransactionTable = () => {

    const dispatch = useAppDispatch();

    const { data: transactionData, error, isLoading: loading } = useGetTransactionsQuery();
    const { data: unitData } = useGetUnitsQuery();
    const { data: supplierData } = useGetSuppliersQuery();
    const { data: categoryData } = useGetCategoriesQuery();
    const { data: paymentData } = useGetPaymentsQuery();

    let transactions: any;
    transactions = transactionData?.transactions || [];
    //console.log("Transactions", transactions);
    let units: any;
    units = unitData?.units || [];
    console.log("Units", units);
    let suppliers: any;
    suppliers = supplierData?.suppliers || [];
    console.log("Suppliers", suppliers);
    let categories: any;
    categories = categoryData?.categories || [];
    console.log("Categories", categories);

    const [page, setPage] = React.useState(0);

    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const payments = paymentData?.payments || [];

    const [openAddModal, setOpenAddModal] = React.useState(false);
    const [newTransaction, setNewTransaction] = useState({
        user: "",
        stripeTransactionId: "",
        startDate: new Date(),
        endDate: new Date(),
        price: 0,
    });

    const [editTransaction, setEditTransaction] = useState({
        user: "",
        stripeTransactionId: "",
        startDate: new Date(),
        endDate: new Date(),
        price: 0,
    });

    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
    const [openEditModal, setOpenEditModal] = useState(false);



    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const [filter, setFilter] = useState("");

    const [addTransaction] = useAddTransactionMutation();
    const [deleteTransaction] = useDeleteTransactionMutation();

    
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };


    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setNewTransaction((prevTransaction) => ({ ...prevTransaction, [name]: value }));

    }


    const handleOpenAddModal = () => {

        setOpenAddModal(true);
    };

    const handleCloseAddModal = () => {
        setOpenAddModal(false);
    };

    const handleAddTransaction = () => {
        //const { _id, ...newTransaction } = form;
        addTransaction(newTransaction)
            .unwrap()
            .then(() => {
                setSnackbar({ open: true, message: "Transaction added successfully", severity: "success", });

                handleCloseAddModal();

            })
            .catch((error: any) => {

                setSnackbar({ open: true, message: error?.data?.err || error?.message || "Failed to add product", severity: "error", });

                console.error("Error adding product:", error);
            });
    }

    const handleCloseDeleteModal = () => setOpenDeleteModal(false);

    const handleOpenDeleteModal = (transaction: any) => {
        setSelectedTransaction(transaction);
        //console.log("Selecting Transaction: ", product);
        //setForm(product);
        setOpenDeleteModal(true);

    }

    const handleDeleteTransaction = (/* selectedTransaction */) => {
        //console.log("Deleting product: ", selectedTransaction);
        deleteTransaction(selectedTransaction?._id).unwrap()
            .then(() => {
                setSnackbar({ open: true, message: "Transaction deleted successfully", severity: "success", });
                handleCloseDeleteModal();

            })
            .catch((error: any) => {
                //console.log("Error deleting product: ", selectedTransaction);
                setSnackbar({ open: true, message: error?.data?.err || error?.message || "Failed to delete product", severity: "error", });
            });
    }

    const handleOpenEditModal = (product: any) => {
        setOpenEditModal(true);
        setSelectedTransaction(product);
        setEditTransaction({ 
            ...product,
            category: typeof product.category === 'object' ? product.category._id : product.category,
            unit: typeof product.unit === 'object' ? product.unit._id : product.unit,
            supplier: typeof product.supplier === 'object' ? product.supplier._id : product.supplier
        });
        //setForm(product);
    };

    const handleCloseEditModal = () => setOpenEditModal(false);

    const handleEditTransaction = () => {
        // const { _id, ...data } = editTransaction;
        // updateTransaction({ _id, data })
        //     .unwrap()
        //     .then(() => {
        //         setSnackbar({ open: true, message: "Transaction updated successfully", severity: "success", });
        //         handleCloseEditModal();
        //     })
        //     .catch((error: any) => {
        //         setSnackbar({ open: true, message: error?.data?.err || error?.message || "Failed to update product", severity: "error", });
        //     });

    }

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const filteredTransactions = transactions.filter((transaction: any) => {
        const searchTerm = filter.toLowerCase().trim();
        return (
            transaction?.transactionNumber?.toLowerCase().includes(searchTerm) ||
            transaction?.description?.toLowerCase().includes(searchTerm)
        );
    })


    const handleFilterChange = (e: any) => {
        setFilter(e.target.value);
    }

    if (loading) {
        return (
            <p
                style={{
                    marginTop: 30,
                    textAlign: "center",
                    color: "grey",
                    fontSize: 20,
                }}
           
            >
                Loading transactions ...
            </p>
        );
    }

    if (error) {
        return (
            <p
                style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: "#D32F2F", // Red color for error
                    textAlign: "center",
                    marginTop: '20px',
                    padding: '10px',
                    backgroundColor: '#FFEBEE', // Lighter red background
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
            >
                Error: error loading transactions!
            </p>
        );
    }

    return (
<>
        <div style={{ padding: '10px', maxWidth: '1400px', margin: '4px'}}>
            <h2

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
                Your transactions
            </h2>


            {filteredTransactions.length === 0 ? (
                <p style={{ textAlign: 'center', fontSize: '18px', color: '#999' }}>No transactions found</p>
            ) : (
                // Add reponsive container with horizontal scrollbar 122
                <div style={{ overflowX: 'auto'}}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#FFFFFF', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                        <thead>
                            <tr style={{ backgroundColor: 'blue', color: '#FFFFFF'}}>
                                <th style={{ padding: '10px', textAlign: 'left', fontSize: '16px', whiteSpace: 'nowrap' }}>S.No</th>
                                <th style={{ padding: '10px', textAlign: 'left', fontSize: '16px', whiteSpace: 'nowrap' }}>ID</th>
                                <th style={{ padding: '10px', textAlign: 'left', fontSize: '16px', whiteSpace: 'nowrap' }}>Status</th>
                                <th style={{ padding: '10px', textAlign: 'left', fontSize: '16px', whiteSpace: 'nowrap' }}>Payment Method</th>
                                <th style={{ padding: '10px', textAlign: 'left', fontSize: '16px', whiteSpace: 'nowrap' }}>Payment Status</th>
                                <th style={{ padding: '10px', textAlign: 'left', fontSize: '16px', whiteSpace: 'nowrap' }}>Stripe Transaction ID</th>
                                <th style={{ padding: '10px', textAlign: 'left', fontSize: '16px', whiteSpace: 'nowrap' }}>Total Price</th>
                                <th style={{ padding: '10px', textAlign: 'left', fontSize: '16px', whiteSpace: 'nowrap' }}>Transaction Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.map((transaction: any, index: number) => ( // 137
                                <tr key={transaction._id} style={{ transition: 'background-color 0.3s ease', cursor: 'pointer' }}>
                                    <td style={{ padding: '10px', textAlign: 'left', fontSize: '16px', whiteSpace: 'nowrap' }}>{index + 1}</td>
                                    <td style={{ padding: '10px', textAlign: 'left', fontSize: '16px', whiteSpace: 'nowrap' }}>{transaction._id}</td>
                                    <td style={{ padding: '10px', textAlign: 'left', fontSize: '16px', whiteSpace: 'nowrap' }}>{transaction.status}</td>
                                    <td style={{ padding: '10px', textAlign: 'left', fontSize: '16px', whiteSpace: 'nowrap' }}>{transaction.paymentMethod}</td>
                                    <td style={{ padding: '10px', textAlign: 'left', fontSize: '16px', whiteSpace: 'nowrap' }}>{transaction.paymentStatus}</td>
                                    <td style={{ padding: '10px', textAlign: 'left', fontSize: '16px', whiteSpace: 'nowrap' }}>{transaction.transactionId}</td>
                                    <td style={{ padding: '10px', textAlign: 'left', fontSize: '16px', whiteSpace: 'nowrap' }}>{transaction.totalPrice}</td>
                                    <td style={{ padding: '10px', textAlign: 'left', fontSize: '16px', whiteSpace: 'nowrap' }}>{new Date(transaction.createdAt).toLocaleString()}</td>
                                </tr> // 146
                            ))}
                        </tbody>
                    </table>
                </div>
            )

            
            }
        </div>





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
                Your transactions
            </Typography>










            <Button
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
            </Button>

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
                            <TableCell style={{ padding: '10px', textAlign: 'left', fontSize: '16px', whiteSpace: 'nowrap' }}>S.No</TableCell>
                            <TableCell>ID</TableCell>
                            <TableCell>User Name</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Payment Method</TableCell>
                            <TableCell>Payment Status</TableCell>
                            <TableCell>Stripe Transaction ID</TableCell>
                            <TableCell>Total Price</TableCell>
                            <TableCell>Create At</TableCell>
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
                            filteredTransactions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((transaction: any, index: number) => (
                                <TableRow key={transaction._id} style={{ backgroundColor: 'blue', color: '#FFFFFF', transition: 'background-color 0.3s' }}>
                                    <TableCell style={{ padding: '20px', fontSize: '14px', whiteSpace: 'nowrap', color: 'black' }}>{page * rowsPerPage + index + 1}</TableCell>
                                    <TableCell>{transaction?._id}</TableCell>
                                    <TableCell>{transaction?.user}</TableCell>
                                    <TableCell>{transaction?.status}</TableCell>
                                    <TableCell>{transaction?.paymentMethod}</TableCell>
                                    <TableCell>{transaction?.paymentStatus}</TableCell>
                                    <TableCell>{transaction?.transactionId}</TableCell>                                  
                                    <TableCell>{transaction?.totalPrice}</TableCell>
                                    <TableCell>{new Date(transaction?.createdAt).toLocaleDateString()}</TableCell>                                  

                                    <TableCell>
                                        <IconButton
                                            onClick={() => handleOpenEditModal(transaction)}
                                            sx={{ color: "blue" }}
                                        >
                                            <Edit
                                                sx={{
                                                    color: "blue",
                                                    "&:hover": {
                                                        color: "darkred",
                                                    },
                                                }}
                                            />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => handleOpenDeleteModal(transaction)}
                                        >
                                            <Delete
                                                sx={{
                                                    color: "red",
                                                    "&:hover": {
                                                        color: "darkred",
                                                    },
                                                }}
                                            />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredTransactions.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{ backgroundColor: "white" }}
                />
            </TableContainer>




            {/* start delete transaction modal */}
            <Modal
                open={openDeleteModal}
                onClose={handleCloseDeleteModal}
                aria-labelledby="delete-transaction-modal"
                aria-describedby="delet-transaction-modal-description"
                sx={modalBackdropStyle}
            >
                <Box sx={modalStyle}>
                    <Typography id="delete-transaction-modal" variant="h6" component="h2">
                        Delete Transaction
                    </Typography>
                    <Typography sx={{ mt: 2 }}>
                        Are you sure you want to delete
                        &nbsp;&quot;{selectedTransaction?.user}&quot;?
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
                        onClick={handleDeleteTransaction}
                    >
                        Delete
                    </Button>
                </Box>
            </Modal>

            {/* end delete transaction modal */}


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

</>
    );
} // end TransactionTable()


const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-90%, -90%)",
    backgroundcolor: "black",
    p: 4,
    borderRadius: 2,
    boxShadow: 24,
    width: "90%",
    maxWidth: "600px",

    border: "2px solid #000",
    color: "white",
};

const modalBackdropStyle = {
    backdropFilter: "blur(5px)",
};

export default TransactionTable;
