"use client";

import React, { useEffect, useState } from "react";

import {
    Box,
    Button,
    TextField,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Paper,
    Snackbar,
    Alert,
} from "@mui/material";

import Grid from '@mui/material/Grid';
 
import CircularProgress from "@mui/material/CircularProgress";

import { useAppSelector, useAppDispatch } from "@/lib/hooks";

import { useGetOrdersQuery, useToggleOrderStatusMutation } from "@/lib/features/orders/ordersApiSlice";

interface Order {
    _id: string;
    product: any;
    supplier: any;
    category: any;
    date: string;
    order_number: string;
    description: string;
    quantity: number;
    unit_price: number;
    total_cost: number;
    status: boolean;
    deletedAt?: string;
    deleted: boolean;
}
import { useGetProductsQuery } from "@/lib/features/products/productsApiSlice";
import { useGetSuppliersQuery } from "@/lib/features/suppliers/suppliersApiSlice";
import { useGetCategoriesQuery } from "@/lib/features/categories/categoriesApiSlice";


const OrderTable = () => {

    const dispatch = useAppDispatch();

    const { data: orderData, error, isLoading: loading } = useGetOrdersQuery();
    const { data: productData} = useGetProductsQuery();
    const { data: supplierData } = useGetSuppliersQuery();
    const { data: categoryData } = useGetCategoriesQuery();

    let orders: any;
    orders = orderData?.orders || [];
    console.log("Orders", orders);

    let suppliers: any;
    suppliers = supplierData?.suppliers || [];
    console.log("Suppliers", suppliers);

    let categories: any;
    categories = categoryData?.categories || [];
    console.log("Categories", categories);

    let products: any;
    products = productData?.products || [];
    console.log("Products", products);

    
    const [page, setPage] = React.useState(0);

    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const [filter, setFilter] = useState("");

    const [toggleOrderStatus] = useToggleOrderStatusMutation();

    
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };


    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const filteredOrders = orders.filter((order: any) => {
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

    const handleToggleStatus = (order: Order) => {
        toggleOrderStatus(order._id)
            .unwrap()
            .then(() => {
                setSnackbar({ open: true, message: "Order status updated successfully", severity: "success" });
            })
            .catch((error: any) => {
                setSnackbar({ open: true, message: error?.data?.err || "Failed to update order status", severity: "error" });
            });
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
                Purchases
            </Typography>

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
            </Grid>

            <TableContainer component={Paper} sx={{ overflowX: 'auto' }} >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>S.No</TableCell>
                            <TableCell>Order Number</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Supplier Name</TableCell>
                            <TableCell>Category Name</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Product Name</TableCell>
                            <TableCell>Status</TableCell>
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
                            
                            
                            filteredOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((order: any, index: number) => (
                                <TableRow key={order._id}>
                                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                    <TableCell>{order?.order_number}</TableCell>
                                    <TableCell>{order?.date ? new Date(order.date).toLocaleDateString() : ''}</TableCell>
                                    <TableCell>{order?.supplier?.name}</TableCell>
                                    <TableCell>{order?.category?.name}</TableCell>
                                    <TableCell>{order?.quantity}</TableCell>                                    
                                    <TableCell>{order?.product?.name}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color={order.status ? "success" : "warning"}
                                            onClick={ () => handleToggleStatus(order) }
                                            style={{
                                                borderRadius: "20px",
                                                padding: "5px 10px",
                                                minWidth: "auto",
                                                fontSize: "0.8rem",

                                            }}
                                        >
                                            {order?.status ? "Active" : "Pending"}
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
                    count={filteredOrders.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{ backgroundColor: "white" }}
                />
            </TableContainer>

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
} // end OrderTable()

export default OrderTable;
