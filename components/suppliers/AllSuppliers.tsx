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
} from "@mui/material";

import Grid from '@mui/material/Grid';
import { Edit, Delete, Add, Refresh } from "@mui/icons-material";
import CircularProgress from "@mui/material/CircularProgress";

import { useAppSelector, useAppDispatch } from "@/lib/hooks";

import { useAddSupplierMutation, useGetSuppliersQuery, useDeleteSupplierMutation, useUpdateSupplierMutation } from "@/lib/features/suppliers/suppliersApiSlice";


const SupplierTable = () => {

    const dispatch = useAppDispatch();

    const { data, error, isLoading: loading } = useGetSuppliersQuery();

    let suppliers: any;
    suppliers = data?.suppliers || [];
    console.log("Suppliers", suppliers);

    const [page, setPage] = React.useState(0);

    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const [openAddModal, setOpenAddModal] = React.useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
    const [openEditModal, setOpenEditModal] = useState(false);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const [form, setForm] = React.useState({
        _id: "",
        name: "",
        email: "",
        phone: "",
        address: "",
        status: true,
    });

    const [filter, setFilter] = useState("");

    const [addSupplier] = useAddSupplierMutation();
    const [deleteSupplier] = useDeleteSupplierMutation();
    const [updateSupplier] = useUpdateSupplierMutation();



    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };


    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setForm((prevForm) => ({ ...prevForm, [name]: value }));

    }

    const handleOpenAddModal = () => {

        setOpenAddModal(true);
    };

    const handleCloseAddModal = () => {
        setOpenAddModal(false);
    };

    const handleAddSupplier = () => {
        const { _id, ...newSupplier } = form;
        addSupplier(newSupplier)
            .unwrap()
            .then(() => {
                setSnackbar({ open: true, message: "Supplier added successfully", severity: "success", });

                handleCloseAddModal();

            })
            .catch((error: any) => {

                setSnackbar({ open: true, message: `error ${error.err}`, severity: "error", });

                console.error("Error adding supplier:", error);
            });
    }

    const handleCloseDeleteModal = () => setOpenDeleteModal(false);

    const handleOpenDeleteModal = (supplier: any) => {
        setSelectedSupplier(supplier);
        //setForm(supplier);
        setOpenDeleteModal(true);

    }

    const handleDeleteSupplier = (/* selectedSupplier */) => {
        deleteSupplier(selectedSupplier?._id).unwrap()
            .then(() => {
                setSnackbar({ open: true, message: "Supplier deleted successfully", severity: "success", });
                handleCloseDeleteModal();

            })
            .catch((error: any) => {
                setSnackbar({ open: true, message: `error ${error.err}`, severity: "error", });
            });
    }

    const handleOpenEditModal = (supplier: any) => {
        setOpenEditModal(true);
        setSelectedSupplier(supplier);
        setForm(supplier);
    };

    const handleCloseEditModal = () => setOpenEditModal(false);

    const handleEditSupplier = () => {
        const { _id, ...data } = form;
        updateSupplier({ _id, data })
            .unwrap()
            .then(() => {
                setSnackbar({ open: true, message: "Supplier updated successfully", severity: "success", });
                handleCloseEditModal();
            })
            .catch((error: any) => {
                setSnackbar({ open: true, message: error?.data?.err || error?.message || "Failed to update supplier", severity: "error", });
            });

    }

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };


    const filteredSuppliers = suppliers.filter((supplier: any) =>

        supplier?.name?.toLowerCase().includes(filter.toLowerCase())
    )


    const handleFilterChange = (e: any) => {
        setFilter(e.target.value);
    }

    return (
        <Box sx={{ p: 2 }} >
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
                Suppliers
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
                        Add Supplier
                    </Button>
                </Grid>
            </Grid>

            <TableContainer component={Paper} sx={{ overflowX: 'auto' }} >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>S.No</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Address</TableCell>
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
                            filteredSuppliers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((supplier: any, index: number) => (
                                <TableRow key={supplier._id}>
                                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                    <TableCell>{supplier.name}</TableCell>
                                    <TableCell>{supplier.email}</TableCell>
                                    <TableCell>{supplier.phone}</TableCell>
                                    <TableCell>{supplier.address}</TableCell>
                                    <TableCell>
                                        <IconButton
                                            onClick={() => handleOpenEditModal(supplier)}
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
                                            onClick={() => handleOpenDeleteModal(supplier)}
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
                    count={filteredSuppliers.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{ backgroundColor: "white" }}
                />
            </TableContainer>

            {/* start add supplier modal */}
            <Modal
                open={openAddModal}
                onClose={handleCloseAddModal}
                aria-labelledby="add-supplier-modal"
                aria-describedby="add-supplier-modal-description"
                sx={modalBackdropStyle}
            >
                <Box sx={modalStyle}>
                    <Typography id="add-supplier-modal" variant="h6" component="h2">
                        Add Supplier
                    </Typography>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Name"
                        name="name"
                        value={form.name}
                        onChange={handleFormChange}
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
                    <TextField
                        required
                        fullWidth
                        variant="outlined"
                        label="Email"
                        name="email"
                        value={form.email}
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
                    <TextField
                        type="number"
                        required
                        fullWidth
                        variant="outlined"
                        label="Phone"
                        name="phone"
                        value={form.phone}
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
                    <TextField
                        required
                        fullWidth
                        variant="outlined"
                        label="Address"
                        name="address"
                        value={form.address}
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
                            backgroundColor: "blue",
                            "&:hover": {
                                backgroundColor: "blue",
                            },
                        }}
                        onClick={handleAddSupplier}
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

            {/* end add supplier modal */}


            {/* start edit supplier modal */}
            <Modal
                open={openEditModal}
                onClose={handleCloseEditModal}
                aria-labelledby="edit-supplier-modal"
                aria-describedby="edit-supplier-modal-description"
                sx={modalBackdropStyle}
            >
                <Box sx={modalStyle}>
                    <Typography id="edit-supplier-modal" variant="h6" component="h2">
                        Edit Supplier
                    </Typography>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Name"
                        name="name"
                        value={form.name}
                        onChange={handleFormChange}
                        slotProps={{ // InputLabelProps
                            inputLabel: { style: { color: 'white', }, },
                        }}
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
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Email"
                        name="email"
                        value={form.email}
                        onChange={handleFormChange}
                        slotProps={{ // InputLabelProps
                            inputLabel: { style: { color: 'white', }, },
                        }}
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
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Phone"
                        name="phone"
                        value={form.phone}
                        onChange={handleFormChange}
                        slotProps={{ // InputLabelProps
                            inputLabel: { style: { color: 'white', }, },
                        }}
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
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Address"
                        name="address"
                        value={form.address}
                        onChange={handleFormChange}
                        slotProps={{ // InputLabelProps
                            inputLabel: { style: { color: 'white', }, },
                        }}
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
                        onClick={handleEditSupplier}
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

            {/* end edit supplier modal */}


            {/* start delete supplier modal */}
            <Modal
                open={openDeleteModal}
                onClose={handleCloseDeleteModal}
                aria-labelledby="delete-supplier-modal"
                aria-describedby="delet-supplier-modal-description"
                sx={modalBackdropStyle}
            >
                <Box sx={modalStyle}>
                    <Typography id="delete-supplier-modal" variant="h6" component="h2">
                        Delete Supplier
                    </Typography>
                    <Typography sx={{ mt: 2 }}>
                        Are you sure you want to delete
                        &nbsp;&quot;{selectedSupplier?.name}&quot;?
                    </Typography>
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
                        onClick={handleDeleteSupplier}
                    >
                        Delete
                    </Button>
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
                </Box>
            </Modal>

            {/* end delete supplier modal */}


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
                    sx={{ width: "100%" }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>

        </Box>
    );
} // end SupplierTable()


const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundcolor: "black",
    p: 4,
    borderRadius: 2,
    boxShadow: 130,
    width: "90%",
    maxWidth: "600px",

    border: "2px solid #000",
    color: "white",
};

const modalBackdropStyle = {
    backdropFilter: "blur(8px)",
};

export default SupplierTable;
