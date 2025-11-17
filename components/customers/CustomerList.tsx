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

import { useAddCustomerMutation, useGetCustomersQuery, useDeleteCustomerMutation, useUpdateCustomerMutation } from "@/lib/features/customers/customersApiSlice";

const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/upload`;
const CLOUDINARY_UPLOAD_PRESET = "ml_default"; // It must be an unsigned preset for the current code to work


const CustomerTable = () => {

    const dispatch = useAppDispatch();

    const { data, error, isLoading: loading } = useGetCustomersQuery();

    let customers: any;
    customers = data?.customers || [];
    //console.log("Customers", customers);

    const [page, setPage] = React.useState(0);

    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const [openAddModal, setOpenAddModal] = React.useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
    const [openEditModal, setOpenEditModal] = useState(false);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const [form, setForm] = React.useState({
        _id: "",
        name: "",
        address: "",
        status: true,
        email: "",
        mobileNumber: 0,
        image: "",
    });

    const [filter, setFilter] = useState("");

    const [addCustomer] = useAddCustomerMutation();
    const [deleteCustomer] = useDeleteCustomerMutation();
    const [updateCustomer] = useUpdateCustomerMutation();

    const handleImageFileChange = async (event: React.ChangeEvent<HTMLInputElement>, setter: (callback: (prev: any) => any) => void, previewSetter: (value: string) => void) => {
        const file = event.target.files?.[0];
        console.log("File: ", file);
        if (file) {
            const fileUrl = URL.createObjectURL(file);
            previewSetter(fileUrl);

            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

            try {
                // Upload image to an unsigned upload preset
                const response = await fetch(CLOUDINARY_UPLOAD_URL, {
                    method: "POST",
                    body: formData,
                });

                const image = await response.json();
                //console.log("Cloudinary response: ", image);
                
                if (!response.ok) {
                    //console.error("Cloudinary error:", image);
                    setSnackbar({ open: true, message: `Upload failed: ${image?.error?.message || 'Invalid upload preset'}`, severity: "error", });
                    return;
                }
                
                const imageUrl = image?.secure_url;
                if (imageUrl) {
                    setter( (prev) => ({
                        ...prev,
                        image: imageUrl
                    }));
                    setSnackbar({ open: true, message: "Image uploaded successfully", severity: "success", });
                } else {
                    setSnackbar({ open: true, message: "No image URL returned", severity: "error", });
                }

            } catch (error) {
                //console.log("Error uploading image: ", error);
                setSnackbar({ open: true, message: "Error uploading image", severity: "error", });

            }
        }
    };

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

    const [newCustomerImagePreview, setNewCustomerImagePreview] = useState<string | null>(null);

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

    const handleAddCustomer = () => {
        const { _id, ...newCustomer } = form;
        addCustomer(newCustomer)
            .unwrap()
            .then(() => {
                setSnackbar({ open: true, message: "Customer added successfully", severity: "success", });

                handleCloseAddModal();

            })
            .catch((error: any) => {

                setSnackbar({ open: true, message: error?.data?.err || error?.message || "Failed to add customer", severity: "error", });

                console.error("Error adding customer:", error);
            });
    }

    const handleCloseDeleteModal = () => setOpenDeleteModal(false);

    const handleOpenDeleteModal = (customer: any) => {
        setSelectedCustomer(customer);
        //console.log("Selecting Customer: ", customer);
        //setForm(customer);
        setOpenDeleteModal(true);

    }

    const handleDeleteCustomer = (/* selectedCustomer */) => {
        //console.log("Deleting customer: ", selectedCustomer);
        deleteCustomer(selectedCustomer?._id).unwrap()
            .then(() => {
                setSnackbar({ open: true, message: "Customer deleted successfully", severity: "success", });
                handleCloseDeleteModal();

            })
            .catch((error: any) => {
                //console.log("Error deleting customer: ", selectedCustomer);
                setSnackbar({ open: true, message: error?.data?.err || error?.message || "Failed to delete customer", severity: "error", });
            });
    }

    const handleOpenEditModal = (customer: any) => {
        setOpenEditModal(true);
        setSelectedCustomer(customer);
        setForm(customer);
    };

    const handleCloseEditModal = () => setOpenEditModal(false);

    const handleEditCustomer = () => {
        const { _id, ...data } = form;
        updateCustomer({ _id, data })
            .unwrap()
            .then(() => {
                setSnackbar({ open: true, message: "Customer updated successfully", severity: "success", });
                handleCloseEditModal();
            })
            .catch((error: any) => {
                setSnackbar({ open: true, message: error?.data?.err || error?.message || "Failed to update customer", severity: "error", });
            });

    }

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };


    const filteredCustomers = customers.filter((customer: any) =>

        customer?.name?.toLowerCase().includes(filter.toLowerCase())
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
                Customers
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
                        Add Customer
                    </Button>
                </Grid>
            </Grid>

            <TableContainer component={Paper} sx={{ overflowX: 'auto' }} >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>S.No</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Address</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Mobile Number</TableCell>
                            <TableCell>Image</TableCell>
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
                            filteredCustomers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((customer: any, index: number) => (
                                <TableRow key={customer._id}>
                                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                    <TableCell>{customer.name}</TableCell>
                                    <TableCell>{customer.address}</TableCell>
                                    <TableCell>{customer.email}</TableCell>
                                    <TableCell>{customer.mobileNumber}</TableCell>
                                    <TableCell>
                                        {/* <img src= {customer.image} alt="Customer image" height="40px" width="40px"/> */}
                                        {customer.image && (<Box
                                            component="img"
                                            sx={{ height: 40, width: 40, borderRadius: "50%" }}
                                            alt={customer.name}
                                            src={customer.image}
                                        />)}
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            onClick={() => handleOpenEditModal(customer)}
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
                                            onClick={() => handleOpenDeleteModal(customer)}
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
                    count={filteredCustomers.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{ backgroundColor: "white" }}
                />
            </TableContainer>

            {/* start add customer modal */}
            <Modal
                open={openAddModal}
                onClose={handleCloseAddModal}
                aria-labelledby="add-customer-modal"
                aria-describedby="add-customer-modal-description"
                sx={modalBackdropStyle}
            >
                <Box sx={modalStyle}>
                    <Typography id="add-customer-modal" variant="h6" component="h2">
                        Add Customer
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
                        label="Mobile Number"
                        name="mobileNumber"
                        value={form.mobileNumber}
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
                        label="Image URL"
                        name="image"
                        value={form.image || ""}
                        onChange={handleFormChange}
                        key={form.image} // Force re-render when image changes
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
                        component="label"
                        sx={{
                            mt: 2,
                            backgroundColor: "blue",
                            "&:hover": {
                                backgroundColor: "blue",
                            },
                        }}

                    >
                        Upload Image
                        <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={ (e) => handleImageFileChange(e, setForm/* setNewCustomer */, setNewCustomerImagePreview) }
                        />

                    </Button>
                    {newCustomerImagePreview && (
                        <img 
                            src={newCustomerImagePreview}
                            alt="New Customer Image Preview"
                            style={{width: '100px', height: '100px', marginTop: '10px'}}
                        />
                    )}
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
                        onClick={handleAddCustomer}
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

            {/* end add customer modal */}


            {/* start edit customer modal */}
            <Modal
                open={openEditModal}
                onClose={handleCloseEditModal}
                aria-labelledby="edit-customer-modal"
                aria-describedby="edit-customer-modal-description"
                sx={modalBackdropStyle}
            >
                <Box sx={modalStyle}>
                    <Typography id="edit-customer-modal" variant="h6" component="h2">
                        Edit Customer
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
                        label="Mobile Number"
                        name="mobileNumber"
                        value={form.mobileNumber}
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
                        label="Image"
                        name="image"
                        value={form.image}
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
                        onClick={handleEditCustomer}
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

            {/* end edit customer modal */}


            {/* start delete customer modal */}
            <Modal
                open={openDeleteModal}
                onClose={handleCloseDeleteModal}
                aria-labelledby="delete-customer-modal"
                aria-describedby="delet-customer-modal-description"
                sx={modalBackdropStyle}
            >
                <Box sx={modalStyle}>
                    <Typography id="delete-customer-modal" variant="h6" component="h2">
                        Delete Customer
                    </Typography>
                    <Typography sx={{ mt: 2 }}>
                        Are you sure you want to delete
                        &nbsp;&quot;{selectedCustomer?.name}&quot;?
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
                        onClick={handleDeleteCustomer}
                    >
                        Delete
                    </Button>
                </Box>
            </Modal>

            {/* end delete customer modal */}


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
} // end CustomerTable()


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

export default CustomerTable;
