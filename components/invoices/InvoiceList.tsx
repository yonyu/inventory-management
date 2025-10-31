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


const InvoiceTable = () => {

    const dispatch = useAppDispatch();

    const { data: productData, error, isLoading: loading } = useGetInvoicesQuery();
    const { data: unitData } = useGetUnitsQuery();
    const { data: supplierData } = useGetSuppliersQuery();
    const { data: categoryData } = useGetCategoriesQuery();

    let invoices: any;
    invoices = productData?.invoices || [];
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

    const handleOpenDeleteModal = (product: any) => {
        setSelectedInvoice(product);
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


    const filteredInvoices = invoices.filter((product: any) =>

        product?.name?.toLowerCase().includes(filter.toLowerCase())
    )


    const handleFilterChange = (e: any) => {
        setFilter(e.target.value);
    }

    return (
        <Box sx={{ p: 2, maxWidth: "100%", width: "1024px" }} >
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
                Invoices
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
                <Grid size={{ xs: 12, sm: 6 }}>
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
                <Grid size={{ xs: 12, sm: 4 }}>     {/* <Grid item xs={12} sm={4}> */}
                    <Button
                        fullWidth
                        variant="contained"
                        startIcon={<Add />}
                        onClick={handleOpenAddModal}
                        sx={{
                            backgroundColor: "blue",
                            "&:hover": {
                                backgroundColor: "blue",
                            },
                            height: "100%",
                        }}
                    >
                        Add Invoice
                    </Button>
                </Grid>
            </Grid>

            <TableContainer component={Paper} sx={{ overflowX: 'auto' }} >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>S.No</TableCell>
                            <TableCell>Invoice Name</TableCell>
                            <TableCell>Supplier Name</TableCell>
                            <TableCell>Unit Name</TableCell>
                            <TableCell>Category Name</TableCell>
                            <TableCell>Quantity</TableCell>
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
                            filteredInvoices.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((product: any, index: number) => (
                                <TableRow key={product._id}>
                                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                    <TableCell>{product?.name}</TableCell>
                                    <TableCell>{product?.supplier?.name}</TableCell>
                                    <TableCell>{product?.unit?.name}</TableCell>
                                    <TableCell>{product?.category?.name}</TableCell>
                                    <TableCell>{product?.quantity}</TableCell>
                                    <TableCell>
                                        <IconButton
                                            onClick={() => handleOpenEditModal(product)}
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
                                            onClick={() => handleOpenDeleteModal(product)}
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

            {/* start add product modal */}
            <Modal
                open={openAddModal}
                onClose={handleCloseAddModal}
                aria-labelledby="add-product-modal"
                aria-describedby="add-product-modal-description"
                sx={modalBackdropStyle}
            >
                <Box sx={modalStyle}>
                    <Typography id="add-product-modal" variant="h6" component="h2">
                        Add Invoice
                    </Typography>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Name"
                        name="name"
                        value={newInvoice.name}
                        onChange={(e) => setNewInvoice({ ...newInvoice, name: e.target.value })}
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
                            value={newInvoice.supplier}
                            onChange={(e) => setNewInvoice({...newInvoice, supplier: e.target.value})}
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
                            value={newInvoice.unit}
                            onChange={(e) => setNewInvoice({...newInvoice, unit: e.target.value})}
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
                            value={newInvoice.category}
                            onChange={(e) => setNewInvoice({...newInvoice, category: e.target.value})}
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
                        value={newInvoice.quantity || ""}
                        onChange={handleFormChange}
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
                        sx={{
                            mt: 2,
                            ml: 2,
                            backgroundColor: "blue",
                            "&:hover": {
                                backgroundColor: "blue",
                            },
                        }}
                        onClick={handleAddInvoice}
                    >
                        Add
                    </Button>
                    <Button
                        onClick={handleCloseAddModal}
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
                </Box>
            </Modal>

            {/* end add product modal */}


            {/* start edit product modal */}
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

            {/* end edit product modal */}


            {/* start delete product modal */}
            <Modal
                open={openDeleteModal}
                onClose={handleCloseDeleteModal}
                aria-labelledby="delete-product-modal"
                aria-describedby="delet-product-modal-description"
                sx={modalBackdropStyle}
            >
                <Box sx={modalStyle}>
                    <Typography id="delete-product-modal" variant="h6" component="h2">
                        Delete Invoice
                    </Typography>
                    <Typography sx={{ mt: 2 }}>
                        Are you sure you want to delete
                        &nbsp;&quot;{selectedInvoice?.name}&quot;?
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

            {/* end delete product modal */}


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
