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

import Grid from "@mui/material/Grid";
import { Add, Refresh } from "@mui/icons-material";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import CircularProgress from "@mui/material/CircularProgress";

import { useAppSelector, useAppDispatch } from "@/lib/hooks";

import {
  useAddOrderMutation,
  useGetOrdersQuery,
  useDeleteOrderMutation,
  useUpdateOrderMutation,
  useToggleOrderStatusMutation,
} from "@/lib/features/orders/ordersApiSlice";

import { useGetProductsQuery } from "@/lib/features/products/productsApiSlice";
import { useGetSuppliersQuery } from "@/lib/features/suppliers/suppliersApiSlice";
import { useGetCategoriesQuery } from "@/lib/features/categories/categoriesApiSlice";

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

const OrderTable = () => {
  const dispatch = useAppDispatch();

  const { data: orderData, error, isLoading: loading } = useGetOrdersQuery();
  const { data: productData } = useGetProductsQuery();
  const { data: supplierData } = useGetSuppliersQuery();
  const { data: categoryData } = useGetCategoriesQuery();

  let orders: any;
  orders = orderData?.orders || [];
  //console.log("Orders", orders);

  let suppliers: any;
  suppliers = supplierData?.suppliers || [];
  //console.log("Suppliers", suppliers);

  let categories: any;
  categories = categoryData?.categories || [];
  //console.log("Categories", categories);

  let products: any;
  products = productData?.products || [];
  //console.log("Products", products);

  const [page, setPage] = React.useState(0);

  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [openAddModal, setOpenAddModal] = React.useState(false);
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

  const [editOrder, setEditOrder] = useState({
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

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [openEditModal, setOpenEditModal] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [filter, setFilter] = useState("");

  const [addOrder] = useAddOrderMutation();
  const [deleteOrder] = useDeleteOrderMutation();
  const [updateOrder] = useUpdateOrderMutation();
  const [toggleOrderStatus] = useToggleOrderStatusMutation();

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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

  const handleAddOrder = () => {
    addOrder(newOrder)
      .unwrap()
      .then(() => {
        setSnackbar({
          open: true,
          message: "Order added successfully",
          severity: "success",
        });

        handleCloseAddModal();
      })
      .catch((error: any) => {
        setSnackbar({
          open: true,
          message: error?.data?.err || error?.message || "Failed to add order",
          severity: "error",
        });

        console.error("Error adding order:", error);
      });
  };

  const handleCloseDeleteModal = () => setOpenDeleteModal(false);

  const handleOpenDeleteModal = (order: any) => {
    setSelectedOrder(order);
    setOpenDeleteModal(true);
  };

  const handleDeleteOrder = () => {
    deleteOrder(selectedOrder?._id)
      .unwrap()
      .then(() => {
        setSnackbar({
          open: true,
          message: "Order deleted successfully",
          severity: "success",
        });
        handleCloseDeleteModal();
      })
      .catch((error: any) => {
        setSnackbar({
          open: true,
          message:
            error?.data?.err || error?.message || "Failed to delete order",
          severity: "error",
        });
      });
  };

  const handleOpenEditModal = (order: any) => {
    setOpenEditModal(true);
    setSelectedOrder(order);
    setEditOrder({
      ...order,
      product:
        typeof order.product === "object" ? order.product._id : order.product,
      category:
        typeof order.category === "object"
          ? order.category._id
          : order.category,
      supplier:
        typeof order.supplier === "object"
          ? order.supplier._id
          : order.supplier,
    });
  };

  const handleCloseEditModal = () => setOpenEditModal(false);

  const handleEditOrder = () => {
    const { _id, ...data } = editOrder;
    updateOrder({ _id, data })
      .unwrap()
      .then(() => {
        setSnackbar({
          open: true,
          message: "Order updated successfully",
          severity: "success",
        });
        handleCloseEditModal();
      })
      .catch((error: any) => {
        setSnackbar({
          open: true,
          message:
            error?.data?.err || error?.message || "Failed to update order",
          severity: "error",
        });
      });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const filteredOrders = orders.filter((order: any) => {
    return (
      order?.product?.name.toLowerCase().includes(filter.toLowerCase()) ||
      order?.supplier?.name.toLowerCase().includes(filter.toLowerCase())
    );
  });

  const handleFilterChange = (e: any) => {
    setFilter(e.target.value);
  };

  useEffect(() => {
    if (error) {
      setSnackbar({
        open: true,
        message: "Failed to fetch orders",
        severity: "error",
      });
    }
  }, [error]);

  const handleToggleStatus = (order: Order) => {
    toggleOrderStatus(order._id)
      .unwrap()
      .then(() => {
        setSnackbar({
          open: true,
          message: "Order status updated successfully",
          severity: "success",
        });
      })
      .catch((error: any) => {
        setSnackbar({
          open: true,
          message: error?.data?.err || "Failed to update order status",
          severity: "error",
        });
      });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography
        variant="h4"
        sx={{ mb: 2 }}
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
        Purchase Orders
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
              input: { color: "white" },
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
        <Grid size={{ xs: 12, sm: 4 }}>
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
            Add Order
          </Button>
        </Grid>
      </Grid>

      <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
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
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <CircularProgress color="inherit" />
                    <Typography sx={{ ml: 2 }}>Loading...</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={3}>
                  Error: {JSON.stringify(error)}
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((order: any, index: number) => (
                  <TableRow key={order._id}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{order?.order_number}</TableCell>
                    <TableCell>
                      {order?.date
                        ? new Date(order.date).toLocaleDateString()
                        : ""}
                    </TableCell>
                    <TableCell>{order?.supplier?.name}</TableCell>
                    <TableCell>{order?.category?.name}</TableCell>
                    <TableCell>{order?.quantity}</TableCell>
                    <TableCell>{order?.product?.name}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color={order.status ? "success" : "warning"}
                        onClick={() => handleToggleStatus(order)}
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

                    <TableCell>
                      {order.status ? (
                        <>
                          <Button
                            variant="contained"
                            color="success"
                            startIcon={<CheckIcon />}
                            style={{
                              borderRadius: "20px",
                              padding: "8px 16px",
                              fontSize: "0.9rem",
                            }}
                            onClick={() => handleOpenEditModal(order)}
                          ></Button>{" "}
                        </>
                      ) : (
                        <>
                          {" "}
                          <Button
                            variant="contained"
                            color="error"
                            startIcon={<DeleteIcon />}
                            style={{
                              borderRadius: "20px",
                              padding: "5px 10px",
                              minWidth: "auto",
                              fontSize: "0.8rem",
                            }}
                            onClick={() => handleOpenDeleteModal(order)}
                          >
                            Delete
                          </Button>
                        </>
                      )}
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

      {/* start add order modal */}
      <Modal
        open={openAddModal}
        onClose={handleCloseAddModal}
        aria-labelledby="add-order-modal"
        aria-describedby="add-order-modal-description"
        sx={modalBackdropStyle}
      >
        <Box sx={modalStyle}>
          <Typography id="add-order-modal" variant="h6" component="h2">
            Add Order
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            label="Order #"
            name="order_number"
            value={newOrder.order_number}
            onChange={(e) =>
              setNewOrder({ ...newOrder, order_number: e.target.value })
            }
            required
            slotProps={{ inputLabel: { style: { color: "white" } } }}
            sx={{
              mt: 2,
              input: { color: "white" },
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

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Product Name</InputLabel>
            <Select
              value={newOrder.product}
              onChange={(e) =>
                setNewOrder({ ...newOrder, product: e.target.value })
              }
              sx={{
                mt: 3,
                color: "white",
                ".MuiOutlinedInput-notchedOutline": {
                  borderColor: "blue",
                },
                "&Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "blue",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "blue",
                },
                "& .MuiSvgIcon-root": {
                  fill: "white !important",
                },
              }}
            >
              {products &&
                products?.map((p: any, index: number) => (
                  <MenuItem key={index} value={p._id}>
                    {p.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Supplier Name</InputLabel>
            <Select
              value={newOrder.supplier}
              onChange={(e) =>
                setNewOrder({ ...newOrder, supplier: e.target.value })
              }
              sx={{
                mt: 3,
                color: "white",
                ".MuiOutlinedInput-notchedOutline": {
                  borderColor: "blue",
                },
                "&Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "blue",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "blue",
                },
                "& .MuiSvgIcon-root": {
                  fill: "white !important",
                },
              }}
            >
              {suppliers &&
                suppliers?.map((s: any, index: number) => (
                  <MenuItem key={index} value={s._id}>
                    {s.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Category Name</InputLabel>
            <Select
              value={newOrder.category}
              onChange={(e) =>
                setNewOrder({ ...newOrder, category: e.target.value })
              }
              sx={{
                mt: 3,
                color: "white",
                ".MuiOutlinedInput-notchedOutline": {
                  borderColor: "blue",
                },
                "&Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "blue",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "blue",
                },
                "& .MuiSvgIcon-root": {
                  fill: "white !important",
                },
              }}
            >
              {categories &&
                categories?.map((c: any, index: number) => (
                  <MenuItem key={index} value={c._id}>
                    {c.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          <TextField
            required
            fullWidth
            variant="outlined"
            label="Description"
            name="description"
            value={newOrder.description || ""}
            onChange={(e) =>
              setNewOrder({ ...newOrder, description: e.target.value })
            }
            slotProps={{ inputLabel: { style: { color: "white" } } }}
            sx={{
              mt: 2,
              input: { color: "white" },
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
            value={newOrder.quantity || ""}
            onChange={(e) =>
              setNewOrder({ ...newOrder, quantity: parseInt(e.target.value) })
            }
            slotProps={{ inputLabel: { style: { color: "white" } } }}
            sx={{
              mt: 2,
              input: { color: "white" },
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
            value={newOrder.unit_price || ""}
            onChange={(e) =>
              setNewOrder({ ...newOrder, unit_price: parseInt(e.target.value) })
            }
            slotProps={{ inputLabel: { style: { color: "white" } } }}
            sx={{
              mt: 2,
              input: { color: "white" },
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
            value={newOrder.total_cost || ""}
            onChange={(e) =>
              setNewOrder({ ...newOrder, total_cost: parseInt(e.target.value) })
            }
            slotProps={{ inputLabel: { style: { color: "white" } } }}
            sx={{
              mt: 2,
              input: { color: "white" },
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
            onClick={handleAddOrder}
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

      {/* end add order modal */}

      {/* start edit order modal */}
      <Modal
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
            onChange={(e) =>
              setEditOrder({ ...editOrder, order_number: e.target.value })
            }
            required
            slotProps={{ inputLabel: { style: { color: "white" } } }}
            sx={{
              mt: 2,
              input: { color: "white" },
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

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Product Name</InputLabel>
            <Select
              value={editOrder.product}
              onChange={(e) => {
                // const selectedUnit = units.find((unit:any) => unit._id === e.target.value);
                // setEditOrder({...editOrder, unit: selectedUnit});
                setEditOrder({ ...editOrder, product: e.target.value });
              }}
              sx={{
                mt: 3,
                color: "white",
                ".MuiOutlinedInput-notchedOutline": {
                  borderColor: "blue",
                },
                "&Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "blue",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "blue",
                },
                "& .MuiSvgIcon-root": {
                  fill: "white !important",
                },
                "& .MuiSelect-select": {
                  color: "white",
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: "white",
                    "&MuiMenuItem-root": {
                      color: "white",
                    },
                  },
                },
              }}
            >
              {products &&
                products?.map((u: any, index: number) => (
                  <MenuItem key={index} value={u._id}>
                    {u.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Supplier Name</InputLabel>
            <Select
              value={editOrder.supplier} // _id
              onChange={(e) =>
                setEditOrder({ ...editOrder, supplier: e.target.value })
              }
              sx={{
                mt: 3,
                color: "white",
                ".MuiOutlinedInput-notchedOutline": {
                  borderColor: "blue",
                },
                "&Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "blue",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "blue",
                },
                "& .MuiSvgIcon-root": {
                  fill: "white !important",
                  color: "white !important",
                },
                "& .MuiSelect-select": {
                  color: "white",
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: "white",
                    "&MuiMenuItem-root": {
                      color: "white",
                    },
                  },
                },
              }}
            >
              {suppliers &&
                suppliers?.map((s: any, index: number) => (
                  <MenuItem key={index} value={s._id}>
                    {s.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Category Name</InputLabel>
            <Select
              value={editOrder.category}
              onChange={(e) =>
                setEditOrder({ ...editOrder, category: e.target.value })
              }
              sx={{
                mt: 3,
                color: "white",
                ".MuiOutlinedInput-notchedOutline": {
                  borderColor: "blue",
                },
                "&Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "blue",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "blue",
                },
                "& .MuiSvgIcon-root": {
                  fill: "white !important",
                },
                "& .MuiSelect-select": {
                  color: "white",
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: "white",
                    "&MuiMenuItem-root": {
                      color: "white",
                    },
                  },
                },
              }}
            >
              {categories &&
                categories?.map((c: any, index: number) => (
                  <MenuItem key={index} value={c._id}>
                    {c.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          <TextField
            required
            fullWidth
            variant="outlined"
            label="Description"
            name="description"
            value={editOrder.description || ""}
            onChange={(e) =>
              setEditOrder({ ...editOrder, description: e.target.value })
            }
            slotProps={{ inputLabel: { style: { color: "white" } } }}
            sx={{
              mt: 2,
              input: { color: "white" },
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
            onChange={(e) =>
              setEditOrder({ ...editOrder, quantity: parseInt(e.target.value) })
            }
            slotProps={{ inputLabel: { style: { color: "white" } } }}
            sx={{
              mt: 2,
              input: { color: "white" },
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
            onChange={(e) =>
              setEditOrder({
                ...editOrder,
                unit_price: parseInt(e.target.value),
              })
            }
            slotProps={{ inputLabel: { style: { color: "white" } } }}
            sx={{
              mt: 2,
              input: { color: "white" },
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
            onChange={(e) =>
              setEditOrder({
                ...editOrder,
                total_cost: parseInt(e.target.value),
              })
            }
            slotProps={{ inputLabel: { style: { color: "white" } } }}
            sx={{
              mt: 2,
              input: { color: "white" },
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
      </Modal>

      {/* end edit order modal */}

      {/* start delete order modal */}
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
            Are you sure you want to delete order &nbsp;&quot;
            {selectedOrder?.order_number}&quot;?
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
            onClick={handleDeleteOrder}
          >
            Delete
          </Button>
        </Box>
      </Modal>

      {/* end delete order modal */}

      {/* snackbar */}
      <Snackbar
        open={snackbar.open}
        onClose={handleCloseSnackbar}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={
            snackbar.severity as
              | "success"
              | "error"
              | "info"
              | "warning"
              | undefined
          }
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}; // end OrderTable()

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

export default OrderTable;
