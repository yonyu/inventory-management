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
import { useGetProductsQuery, useGetProductByIdQuery } from "@/lib/features/products/productsApiSlice";
import { useGetSuppliersQuery } from "@/lib/features/suppliers/suppliersApiSlice";
import { useGetCategoriesQuery } from "@/lib/features/categories/categoriesApiSlice";
import { bgcolor, borderColor, height, minWidth } from "@mui/system";
import { set } from "mongoose";



//import InvoiceList from "./InvoiceList";

const AddInvoice = () => {

    const [openAddMoreModal, setOpenAddMoreModal] = useState(false);

    const handleOpen = () => setOpenAddMoreModal(true);

    const handleCloseAddMoreModal = () => {
        setOpenAddMoreModal(false);
    };

    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [pendingInvoices, setPendingInvoices] = useState<any[]>([]);

    const dispatch = useAppDispatch();

    const { data: invoiceData, error, isLoading: loading } = useGetInvoicesQuery();
    
    // Only load reference data when modals are open
    const needsReferenceData = openAddMoreModal || openEditModal;
    // const { data: productData} = useGetProductsQuery(undefined, { skip: !needsReferenceData });
    // const { data: categoryData } = useGetCategoriesQuery(undefined, { skip: !needsReferenceData });    
    const { data: productData} = useGetProductsQuery(undefined, { skip: !needsReferenceData });
    const { data: categoryData } = useGetCategoriesQuery();

    const [selectedProduct, setSelectedProduct] = useState("");
    const { data: selectedProductData } = useGetProductByIdQuery(selectedProduct, { skip: !selectedProduct });
    const [stock, setStock] = useState<number>()


    let invoices: any = invoiceData?.invoices || [];
    console.log("Invoices", invoices);

    //let suppliers: any = supplierData?.suppliers || [];
    let categories: any = categoryData?.categories || [];
    let products: any = productData?.products || [];

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
        unitPirce: number;
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

    //const [supplierName, setSupplierName] = useState("");
    const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

    const [editInvoice, setEditInvoice] = useState({
        _id: "",
        invoice_number: "",
        description: "",
        invoiceDate: new Date().toISOString(),
        status: false,
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

    // let filteredCategories = newInvoice.supplier
    //     ? products.filter((p: any) => p.supplier?._id === newInvoice.supplier)
    //         .map((p: any) => p.category)
    //         .filter((c: any, i: number, arr: any[]) => c && arr.findIndex((cat: any) => cat?._id === c?._id) === i)
    //     : categories;

    // let filteredProducts = newInvoice.category
    //     ? products.filter((p: any) => p.category?._id === newInvoice.category && (!newInvoice.supplier || p.supplier?._id === newInvoice.supplier))
    //     : newInvoice.supplier
    //     ? products.filter((p: any) => p.supplier?._id === newInvoice.supplier)
    //     : products;

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


    const handleSelectionChange = (e: SelectChangeEvent) => {
        const { name, value } = e.target;
        setNewInvoice({...newInvoice, [name]: value});
    }

    const handleAddMoreModal = () => {
        const invoiceToAdd = {
            ...newInvoice,
            date: newInvoice.invoiceDate || new Date().toISOString(),
            //total_cost: newInvoice.quantity * newInvoice.unit_price,
            tempId: Date.now()
        };
        setPendingInvoices([...pendingInvoices, invoiceToAdd]);
        setSnackbar({ open: true, message: "Row added to list", severity: "success" });
        setNewInvoice({
            _id: "",
            invoiceNumber: "",
            invoiceDate: "",
            description: "",
            status: false,
            category: "",
            product: "",
        });
        setStartDate(new Date());
    }


    const handleAddMoreFormSubmit = async () => {
        if (pendingInvoices.length === 0) {
            setSnackbar({ open: true, message: "No invoices to save", severity: "warning" });
            return;
        }

        // try {
        //     const invoicesToSave = pendingInvoices.map(({ tempId, _id, ...invoice }) => invoice);
        //     await addInvoice(invoicesToSave).unwrap();
        //     setSnackbar({ open: true, message: `${pendingInvoices.length} invoice(s) saved successfully`, severity: "success" });
        //     setPendingInvoices([]);
        // } catch (error: any) {
        //     setSnackbar({ open: true, message: error?.data?.err || error?.message || "Failed to save invoices", severity: "error" });
        // }
    }

    // const handleAddInvoice = () => {
    //     addInvoice(newInvoice)
    //         .unwrap()
    //         .then(() => {
    //             setSnackbar({ open: true, message: "Invoice added successfully", severity: "success", });

    //             handleCloseAddModal();

    //         })
    //         .catch((error: any) => {

    //             setSnackbar({ open: true, message: error?.data?.err || error?.message || "Failed to add invoice", severity: "error", });

    //             console.error("Error adding invoice:", error);
    //         });
    // }

    const handleCloseDeleteModal = () => setOpenDeleteModal(false);

    const handleOpenDeleteModal = (invoice: any) => {
        setSelectedInvoice(invoice);
        setOpenDeleteModal(true);

    }

    const handleDeleteInvoice = () => {
        if (selectedInvoice?.tempId) {
            setPendingInvoices(pendingInvoices.filter(o => o.tempId !== selectedInvoice.tempId));
            setSnackbar({ open: true, message: "Pending invoice removed", severity: "success" });
            handleCloseDeleteModal();
        } else {
            deleteInvoice(selectedInvoice?._id).unwrap()
                .then(() => {
                    setSnackbar({ open: true, message: "Invoice deleted successfully", severity: "success" });
                    handleCloseDeleteModal();
                })
                .catch((error: any) => {
                    setSnackbar({ open: true, message: error?.data?.err || error?.message || "Failed to delete invoice", severity: "error" });
                });
        }
    }

    const handleOpenEditModal = (invoice: any) => {
        setOpenEditModal(true);
        setSelectedInvoice(invoice);
        setEditInvoice({ 
            ...invoice,
            product: typeof invoice.product === 'object' ? invoice.product._id : invoice.product,
            category: typeof invoice.category === 'object' ? invoice.category._id : invoice.category,
            supplier: typeof invoice.supplier === 'object' ? invoice.supplier._id : invoice.supplier
        });
    };

    const handleCloseEditModal = () => setOpenEditModal(false);

    const handleEditInvoice = () => {
        const { _id, ...data } = editInvoice;
        // updateInvoice({ _id, data })
        //     .unwrap()
        //     .then(() => {
        //         setSnackbar({ open: true, message: "Invoice updated successfully", severity: "success", });
        //         handleCloseEditModal();
        //     })
        //     .catch((error: any) => {
        //         setSnackbar({ open: true, message: error?.data?.err || error?.message || "Failed to update invoice", severity: "error", });
        //     });

    }

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };


    const filteredInvoices = invoices.filter((invoice: any) => {
        //invoice?.name?.toLowerCase().includes(filter.toLowerCase());
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

    const handleModalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewInvoice({...newInvoice, [event.target.name]: event.target.value});
    }

    const handleInvoiceNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewInvoice({...newInvoice, invoiceNumber: event.target.value});
    }

    const handleCategorySelectionChange = (e: SelectChangeEvent) => {
        setSelectedCategory(e.target.value);
        //setNewInvoice({...newInvoice, category: e.target.value});
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
        const newRow = {
            id: rows.length + 1,
            startDate: startDate,
            category: selectedCategory,
            productName: selectedProduct,
            quantity: newRowData.quantity,
            unitPirce: newRowData.unitPrice,


        };


        setRows(prevRows => [...prevRows, newRow]);
        setNewRowData({ quantity: 0, unitPrice: 0 });
        setSelectedCategory("");
        setSelectedProduct("");
        setStartDate(new Date());
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

                            // setStartDate(new Date());
                            // setNewInvoice({
                            //     ...newInvoice,
                            //     invoiceNumber: "",
                            //     // supplier: "",
                            //     // category: "",
                            //     invoiceDate: "",
                            //     description: "",

                            //     // quantity: 0,
                            //     // unit_price: 0,
                            //     // total_cost: 0,
                            // });
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
                            <TableCell colSpan={3} sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>Category</TableCell>
                            <TableCell colSpan={3} sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>Product Name</TableCell>                          
                            <TableCell colSpan={3} sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>PSC/KG</TableCell>
                            <TableCell colSpan={3} sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>Unit Price</TableCell>    
                            <TableCell colSpan={3} sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>Total Price</TableCell>
                            <TableCell colSpan={3} sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>Actions</TableCell>
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
                                            value={cat?.name || row.category}
                                        />
                                    </TableCell>

                                    <TableCell>
                                        <TextField 
                                            fullWidth
                                            value={prod?.name || row.product}                                        
                                        />
                                    </TableCell>  

                                    <TableCell>                                        
                                        <TextField 
                                            fullWidth
                                            value={row.quantity}                                       
                                        />   
                                    </TableCell>

                                    <TableCell>
                                        <TextField 
                                            fullWidth
                                            value={row.unitPrice}                                      
                                        />                                                                                   
                                    </TableCell>

                                    <TableCell>
                                        <TextField 
                                            fullWidth
                                            value={row.totalPrice}                                        
                                        />                                           
                                    </TableCell>

                                    <TableCell>
                                        <IconButton 
                                            //onClick={() => handleOpenDeleteModal(order)}
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

                            <TableCell colSpan={12}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    sx={{ mr:2 }}
                                
                                />
                            </TableCell>



                            <TableCell sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                                <Typography variant="h6">Grand Total</Typography>
                            </TableCell>

                            <TableCell sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>Description</TableCell>                         
                            <TableCell sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>Paid Status</TableCell>   
                            <TableCell sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>Partial Payment Amount</TableCell>         

                            <TableCell sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>Customer Name</TableCell>  








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
                    xs: 12, sm: 6,
                    my: 5,
                }}>
                    <TextField fullWidth label="Description" />
                </Grid>

                <Box sx={{ m: 1}}> 



                    <FormControl fullWidth variant="outlined" sx={{maxWidth: 10}}>
                        <InputLabel>Paid Status</InputLabel>
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


                </Box>


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
                Invoice Store
            </Button>


            {/* <InvoiceList /> */}


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
                        Are you sure you want to delete invoice
                        &nbsp;&quot;{selectedInvoice?.invoiceNumber}&quot;?
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                        <Button
                            onClick={handleCloseDeleteModal}
                            sx={{ mr: 2 }}
                        >
                            Cancel
                        </Button>                    
                        <Button variant="contained" color="error"
                            onClick={handleDeleteInvoice}
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