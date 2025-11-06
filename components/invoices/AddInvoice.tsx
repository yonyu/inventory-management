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

import { useAddInvoiceMutation, useGetInvoicesQuery, useDeleteInvoiceMutation/*, useUpdateInvoiceMutation*/ } from "@/lib/features/invoices/invoicesApiSlice";
import { useAddCustomerMutation, useGetCustomersQuery, useDeleteCustomerMutation, useUpdateCustomerMutation } from "@/lib/features/customers/customersApiSlice";
import { useGetProductsQuery, useGetProductByIdQuery } from "@/lib/features/products/productsApiSlice";
import { useGetCategoriesQuery } from "@/lib/features/categories/categoriesApiSlice";

import { useGetSuppliersQuery } from "@/lib/features/suppliers/suppliersApiSlice";

import { bgcolor, borderColor, height, minWidth } from "@mui/system";



import InvoiceList from "./InvoiceList";

const AddInvoice = () => {

    const [openAddMoreModal, setOpenAddMoreModal] = useState(false);

    const handleOpen = () => setOpenAddMoreModal(true);

    const [rowToDelete, setRowToDelete] = useState<number | null>(null);

    const handleCloseAddMoreModal = () => {
        setOpenAddMoreModal(false);
    };

    const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [pendingInvoices, setPendingInvoices] = useState<any[]>([]);

    const dispatch = useAppDispatch();

    const { data: invoiceData, error, isLoading: loading } = useGetInvoicesQuery();
    const [addInvoice] = useAddInvoiceMutation();
    
    // Only load reference data when modals are open
    const needsReferenceData = openAddMoreModal || openEditModal;
    // const { data: productData} = useGetProductsQuery(undefined, { skip: !needsReferenceData });
    // const { data: categoryData } = useGetCategoriesQuery(undefined, { skip: !needsReferenceData });    
    const { data: productData} = useGetProductsQuery(undefined, { skip: !needsReferenceData });
    const { data: categoryData } = useGetCategoriesQuery();
    const { data: customerData } = useGetCustomersQuery();

    const [selectedProduct, setSelectedProduct] = useState("");
    const { data: selectedProductData } = useGetProductByIdQuery(selectedProduct, { skip: !selectedProduct });
    const [stock, setStock] = useState<number>()

    const [discount, setDiscount] = useState<number>(0);
    const [grandTotal, setGrandTotal] = useState<number>(0);
    // const [description, setDescription] = useState<string>("");
    // const [status, setStatus] = useState<string>("");
    // const [partialAmount, setPartialAmount] = useState<number | ''>(0);

    const [status, setStatus] = useState('');
    const [partialAmount, setPartialAmount] = useState<number | ''>('');
    const [description, setDescription] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState('');



    let invoices: any = invoiceData?.invoices || [];
    console.log("Invoices", invoices);

    //let suppliers: any = supplierData?.suppliers || [];
    let categories: any = categoryData?.categories || [];
    let products: any = productData?.products || [];
    let customers: any = customerData?.customers || [];

    console.log('Categories: ', categories);
    console.log('Products: ', products);
    
    const [selectedCategory, setSelectedCategory] = useState("");

    console.log('Selected Category: ', selectedCategory);


    const [newRowData, setNewRowData] = useState({
        quantity: 0,
        unitPrice: 0,
    });

    const [startDate, setStartDate] = useState<Date | null>(new Date());

    interface RowData {
        id: number;
        startDate: Date | null;
        category: string;
        productName: string;
        quantity: number;
        unitPrice: number;
        totalPrice: number;
    }

    const [rows, setRows] = useState<RowData[]>([]);


    const [openAddRowModal, setOpenAddRowModal] = useState(false);

    const handleCloseAddRowModal = () => {

        setOpenAddRowModal(false);
    };










    //const t = new Date().toLocaleDateString();
    
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const [newInvoice, setNewInvoice] = useState({
        _id: "",
        invoiceNumber: "",
        invoiceDate: "",
        description: "",
        status: false,
        category: "",
        product: "",
    });

    let filteredProducts = selectedCategory
        ? products.filter((p: any) => p.category?._id === selectedCategory)
        : products;

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const [filter, setFilter] = useState("");

    // const [addInvoice] = useAddInvoiceMutation();
    // const [deleteInvoice] = useDeleteInvoiceMutation();
    //const [updateInvoice] = useUpdateInvoiceMutation();

    
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


    const handleCloseDeleteConfirmation = () => {
        setRowToDelete(null);
        setOpenDeleteConfirmation(false);
    }

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };


    const filteredInvoices = invoices.filter((invoice: any) => {
        return invoice?.product?.name.toLowerCase().includes(filter.toLowerCase()) ||
               invoice?.supplier?.name.toLowerCase().includes(filter.toLowerCase());
    });


    const handleFilterChange = (e: any) => {
        setFilter(e.target.value);
    };


    useEffect(() => {
        if (error) {
            setSnackbar({ open: true, message: "Failed to fetch invoices", severity: "error", });
        }
    }, [error]);

    const handleCategorySelectionChange = (e: SelectChangeEvent) => {
        setSelectedCategory(e.target.value);
    }

    const handleProductSelectionChange = (e: SelectChangeEvent) => {
        setSelectedProduct(e.target.value);
        setNewInvoice({...newInvoice, product: e.target.value});
    }



    useEffect(() => {
        if (selectedProductData?.product) {
            setStock(selectedProductData.product.quantity);
            console.log('Product data:', selectedProductData.product);
        }
    }, [selectedProductData]);


    const handleTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewRowData({...newRowData, [event.target.name]: event.target.value});

    }

    const handleAddRow = () => {
        const quantity = stock || 0;
        const unitPrice = newRowData.unitPrice || 0;
        const totalPrice = quantity * unitPrice;
        
        const newRow = {
            id: rows.length + 1,
            startDate: startDate,
            category: selectedCategory,
            productName: selectedProduct,
            quantity: quantity,
            unitPrice: unitPrice,
            totalPrice: totalPrice,
        };

        setRows(prevRows => [...prevRows, newRow]);
        setNewRowData({ quantity: 0, unitPrice: 0 });
        setSelectedCategory("");
        setSelectedProduct("");
        setStock(undefined);
        setStartDate(new Date());
        handleCloseAddMoreModal();
    }

    useEffect( ()=> {
        setGrandTotal(calculateGrandTotal());
    }, [discount, rows]);

    const handleTextFieldChangeInList = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, id: number, name: string) => {
        const updatedRows = rows.map(row => {
            if (row.id === id) {
                const updatedRow = { ...row, [name]: event.target.value };
                if (name === 'quantity') {
                    updatedRow.totalPrice = updatedRow.quantity * updatedRow.unitPrice;
                } else if (name === 'unitPrice') {
                    updatedRow.totalPrice = updatedRow.quantity * updatedRow.unitPrice;
                }
                return updatedRow;
            }
            return row;
  
        });
        setRows(updatedRows);
    };


    const calculateGrandTotal = () => {
        const totalWithoutDiscount = rows.reduce((total, row) => total + (parseFloat(row.totalPrice.toString()) || 0), 0);
        return totalWithoutDiscount - discount;
    }


    const handleDeleteRowInList = (id: number) => {
        setRowToDelete(id);
        setOpenDeleteConfirmation(true);

    }

    
    const handleDeleteNewItem = () => {
        setRows(rows.filter(row => row.id !== rowToDelete));
        setOpenDeleteConfirmation(false);

    }

    const handleStatusChange = (e: SelectChangeEvent) => {
        const selectedStatus = e.target.value;
        setStatus(selectedStatus);
        if (selectedStatus !== 'partial_paid') {
            setPartialAmount('');
        }
    }

    const handlePartialAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPartialAmount(value === '' ? '' : parseFloat(value));
    }

    const handleCustommerSelectionChange = (e: SelectChangeEvent) => {
        const customerId = e.target.value;
        setSelectedCustomer(customerId);
        
        if (customerId !== "new_customer" && customerId !== "") {
            const customer = customers.find((c: any) => c._id === customerId);
            setName(customer?.name || '');
            setEmail(customer?.email || '');
            setPhone(customer?.phone || '');
        } else {
            setName('');
            setEmail('');
            setPhone('');
        }
    }

    const handleAddInvoiceFormSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (rows.length === 0) {
            setSnackbar({ open: true, message: "Please add at least one item", severity: "warning" });
            return;
        }

        const purchaseData = rows.map((invDetails) => ({
            //invoice: invoice?.id,
            category: invDetails.category,
            product: invDetails.productName,
            date: invDetails.startDate?.toISOString(),
            quantity: invDetails.quantity,
            price: invDetails.unitPrice,
            total: invDetails.totalPrice,
            discount: 0,
        }));

        const hasEmptyFields = purchaseData.some((row: any) => {
            return !row.category || !row.product || !row.date || !row.quantity || !row.price || !row.total;
        });

        if (hasEmptyFields) {
            setSnackbar({ open: true, message: "Please fill in all fields", severity: "warning" });
            return;
        }

        const payload = {
            invoiceDate: rows[0].startDate?.toISOString(),
            date: rows[0].startDate?.toISOString(),
            grandTotal,
            partialAmount,
            selectedCustomer,
            name,
            email,
            phone,
            discount,
            description,
            purchaseData: purchaseData,
            status: status,// === 'full_paid',
        };

        console.log('Payload:', payload);

        await addInvoice(payload).unwrap()
            .then((res: any) => {
                
                setSnackbar({ open: true, message: "Invoice saved successfully", severity: "success" });
                setRows([]);
                setDiscount(0);
                setStatus('');
                setPartialAmount('');
                setDescription('');
                setSelectedCustomer('');
                setName('');
                setEmail('');
                setPhone('');
            })
            .catch((error: any) => {
                console.error('Error saving invoice:', error);
                setSnackbar({ open: true, message: error?.data?.err || error?.message || "Failed to save invoice", severity: "error" });
            });

    }


    return (
        <Box sx={{ p: 2, maxWidth: "100%", width: "2048px" }} >
            <Typography variant="h5" sx={{ mb: 2 }}
                style={{
                    fontSize: "3rem",
                    color: "#0073e6", // a nice blue color
                    marginBottom: "20px", // 1rem = 16px
                    textAlign: "center",
                    fontWeight: "bold",
                    textShadow: "1px 1px 2px rgba(109, 71, 71, 0.2)", // add a subtle shadow
                    padding: "10px",
                    borderBottom: "2px solid #0073e6", // underline effect
                    letterSpacing: "1px",
                }}

            >
                Add Invoice
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
                            <TableCell sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>Total Price</TableCell>
                            <TableCell sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {rows.map((row: any) => {
                            const cat = categories.find((c: any) => c._id === row.category);
                            const prod = products.find((p: any) => p._id === row.productName && p.category?._id === row.category);
                            console.log('cat: ', cat);
                            console.log('prod: ', prod);
                            return (
                                <TableRow key={row.id}>

                                    <TableCell>
                                        <TextField 
                                            fullWidth
                                            sx={{xs: 12, sm: 4}}
                                            value={cat?.name || row.category}
                                        />
                                    </TableCell>

                                    <TableCell>
                                        <TextField 
                                            fullWidth
                                            sx={{xs: 12, sm: 4}}
                                            value={prod?.name || row.product}                                        
                                        />    
                                    </TableCell>  

                                    <TableCell>                                        
                                        <TextField 
                                            fullWidth
                                            value={row.quantity}
                                            
                                            onChange={ (e) => handleTextFieldChangeInList(e, row.id, "quantity")}
                                        />   
                                    </TableCell>

                                    <TableCell>
                                        <TextField 
                                            fullWidth
                                            value={row.unitPrice}

                                            onChange={ (e) => handleTextFieldChangeInList(e, row.id, "unitPrice")}
                                        />                                                                                   
                                    </TableCell>

                                    <TableCell>
                                        {row.totalPrice}                              
                                    </TableCell>

                                    <TableCell>
                                        <IconButton 
                                            onClick={() => handleDeleteRowInList(row.id)}
                                        >
                                            <Delete sx={{ color: "red", "&:hover": { color: "darkred" } }} />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            );
                        })}

                        <TableRow>
                            <TableCell colSpan={4}>
                                <Typography variant="h6">Discount</Typography>
                            </TableCell>
                            <TableCell>
                                <TextField  fullWidth 
                                    value={discount}
                                    type="number" sx={{ mr:2 }}
                                    onChange={(e) => setDiscount(parseFloat(e.target.value))}
                                />
                            </TableCell>
                        </TableRow>

                         <TableRow>
                            <TableCell colSpan={4}>
                                <Typography variant="h6">Grand Total</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="h6">{grandTotal.toFixed(2)}</Typography>
                            </TableCell>
                        </TableRow>
             


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


                <Grid container spacing={2} sx={{
                    xs: 12, 
                    sm: 6,
                    my: 5,
                    maxWidth: 800,
                }}>
                    <TextField fullWidth 
                        label="Description" 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </Grid>

                <Box sx={{ display: "flex", flexDirection: "raw", alignItems: "center" }}> 
                    <FormControl fullWidth variant="outlined" sx={{maxWidth: 500, m: 1 }}>
                        <InputLabel id="paid-status-label">Paid Status</InputLabel>
                        <Select                            
                            labelId="paid-status-label"
                            id="paid_status"
                            label="Paid Status"
                            value={status}
                            onChange={ handleStatusChange }
                            sx={{
                                mt: 0,
                                color: "black",
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
                                    fill: 'black !important',
                                },
                                
                            }}
                        >
                            <MenuItem value="">Select Status</MenuItem>
                            <MenuItem value="full_paid">Full Paid</MenuItem>
                            <MenuItem value="full_due">Full Due</MenuItem>
                            <MenuItem value="partial_paid">Partial Paid</MenuItem>
                        </Select>
                    </FormControl>  

                    {status ==="partial_paid" && (
                        <TextField 
                            fullWidth
                            variant="outlined"
                            label="Enter Partial Payment Amount"
                            sx={{ maxWidth: 300, ml: 1}}
                            value={partialAmount}
                            onChange={handlePartialAmountChange}
                        />
                    )}     
                </Box>




                <Box 
                    sx={{ display: "flex", flexDirection: "raw", alignItems: "center" }}
                > 
                    <FormControl 
                        fullWidth 
                        variant="outlined" 
                        sx={{maxWidth: 500, m: 1}}>
                        <InputLabel id="customer-label">Customer Name</InputLabel>
                        <Select                            
                            labelId="customer-label"
                            id="customer"
                            label="Customer Name"
                            value={selectedCustomer}
                            onChange={ handleCustommerSelectionChange }
                            // sx={{
                            //     mt: 0,
                            //     color: "black",
                            //     ".MuiOutlinedInput-notchedOutline": {
                            //         borderColor: 'blue',
                            //     },
                            //     "&Mui-focused .MuiOutlinedInput-notchedOutline": {
                            //         borderColor: 'blue',
                            //     },
                            //     "&:hover .MuiOutlinedInput-notchedOutline": {
                            //         borderColor: 'blue',
                            //     },
                            //     "& .MuiSvgIcon-root": {
                            //         fill: 'black !important',
                            //     },
                                
                            // }}
                        >
                            <MenuItem value="">Select Customer</MenuItem>
                            {
                                customers && customers?.map((c: any, index: number) => (
                                    <MenuItem
                                        key={c._id}
                                        value={c._id}
                                    >
                                        {c.name}
                                    </MenuItem>
                                ))
                            }
                            <MenuItem value="new_customer">New Customer</MenuItem>
                        </Select>
                    </FormControl>

                    {selectedCustomer === "new_customer" && (
                        <Box component="form" sx={{ maxWidth: 500, width: '100%', }}>
                            <Typography variant="h6" gutterBottom>
                                New Customer Information
                            </Typography>
                            <TextField
                                fullWidth
                                label="Name"
                                variant="outlined"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                sx={{ mb: 2}}
                            />
                            <TextField
                                fullWidth
                                label="Email"
                                variant="outlined"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                sx={{ mb: 2}}
                            />
                            <TextField
                                fullWidth
                                label="Phone Number"
                                variant="outlined"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                sx={{ mb: 2}}
                            />
                        </Box>

                    )}


                </Box>
            </TableContainer>

            <Button
                fullWidth
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddInvoiceFormSubmit}
                sx={{
                    p: 1,
                    backgroundColor: "blue",
                    "&:hover": {
                        backgroundColor: "darkblue",
                    },
                }}
            >
                Invoice Store
            </Button>


            <InvoiceList />


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
                        
                        <Grid size={{ xs: 12 }}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel>Category</InputLabel>
                                <Select
                                    name="category"
                                    label="Category"
                                    value={selectedCategory}
                                    onChange={handleCategorySelectionChange}
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
                                    //disabled={!newInvoice.supplier}
                                >
                                    {
                                        categories && categories?.map((c: any, index: number) => (
                                            <MenuItem
                                                key={c._id}
                                                value={c._id}
                                            >
                                                {c.name}
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
                                    value={selectedProduct}
                                    onChange={handleProductSelectionChange}
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
                                    //disabled={!newInvoice.category}
                                >

                                    {
                                        filteredProducts && filteredProducts?.map((p: any, index: number) => (
                                            <MenuItem
                                                key={p._id}
                                                value={p._id}
                                            >
                                                {p.name}
                                            </MenuItem>

                                        ))
                                    }   
                                </Select>
                            </FormControl>
                        </Grid>

                         <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                //required
                                type="number"
                                fullWidth
                                variant="outlined"
                                label="Stock"
                                name="quantity"
                                value={stock || 0}
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
                                name="unitPrice"
                                value={newRowData.unitPrice || 0}
                                onChange={handleTextFieldChange}
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
                                //value={newInvoice.date}
                                selected={startDate}
                                customInput={ <input style={customInputStyle} /> }
                                onChange={(date: Date | null) => {
                                    if (date) {
                                        setStartDate(date);
                                        //setNewInvoice({ ...newInvoice, invoiceDate: date.toISOString() });
                                    }
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
                                color: "red",
                                "&:hover": {
                                    borderColor: "darkred",
                                },
                            }}
                        >
                            Cancel
                        </Button>
                        <Button  
                            onClick={handleAddRow}         
                            variant="contained"
                            sx={{
                                backgroundColor: "blue",
                                "&:hover": {
                                    backgroundColor: "blue",
                                },
                            }}

                        >
                            Add Row
                        </Button>
                    </Box>
                </Box>
            </Modal>

            {/* end add new row modal */}


 


            {/* start confirm deletion modal */}
            <Modal
                open={openDeleteConfirmation}
                onClose={handleCloseDeleteConfirmation}
                aria-labelledby="delete-invoice-modal"
                aria-describedby="delet-invoice-modal-description"
                sx={modalBackdropStyle}
            >
                <Box sx={modalStyle}>
                    <Typography id="delete-invoice-modal" variant="h6" component="h2">
                        Confirm Invoice Deletion
                    </Typography>
                    <Typography sx={{ mt: 2 }}>
                        Are you sure you want to delete this item
                        {/* &nbsp;&quot;{row.invoiceNumber}&quot;? */}
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                        <Button
                            onClick={handleCloseDeleteConfirmation}
                            sx={{ mr: 2 }}
                        >
                            Cancel
                        </Button>                    
                        <Button variant="contained" color="error"
                            onClick={handleDeleteNewItem}
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
}; // end AddInvoice()


const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 800,
    bgcolor: "#000",
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
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

export default AddInvoice;