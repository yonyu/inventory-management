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


import { useAddInvoiceMutation, useGetInvoicesQuery, useDeleteInvoiceMutation/*, useUpdateInvoiceMutation*/ } from "@/lib/features/invoices/invoicesApiSlice";
import { useGetUnitsQuery } from "@/lib/features/units/unitsApiSlice";
import { useGetSuppliersQuery } from "@/lib/features/suppliers/suppliersApiSlice";
import { useGetCategoriesQuery } from "@/lib/features/categories/categoriesApiSlice";
import { useGetCustomersQuery } from "@/lib/features/customers/customersApiSlice";
import { useGetPaymentsQuery } from "@/lib/features/payments/paymentsApiSlice";



const InvoiceTable = () => {

    const dispatch = useAppDispatch();

    const { data: invoiceData, error, isLoading: loading } = useGetInvoicesQuery();
    const { data: unitData } = useGetUnitsQuery();
    const { data: supplierData } = useGetSuppliersQuery();
    const { data: categoryData } = useGetCategoriesQuery();
    const { data: paymentData } = useGetPaymentsQuery();

    let invoices: any;
    invoices = invoiceData?.invoices || [];
    //console.log("Invoices", invoices);
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
    const [newInvoice, setNewInvoice] = useState({
        _id: "",
        name: "",
        supplier: "",
        category: "",
        unit: "",
        status: true,
        quantity: 0,
    });

    const [editInvoice, setEditInvoice] = useState({
        _id: "",
        name: "",
        supplier: "",
        category: "",
        unit: "",
        status: true,
        quantity: 0,
    });

    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
    const [openEditModal, setOpenEditModal] = useState(false);



    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    // const [form, setForm] = React.useState({
    //     _id: "",
    //     name: "",
    //     supplier: "",
    //     category: "",
    //     unit: "",
    //     status: true,
    //     quantity: 0,
    // });

    const [filter, setFilter] = useState("");

    const [addInvoice] = useAddInvoiceMutation();
    const [deleteInvoice] = useDeleteInvoiceMutation();
    //const [updateInvoice] = useUpdateInvoiceMutation();

    
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };


    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        //setForm((prevForm) => ({ ...prevForm, [name]: value }));
        setNewInvoice((prevInvoice) => ({ ...prevInvoice, [name]: value }));

    }

    //const [newInvoiceImagePreview, setNewInvoiceImagePreview] = useState<string | null>(null);

    // Debug: Monitor form changes
    // useEffect(() => {
    //     console.log("Form state changed:", form);
    // }, [form]);

    const handleOpenAddModal = () => {

        setOpenAddModal(true);
    };

    const handleCloseAddModal = () => {
        setOpenAddModal(false);
    };

    const handleAddInvoice = () => {
        //const { _id, ...newInvoice } = form;
        addInvoice(newInvoice)
            .unwrap()
            .then(() => {
                setSnackbar({ open: true, message: "Invoice added successfully", severity: "success", });

                handleCloseAddModal();

            })
            .catch((error: any) => {

                setSnackbar({ open: true, message: error?.data?.err || error?.message || "Failed to add product", severity: "error", });

                console.error("Error adding product:", error);
            });
    }

    const handleCloseDeleteModal = () => setOpenDeleteModal(false);

    const handleOpenDeleteModal = (invoice: any) => {
        setSelectedInvoice(invoice);
        //console.log("Selecting Invoice: ", product);
        //setForm(product);
        setOpenDeleteModal(true);

    }

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

    const handleOpenEditModal = (product: any) => {
        setOpenEditModal(true);
        setSelectedInvoice(product);
        setEditInvoice({ 
            ...product,
            category: typeof product.category === 'object' ? product.category._id : product.category,
            unit: typeof product.unit === 'object' ? product.unit._id : product.unit,
            supplier: typeof product.supplier === 'object' ? product.supplier._id : product.supplier
        });
        //setForm(product);
    };

    const handleCloseEditModal = () => setOpenEditModal(false);

    const handleEditInvoice = () => {
        // const { _id, ...data } = editInvoice;
        // updateInvoice({ _id, data })
        //     .unwrap()
        //     .then(() => {
        //         setSnackbar({ open: true, message: "Invoice updated successfully", severity: "success", });
        //         handleCloseEditModal();
        //     })
        //     .catch((error: any) => {
        //         setSnackbar({ open: true, message: error?.data?.err || error?.message || "Failed to update product", severity: "error", });
        //     });

    }

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
                All Invoices
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
                            <TableCell>S.No</TableCell>
                            <TableCell>Invoice Number</TableCell>
                            <TableCell>Invoice Date</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Customer Name</TableCell>
                            <TableCell>Amount</TableCell>
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
                                    <TableCell>{invoice?.status ? 'Active' : 'Inactive'}</TableCell>
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
                                        <IconButton
                                            onClick={() => handleOpenEditModal(invoice)}
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
                                            onClick={() => handleOpenDeleteModal(invoice)}
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
                    count={filteredInvoices.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{ backgroundColor: "white" }}
                />
            </TableContainer>


            {/* start edit invoice modal */}
            <Modal
                open={openEditModal}
                onClose={handleCloseEditModal}
                aria-labelledby="edit-product-modal"
                aria-describedby="edit-product-modal-description"
                sx={modalBackdropStyle}
            >
                <Box sx={modalStyle}>
                    <Typography id="edit-product-modal" variant="h6" component="h2">
                        Edit Invoice
                    </Typography>

                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Name"
                        name="name"
                        value={editInvoice.name}
                        onChange={(e) => setEditInvoice({...editInvoice, name: e.target.value})}
                        required
                        slotProps={{ inputLabel: { style: { color: 'white', }, }, }}
                        sx={{
                            mt: 2,
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
                    <FormControl fullWidth sx={{ mb: 2}}>
                        <InputLabel>Supplier Name</InputLabel>
                        <Select
                            value={editInvoice.supplier} // _id
                            onChange={(e) => setEditInvoice({...editInvoice, supplier: e.target.value})}
                            sx={{
                                mt: 3,
                                color: "white",
                                ".MuiOutlinedInput-notchedOutline": {
                                    borderColor: 'blue',
                                },
                                "&Mui-focused .MuiOutlinedInput-notchedOutline": {
                                    borderColor: 'blue',
                                },
                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                    borderColor: 'blue',
                                },
                                "& .MuiSvgIcon-root": {
                                    fill: 'white !important',
                                    color: 'white !important',
                                },
                                "& .MuiSelect-select": {
                                    color: 'white',
                                },
                                
                            }}
                            MenuProps={{
                                PaperProps: {
                                    sx: {
                                        bgcolor: 'white',
                                        "&MuiMenuItem-root": {
                                            color: 'white',
                                        }
                                    }
                                }
                            }}
                        >
                            {
                                suppliers && suppliers?.map((s: any, index: number) => (
                                    <MenuItem
                                        key={index}
                                        value={s._id}
                                    >
                                        {s.name}
                                    </MenuItem>

                                  ))
                            }

                        </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 2}}>
                        <InputLabel>Unit Name</InputLabel>
                        <Select
                            value={editInvoice.unit}
                            onChange={(e) => {
                                // const selectedUnit = units.find((unit:any) => unit._id === e.target.value);
                                // setEditInvoice({...editInvoice, unit: selectedUnit});
                                setEditInvoice({...editInvoice, unit: e.target.value});
                            }}
                            sx={{
                                mt: 3,
                                color: "white",
                                ".MuiOutlinedInput-notchedOutline": {
                                    borderColor: 'blue',
                                },
                                "&Mui-focused .MuiOutlinedInput-notchedOutline": {
                                    borderColor: 'blue',
                                },
                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                    borderColor: 'blue',
                                },
                                "& .MuiSvgIcon-root": {
                                    fill: 'white !important',
                                },
                                "& .MuiSelect-select": {
                                    color: 'white',
                                },
                                
                            }}
                            MenuProps={{
                                PaperProps: {
                                    sx: {
                                        bgcolor: 'white',
                                        "&MuiMenuItem-root": {
                                            color: 'white',
                                        }
                                    }
                                }
                            }}
                        >
                            {
                                units && units?.map((u: any, index: number) => (
                                    <MenuItem
                                        key={index}
                                        value={u._id}
                                    >
                                        {u.name}
                                    </MenuItem>

                                  ))
                            }

                        </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 2}}>
                        <InputLabel>Category Name</InputLabel>
                        <Select
                            value={editInvoice.category}
                            onChange={(e) => setEditInvoice({...editInvoice, category: e.target.value})}
                            sx={{
                                mt: 3,
                                color: "white",
                                ".MuiOutlinedInput-notchedOutline": {
                                    borderColor: 'blue',
                                },
                                "&Mui-focused .MuiOutlinedInput-notchedOutline": {
                                    borderColor: 'blue',
                                },
                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                    borderColor: 'blue',
                                },
                                "& .MuiSvgIcon-root": {
                                    fill: 'white !important',
                                },
                                "& .MuiSelect-select": {
                                    color: 'white',
                                },
                                
                            }}
                            MenuProps={{
                                PaperProps: {
                                    sx: {
                                        bgcolor: 'white',
                                        "&MuiMenuItem-root": {
                                            color: 'white',
                                        }
                                    }
                                }
                            }}
                        >
                            {
                                categories && categories?.map((c: any, index: number) => (
                                    <MenuItem
                                        key={index}
                                        value={c._id}
                                    >
                                        {c.name}
                                    </MenuItem>

                                  ))
                            }

                        </Select>
                    </FormControl>

                    <TextField
                        type="number"
                        required
                        fullWidth
                        variant="outlined"
                        label="Quantity"
                        name="quantity"
                        value={editInvoice.quantity || ""}
                        onChange={(e) => setEditInvoice({...editInvoice, quantity: parseInt(e.target.value)})}
                        slotProps={{ inputLabel: { style: { color: 'white', }, }, }}
                        sx={{
                            mt: 2,
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
                    <Button
                        variant="contained"
                        onClick={handleEditInvoice}
                        sx={{
                            mt: 2,
                            backgroundColor: "blue",
                            "&:hover": {
                                backgroundColor: "blue",
                            },
                        }}
                    >
                        Save
                    </Button>
                    <Button
                        variant="contained"
                        sx={{
                            mt: 2,
                            ml: 2,
                            color: "white",
                            borderColor: "blue",
                            "&:hover": {
                                borderColor: "blue",
                            },
                        }}
                        onClick={handleCloseEditModal}
                    >
                        Cancel
                    </Button>
                </Box>
            </Modal>

            {/* end edit invoice modal */}


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
    );
} // end InvoiceTable()


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

export default InvoiceTable;
