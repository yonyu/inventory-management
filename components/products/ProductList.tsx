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

import { useAppSelector, useAppDispatch } from "@/lib/hooks";

import { useAddProductMutation, useGetProductsQuery, useDeleteProductMutation, useUpdateProductMutation } from "@/lib/features/products/productsApiSlice";
import { useAddUnitMutation, useGetUnitsQuery, useDeleteUnitMutation, useUpdateUnitMutation } from "@/lib/features/units/unitsApiSlice";
import { useAddSupplierMutation, useGetSuppliersQuery, useDeleteSupplierMutation, useUpdateSupplierMutation } from "@/lib/features/suppliers/suppliersApiSlice";
import { useAddCategoryMutation, useGetCategoriesQuery, useDeleteCategoryMutation, useUpdateCategoryMutation } from "@/lib/features/categories/categoriesApiSlice";
import { borderColor } from "@mui/system";


const ProductTable = () => {

    const dispatch = useAppDispatch();

    const { data: productData, error, isLoading: loading } = useGetProductsQuery();
    const { data: unitData } = useGetUnitsQuery();
    const { data: supplierData } = useGetSuppliersQuery();
    const { data: categoryData } = useGetCategoriesQuery();

    let products: any;
    products = productData?.products || [];
    //console.log("Products", products);
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
    const [newProduct, setNewProduct] = useState({
        _id: "",
        name: "",
        supplier: "",
        category: "",
        unit: "",
        status: true,
        quantity: 0,
    });

    const [editProduct, setEditProduct] = useState({
        _id: "",
        name: "",
        supplier: "",
        category: "",
        unit: "",
        status: true,
        quantity: 0,
    });

    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [openEditModal, setOpenEditModal] = useState(false);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const [form, setForm] = React.useState({
        _id: "",
        name: "",
        supplier: "",
        category: "",
        unit: "",
        status: true,
        quantity: 0,
    });

    const [filter, setFilter] = useState("");

    const [addProduct] = useAddProductMutation();
    const [deleteProduct] = useDeleteProductMutation();
    const [updateProduct] = useUpdateProductMutation();

    
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
        setNewProduct((prevProduct) => ({ ...prevProduct, [name]: value }));

    }

    const [newProductImagePreview, setNewProductImagePreview] = useState<string | null>(null);

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

    const handleAddProduct = () => {
        //const { _id, ...newProduct } = form;
        addProduct(newProduct)
            .unwrap()
            .then(() => {
                setSnackbar({ open: true, message: "Product added successfully", severity: "success", });

                handleCloseAddModal();

            })
            .catch((error: any) => {

                setSnackbar({ open: true, message: error?.data?.err || error?.message || "Failed to add product", severity: "error", });

                console.error("Error adding product:", error);
            });
    }

    const handleCloseDeleteModal = () => setOpenDeleteModal(false);

    const handleOpenDeleteModal = (product: any) => {
        setSelectedProduct(product);
        //console.log("Selecting Product: ", product);
        //setForm(product);
        setOpenDeleteModal(true);

    }

    const handleDeleteProduct = (/* selectedProduct */) => {
        //console.log("Deleting product: ", selectedProduct);
        deleteProduct(selectedProduct?._id).unwrap()
            .then(() => {
                setSnackbar({ open: true, message: "Product deleted successfully", severity: "success", });
                handleCloseDeleteModal();

            })
            .catch((error: any) => {
                //console.log("Error deleting product: ", selectedProduct);
                setSnackbar({ open: true, message: error?.data?.err || error?.message || "Failed to delete product", severity: "error", });
            });
    }

    const handleOpenEditModal = (product: any) => {
        setOpenEditModal(true);
        setSelectedProduct(product);
        setEditProduct({ 
            ...product,
            category: typeof product.category === 'object' ? product.category._id : product.category,
            unit: typeof product.unit === 'object' ? product.unit._id : product.unit,
            supplier: typeof product.supplier === 'object' ? product.supplier._id : product.supplier
        });
        //setForm(product);
    };

    const handleCloseEditModal = () => setOpenEditModal(false);

    const handleEditProduct = () => {
        const { _id, ...data } = editProduct;
        updateProduct({ _id, data })
            .unwrap()
            .then(() => {
                setSnackbar({ open: true, message: "Product updated successfully", severity: "success", });
                handleCloseEditModal();
            })
            .catch((error: any) => {
                setSnackbar({ open: true, message: error?.data?.err || error?.message || "Failed to update product", severity: "error", });
            });

    }

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };


    const filteredProducts = products.filter((product: any) =>

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
                Products
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
                        Add Product
                    </Button>
                </Grid>
            </Grid>

            <TableContainer component={Paper} sx={{ overflowX: 'auto' }} >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>S.No</TableCell>
                            <TableCell>Product Name</TableCell>
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
                            filteredProducts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((product: any, index: number) => (
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
                    count={filteredProducts.length}
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
                        Add Product
                    </Typography>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Name"
                        name="name"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
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
                            value={newProduct.supplier}
                            onChange={(e) => setNewProduct({...newProduct, supplier: e.target.value})}
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
                                "&MuiSvgIcon-root": {
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
                            value={newProduct.unit}
                            onChange={(e) => setNewProduct({...newProduct, unit: e.target.value})}
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
                                "&MuiSvgIcon-root": {
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
                            value={newProduct.category}
                            onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
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
                                "&MuiSvgIcon-root": {
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
                        value={newProduct.quantity || ""}
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
                        onClick={handleAddProduct}
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
                        Edit Product
                    </Typography>

                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Name"
                        name="name"
                        value={editProduct.name}
                        onChange={(e) => setEditProduct({...editProduct, name: e.target.value})}
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
                            value={editProduct.supplier}
                            onChange={(e) => setEditProduct({...editProduct, supplier: e.target.value})}
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
                                "&MuiSvgIcon-root": {
                                    fill: 'white !important',
                                },
                                "& .MuiSelect-select": {
                                    color: 'white',
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
                            value={editProduct.unit}
                            onChange={(e) => setEditProduct({...editProduct, unit: e.target.value})}
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
                                "&MuiSvgIcon-root": {
                                    fill: 'white !important',
                                },
                                "& .MuiSelect-select": {
                                    color: 'white',
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
                            value={editProduct.category}
                            onChange={(e) => setEditProduct({...editProduct, category: e.target.value})}
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
                                "&MuiSvgIcon-root": {
                                    fill: 'white !important',
                                },
                                "& .MuiSelect-select": {
                                    color: 'white',
                                },
                                
                            }}
                            MenuProps={{
                                PaperProps: {
                                    sx: {
                                        bgcolor: 'black',
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
                        value={editProduct.quantity || ""}
                        onChange={(e) => setEditProduct({...editProduct, quantity: parseInt(e.target.value)})}
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
                        onClick={handleEditProduct}
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
                        Delete Product
                    </Typography>
                    <Typography sx={{ mt: 2 }}>
                        Are you sure you want to delete
                        &nbsp;&quot;{selectedProduct?.name}&quot;?
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
                        onClick={handleDeleteProduct}
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
} // end ProductTable()


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

export default ProductTable;
