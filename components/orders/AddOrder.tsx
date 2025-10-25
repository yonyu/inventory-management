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
    SelectChangeEvent,
} from "@mui/material";

import Grid from '@mui/material/Grid';
import { Edit, Delete, Add, Refresh, Description, BorderStyle } from "@mui/icons-material";


import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";



import CircularProgress from "@mui/material/CircularProgress";

import { useAppSelector, useAppDispatch } from "@/lib/hooks";

import { useAddOrderMutation, useGetOrdersQuery, useDeleteOrderMutation, useUpdateOrderMutation } from "@/lib/features/orders/ordersApiSlice";
import { useGetProductsQuery } from "@/lib/features/products/productsApiSlice";
import { useGetSuppliersQuery } from "@/lib/features/suppliers/suppliersApiSlice";
import { useGetCategoriesQuery } from "@/lib/features/categories/categoriesApiSlice";
import { bgcolor, borderColor, height, minWidth } from "@mui/system";
//import { useStaticPicker } from "@mui/x-date-pickers/internals";


const AddOrder = () => {

    const [openAddMoreModal, setOpenAddMoreModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [pendingOrders, setPendingOrders] = useState<any[]>([]);

    const dispatch = useAppDispatch();

    const { data: orderData, error, isLoading: loading } = useGetOrdersQuery();
    
    // Only load reference data when modals are open
    const needsReferenceData = openAddMoreModal || openEditModal;
    const { data: productData} = useGetProductsQuery(undefined, { skip: !needsReferenceData });
    const { data: supplierData } = useGetSuppliersQuery(undefined, { skip: !needsReferenceData });
    const { data: categoryData } = useGetCategoriesQuery(undefined, { skip: !needsReferenceData });


    let orders: any = orderData?.orders || [];
    console.log("Orders", orders);

    let suppliers: any = supplierData?.suppliers || [];
    let categories: any = categoryData?.categories || [];
    let products: any = productData?.products || [];
    
    const [startDate, setStartDate] = useState<Date | null>(new Date());

    const t = new Date().toLocaleDateString();
    
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    //const [openAddModal, setOpenAddModal] = React.useState(false);
    const [newOrder, setNewOrder] = useState({
        _id: "",
        product: "",
        supplier: "",
        category: "",
        date: "",
        order_number: "",
        description: "",

        quantity: 0,
        unit_price: 0,
        total_cost: 0,

        status: false, // true when it is fulfilled
        deletedAt: "",
        deleted: false,
    });

    //const [supplierName, setSupplierName] = useState("");
    const [selectedOrder, setSelectedOrder] = useState<any>(null);

    const [editOrder, setEditOrder] = useState({
        _id: "",
        product: "",
        supplier: "",
        category: "",
        date: new Date().toISOString(),
        order_number: "",
        description: "",

        quantity: 0,
        unit_price: 0,
        total_cost: 0,

        status: false, // true when it is fulfilled
        deletedAt: "",
        deleted: false,
    });



    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const [filter, setFilter] = useState("");

    let filteredCategories = newOrder.supplier
        ? products.filter((p: any) => p.supplier?._id === newOrder.supplier)
            .map((p: any) => p.category)
            .filter((c: any, i: number, arr: any[]) => c && arr.findIndex((cat: any) => cat?._id === c?._id) === i)
        : categories;

    let filteredProducts = newOrder.category
        ? products.filter((p: any) => p.category?._id === newOrder.category && (!newOrder.supplier || p.supplier?._id === newOrder.supplier))
        : newOrder.supplier
        ? products.filter((p: any) => p.supplier?._id === newOrder.supplier)
        : products;

    const [addOrder] = useAddOrderMutation();
    const [deleteOrder] = useDeleteOrderMutation();
    const [updateOrder] = useUpdateOrderMutation();

    
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };


    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Debug: Monitor form changes
    // useEffect(() => {
    //     console.log("Form state changed:", form);
    // }, [form]);

    // const handleOpenAddModal = () => {

    //     setOpenAddModal(true);
    // };

    // const handleCloseAddModal = () => {
    //     setOpenAddModal(false);
    // };

    // const handleOpenAddMoreModal = () => {

    //     setOpenAddMoreModal(true);
    // };

    const handleCloseAddMoreModal = () => {
        setOpenAddMoreModal(false);
    };

    const handleSelectionChange = (e: SelectChangeEvent) => {
        const { name, value } = e.target;
        
        if (name === 'supplier') {
            setNewOrder({...newOrder, supplier: value, category: '', product: ''});
        } else if (name === 'category') {
            setNewOrder({...newOrder, category: value, product: ''});
        } else {
            setNewOrder({...newOrder, [name]: value});
        }
    }

    const handleAddMoreModal = () => {
        const orderToAdd = {
            ...newOrder,
            date: newOrder.date || new Date().toISOString(),
            total_cost: newOrder.quantity * newOrder.unit_price,
            tempId: Date.now()
        };
        setPendingOrders([...pendingOrders, orderToAdd]);
        setSnackbar({ open: true, message: "Row added to list", severity: "success" });
        setNewOrder({
            _id: "",
            product: "",
            supplier: "",
            category: "",
            date: "",
            order_number: "",
            description: "",
            quantity: 0,
            unit_price: 0,
            total_cost: 0,
            status: false,
            deletedAt: "",
            deleted: false,
        });
        setStartDate(new Date());
    }


    const handleAddMoreFormSubmit = async () => {
        if (pendingOrders.length === 0) {
            setSnackbar({ open: true, message: "No orders to save", severity: "warning" });
            return;
        }

        try {
            const ordersToSave = pendingOrders.map(({ tempId, _id, ...order }) => order);
            await addOrder(ordersToSave).unwrap();
            setSnackbar({ open: true, message: `${pendingOrders.length} order(s) saved successfully`, severity: "success" });
            setPendingOrders([]);
        } catch (error: any) {
            setSnackbar({ open: true, message: error?.data?.err || error?.message || "Failed to save orders", severity: "error" });
        }
    }

    // const handleAddOrder = () => {
    //     addOrder(newOrder)
    //         .unwrap()
    //         .then(() => {
    //             setSnackbar({ open: true, message: "Order added successfully", severity: "success", });

    //             handleCloseAddModal();

    //         })
    //         .catch((error: any) => {

    //             setSnackbar({ open: true, message: error?.data?.err || error?.message || "Failed to add order", severity: "error", });

    //             console.error("Error adding order:", error);
    //         });
    // }

    const handleCloseDeleteModal = () => setOpenDeleteModal(false);

    const handleOpenDeleteModal = (order: any) => {
        setSelectedOrder(order);
        setOpenDeleteModal(true);

    }

    const handleDeleteOrder = () => {
        if (selectedOrder?.tempId) {
            setPendingOrders(pendingOrders.filter(o => o.tempId !== selectedOrder.tempId));
            setSnackbar({ open: true, message: "Pending order removed", severity: "success" });
            handleCloseDeleteModal();
        } else {
            deleteOrder(selectedOrder?._id).unwrap()
                .then(() => {
                    setSnackbar({ open: true, message: "Order deleted successfully", severity: "success" });
                    handleCloseDeleteModal();
                })
                .catch((error: any) => {
                    setSnackbar({ open: true, message: error?.data?.err || error?.message || "Failed to delete order", severity: "error" });
                });
        }
    }

    const handleOpenEditModal = (order: any) => {
        setOpenEditModal(true);
        setSelectedOrder(order);
        setEditOrder({ 
            ...order,
            product: typeof order.product === 'object' ? order.product._id : order.product,
            category: typeof order.category === 'object' ? order.category._id : order.category,
            supplier: typeof order.supplier === 'object' ? order.supplier._id : order.supplier
        });
    };

    const handleCloseEditModal = () => setOpenEditModal(false);

    const handleEditOrder = () => {
        const { _id, ...data } = editOrder;
        updateOrder({ _id, data })
            .unwrap()
            .then(() => {
                setSnackbar({ open: true, message: "Order updated successfully", severity: "success", });
                handleCloseEditModal();
            })
            .catch((error: any) => {
                setSnackbar({ open: true, message: error?.data?.err || error?.message || "Failed to update order", severity: "error", });
            });

    }

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };


    const filteredOrders = orders.filter((order: any) => {
        //order?.name?.toLowerCase().includes(filter.toLowerCase());
        return order?.product?.name.toLowerCase().includes(filter.toLowerCase()) ||
               order?.supplier?.name.toLowerCase().includes(filter.toLowerCase());
    });


    const handleFilterChange = (e: any) => {
        setFilter(e.target.value);
    };


    useEffect(() => {
        if (error) {
            setSnackbar({ open: true, message: "Failed to fetch orders", severity: "error", });
        }
    }, [error]);

    const handleModalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewOrder({...newOrder, [event.target.name]: event.target.value});
    }

    const handlePurchaseOrderNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewOrder({...newOrder, order_number: event.target.value});
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
                Add Purchase Orders
            </Typography>

            <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid sx={{ xs: 12, sm: 4 }}>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        startIcon={<Add />}
                        onClick={() => {
                            setOpenAddMoreModal(true);
                            setStartDate(new Date());
                            setNewOrder({
                                ...newOrder,
                                product: "",
                                supplier: "",
                                category: "",
                                date: "",
                                order_number: "",
                                description: "",

                                quantity: 0,
                                unit_price: 0,
                                total_cost: 0,
                            });
                        }}
                        sx={{
                            backgroundColor: "blue",
                            "&:hover": {
                                backgroundColor: "blue",
                            },
                            height: "100%",
                        }}
                    >
                        Add More
                    </Button>
                </Grid>
            </Grid>

            <TableContainer component={Paper} sx={{ overflowX: 'auto' }} >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>Category</TableCell>
                            <TableCell sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>Product Name</TableCell>
                            <TableCell sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>PSC/KG</TableCell>

                            <TableCell sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>Unit Price</TableCell>
                            <TableCell sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>Description</TableCell>
                            <TableCell sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>Total Cost</TableCell>

                            <TableCell sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>Actions</TableCell>                           
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {pendingOrders.map((order: any) => {
                            const cat = categories.find((c: any) => c._id === order.category);
                            const prod = products.find((p: any) => p._id === order.product);
                            return (
                                <TableRow key={order.tempId} sx={{ bgcolor: "#fffacd" }}>
                                    <TableCell>{cat?.name || order.category}</TableCell>
                                    <TableCell>{prod?.name || order.product}</TableCell>
                                    <TableCell>{order.quantity}</TableCell>
                                    <TableCell>{order.unit_price}</TableCell>
                                    <TableCell>{order.description}</TableCell>
                                    <TableCell>{order.total_cost}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => setPendingOrders(pendingOrders.filter(o => o.tempId !== order.tempId))}>
                                            <Delete sx={{ color: "red" }} />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7}>
                                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }} >
                                        <CircularProgress color="inherit" />
                                        <Typography sx={{ ml: 2 }}>Loading...</Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ) : error ? (
                            <TableRow>
                                <TableCell colSpan={7}>Error: {JSON.stringify(error)}</TableCell>
                            </TableRow>
                        ) : (
                            filteredOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((order: any) => (
                                <TableRow key={order._id}>
                                    <TableCell>{order?.category?.name}</TableCell>
                                    <TableCell>{order?.product?.name}</TableCell>
                                    <TableCell>{order?.quantity}</TableCell>
                                    <TableCell>{order?.unit_price}</TableCell>
                                    <TableCell>{order?.description}</TableCell>
                                    <TableCell>{order?.total_cost}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleOpenEditModal(order)} sx={{ color: "blue" }}>
                                            <Edit sx={{ color: "blue", "&:hover": { color: "darkred" } }} />
                                        </IconButton>
                                        <IconButton onClick={() => handleOpenDeleteModal(order)}>
                                            <Delete sx={{ color: "red", "&:hover": { color: "darkred" } }} />
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
                    count={filteredOrders.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{ backgroundColor: "white" }}
                />
            </TableContainer>

            <Button
                fullWidth
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddMoreFormSubmit}
                sx={{
                    p: 1,
                    backgroundColor: "blue",
                    "&:hover": {
                        backgroundColor: "darkblue",
                    },
                }}
            >
                Purchase Order Store (Save added orders to database)
            </Button>


            {/* <OrderList /> */}


            {/* start add new row modal */}
            <Modal
                open={openAddMoreModal}
                onClose={ handleCloseAddMoreModal }
                sx={modalBackdropStyle}
            >
                <Box sx={modalStyle}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Add New Row
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel>Supplier Name</InputLabel>
                                <Select
                                    name="supplier"
                                    label="Supplier Name"
                                    value={newOrder.supplier}
                                    onChange={handleSelectionChange}
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
                                                key={s._id}
                                                value={s._id}
                                            >
                                                {s.name}
                                            </MenuItem>

                                        ))
                                    }
                                </Select>
                            </FormControl>           
                     
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel>Category</InputLabel>
                                <Select
                                    name="category"
                                    label="Category"
                                    value={newOrder.category}
                                    onChange={handleSelectionChange}
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
                                    disabled={!newOrder.supplier}
                                >
                                    {
                                        filteredCategories && filteredCategories?.map((s: any, index: number) => (
                                            <MenuItem
                                                key={s._id}
                                                value={s._id}
                                            >
                                                {s.name}
                                            </MenuItem>

                                        ))
                                    }                                    
                                </Select>
                            </FormControl>                          
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel>Product Name</InputLabel>
                                <Select
                                    name="product"
                                    label="Product Name"
                                    value={newOrder.product}
                                    onChange={handleSelectionChange}
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
                                    disabled={!newOrder.category}
                                >

                                    {
                                        filteredProducts && filteredProducts?.map((s: any, index: number) => (
                                            <MenuItem
                                                key={s._id}
                                                value={s._id}
                                            >
                                                {s.name}
                                            </MenuItem>

                                        ))
                                    }   
                                </Select>
                            </FormControl>                              
                        </Grid>


                         <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                type="number"
                                fullWidth
                                variant="outlined"
                                label="PSC/KG"
                                name="quantity"

                                value={newOrder.quantity || ""}
                                onChange={(e) => setNewOrder({ ...newOrder, quantity: e.target.value ? parseFloat(e.target.value) : 0 })}
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
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <TextField
                                type="number"
                                //required
                                fullWidth
                                variant="outlined"
                                label="Unit Price"
                                name="unit_price"
                                value={newOrder.unit_price || ""}
                                onChange={(e) => setNewOrder({ ...newOrder, unit_price: e.target.value ? parseFloat(e.target.value) : 0 })}
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
                        </Grid>

                         <Grid size={{ xs: 12 }}>
                            <TextField
                                //required
                                fullWidth
                                variant="outlined"
                                label="Description"
                                name="description"
                                value={newOrder.description || ""}
                                onChange={(e) => setNewOrder({ ...newOrder, description: e.target.value })}
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
                        </Grid>

                         <Grid size={{ xs: 12 }}>
                            <label>Select Date:</label>

                            <DatePicker 
                                dateFormat="MMMM d, yyyy"
                                //value={newOrder.date}
                                selected={startDate}
                                customInput={ <input style={customInputStyle} /> }
                                onChange={(date: Date | null) => {
                                    if (date) {
                                        setStartDate(date);
                                        setNewOrder({ ...newOrder, date: date.toISOString() });
                                    }
                                }}
                            />
                        </Grid>

                         <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Order Number"
                                name="order_number"
                                value={newOrder.order_number || ""}
                                onChange={ handlePurchaseOrderNumberChange /* (e) => setNewOrder({ ...newOrder, order_number: e.target.value }) */ }
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
                        </Grid>                              
                    </Grid>

                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                        <Button
                            onClick={ handleCloseAddMoreModal }
                            variant="outlined"
                            sx={{
                                mr: 2,
                                // ml: 2,
                                // color: "white",
                                // borderColor: "blue",
                                // "&:hover": {
                                //     borderColor: "blue",
                                // },
                            }}
                        >
                            Cancel
                        </Button>
                        <Button           
                            variant="contained"
                            sx={{
                                // mt: 2,
                                // ml: 2,
                                backgroundColor: "blue",
                                "&:hover": {
                                    backgroundColor: "blue",
                                },
                            }}
                            onClick={handleAddMoreModal}

                        >
                            Add Row
                        </Button>
                    </Box>
                </Box>
            </Modal>

            {/* end add new row modal */}


            {/* start edit order modal */}
            {/* <Modal
                open={openEditModal}
                onClose={handleCloseEditModal}
                aria-labelledby="edit-order-modal"
                aria-describedby="edit-order-modal-description"
                sx={modalBackdropStyle}
            >
                <Box sx={modalStyle}>
                    <Typography id="edit-order-modal" variant="h6" component="h2">
                        Edit Order
                    </Typography>

                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Order #"
                        name="order_number"
                        value={editOrder.order_number}
                        onChange={(e) => setEditOrder({...editOrder, order_number: e.target.value})}
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
                        <InputLabel>Product Name</InputLabel>
                        <Select
                            value={editOrder.product}
                            onChange={(e) => {
                                // const selectedUnit = units.find((unit:any) => unit._id === e.target.value);
                                // setEditOrder({...editOrder, unit: selectedUnit});
                                setEditOrder({...editOrder, product: e.target.value});
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
                                products && products?.map((u: any, index: number) => (
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
                        <InputLabel>Supplier Name</InputLabel>
                        <Select
                            value={editOrder.supplier} // _id
                            onChange={(e) => setEditOrder({...editOrder, supplier: e.target.value})}
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
                        <InputLabel>Category Name</InputLabel>
                        <Select
                            value={editOrder.category}
                            onChange={(e) => setEditOrder({...editOrder, category: e.target.value})}
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
                        required
                        fullWidth
                        variant="outlined"
                        label="Description"
                        name="description"
                        value={editOrder.description || ""}
                        onChange={(e) => setEditOrder({...editOrder, description: e.target.value})}
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
                        label="Quantity"
                        name="quantity"
                        value={editOrder.quantity || ""}
                        onChange={(e) => setEditOrder({...editOrder, quantity: parseInt(e.target.value)})}
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
                        label="Unit Price"
                        name="unit_price"
                        value={editOrder.unit_price || ""}
                        onChange={(e) => setEditOrder({...editOrder, unit_price: parseInt(e.target.value)})}
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
                        label="Total Cost"
                        name="total_cost"
                        value={editOrder.total_cost || ""}
                        onChange={(e) => setEditOrder({...editOrder, total_cost: parseInt(e.target.value)})}
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
                        onClick={handleEditOrder}
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
            </Modal> */}

            {/* end edit order modal */}


            {/* start confirm deletion modal */}
            <Modal
                open={openDeleteModal}
                onClose={handleCloseDeleteModal}
                aria-labelledby="delete-order-modal"
                aria-describedby="delet-order-modal-description"
                sx={modalBackdropStyle}
            >
                <Box sx={modalStyle}>
                    <Typography id="delete-order-modal" variant="h6" component="h2">
                        Delete Order
                    </Typography>
                    <Typography sx={{ mt: 2 }}>
                        Are you sure you want to delete order
                        &nbsp;&quot;{selectedOrder?.order_number}&quot;?
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                        <Button
                            onClick={handleCloseDeleteModal}
                            sx={{ mr: 2 }}
                        >
                            Cancel
                        </Button>                    
                        <Button variant="contained" color="error"
                            onClick={handleDeleteOrder}
                        >
                            Delete
                        </Button>
                    </Box>
                </Box>
            </Modal>

            {/* end confirm deletion modal */}


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
}; // end AddOrder()


const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 800,
    //backgroundcolor: "black",
    bgcolor: "#000",

    borderRadius: 2,
    boxShadow: 24,
    p: 4,

    // maxWidth: "600px",

    // border: "2px solid #000",
    color: "white",
};

const modalBackdropStyle = {
    backdropFilter: "blur(3px)",
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

export default AddOrder;