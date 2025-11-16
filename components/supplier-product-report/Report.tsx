"use client";

import { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import PrintIcon  from '@mui/icons-material/Print';
import {
    Box, Button,
    Typography, Table, TableBody, TableCell, TableHead, TableRow,
    FormControl,
    MenuItem,
    RadioGroup,
    FormControlLabel,
    Radio,
    Select,
    InputLabel
} from '@mui/material';

import Grid from '@mui/material/Grid';

import { useGetPaymentsQuery } from "@/lib/features/payments/paymentsApiSlice";

import SnapPOS from '@/components/nav/SnapPOS';

const SupplierProductReport = () => {

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [data, setData] = useState([]);
    const [category, setCategory] = useState([]);
    const [supplier, setSupplier] = useState([]);
    const [supplierName, setSupplierName] = useState("");
    const [productName, setProductName] = useState("");

    const [stockReport, setStockReport] = useState([]);
    const [selectedReport, setSelectedReport] = useState('supplier');

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const { data: paymentData } = useGetPaymentsQuery();

    const tableRef = useRef<HTMLDivElement>(null);



    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };



    useEffect(() => {
        fetchReport();
    }, []);




    const fetchReport = async() => {
        try {
            const response = await fetch('/api/user/supplier-product-report', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const report = await response.json();
            setCategory(report.categories);
            setSupplier(report.suppliers);

            //const products = report.products;
            //setStockReport(products);
        } catch (error) {
            console.error('Error fetching report:', error);
        }
    };

  
    const handleReportChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedReport(e.target.value);
        setData([]);

    }


    const handleSubmit = async ()=>{
        try{
            const response = await fetch('/api/user/supplier-product-report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    reportType: selectedReport,
                    name: selectedReport === 'supplier' ? supplierName : productName,
                }),
            });

            const data = await response.json();
            setData(data);

        } catch(error) {
            console.log("Error fetching data", error);
        
    }

    const printTable = () => {

        if (!tableRef.current) return;
        const printContent = tableRef.current.innerHTML;
        const originalContent = document.body.innerHTML;

        document.body.innerHTML = printContent;
        window.print();

        // This destroys the React component tree, making it impossible to print again. 
        //document.body.innerHTML = originalConent; // restore the content; 
        // Reloads the page to restore the React component tree, so that it can be printed again.
        window.location.reload();
    }


    return (
        <>
            <h2
                style={{
                    fontSize: '3rem',
                    color: '#0073E6',
                    marginBottom: '20px',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
                    padding: '10px',
                    borderBottom: '2px solid #0073E6',
                    letterSpacing: '1px',
                }}
            >
                Supplier and Product Wise Report
            </h2>
                
            <FormControl component='fieldset'>


                <RadioGroup
                    row
                    value={selectedReport}
                    onChange={handleReportChange}


                    name="reportType"
                >
                    <FormControlLabel

                        value='supplier'
                        control={<Radio
                            
                                sx={{
                                    color: 'green',
                                    '&.Mui-checked':{
                                        color: 'green',
                                    },
                                }}

                            />

                        }

                        label="Supplier Wise Report" />


                    <FormControlLabel

                        value='product'
                        control={<Radio
                                sx={{
                                    color: 'green',
                                    '&.Mui-checked':{
                                        color: 'green',
                                    },
                                }}

                            />

                        }

                        label="Product Wise Report" />
                </RadioGroup>
            </FormControl>


            {selectedReport === "supplier" && (
                <Grid sx={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth variant='outlined'>
                        <InputLabel>Supplier Name</InputLabel>
                        <Select
                            label='Supplier Name'
                            value='supplierName'
                            onChange={(e)=> setSupplierName(e.target.value)}
                            fullWidth
                            //margin='normal' //90
                            sx={{
                                mt: 3,
                                color: 'white',
                                '.MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'blue',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'blue',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'blue',
                                },
                                '.MuiSvgIcon-root ': {
                                    fill: 'white !important',
                                }
                            }}
                        >
                            {supplier &&
                                supplier.map((supplier: any) => (
                                    <MenuItem key={supplier._id} value={supplier._id}>
                                        {supplier.name}
                                    </MenuItem>
                                ))}

                        </Select>
                    </FormControl>
                </Grid>
            )}


            {selectedReport === "product" && (
                <Grid sx={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth variant='outlined'>
                        <InputLabel>Category Name</InputLabel>
                        <Select
                            label='Product Name'
                            value='productName'
                            onChange={(e)=> setProductName(e.target.value)}
                            fullWidth
                            //margin='normal' //177
                            sx={{
                                mt: 3,
                                color: 'white',
                                '.MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'blue',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'blue',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'blue',
                                },
                                '.MuiSvgIcon-root ': {
                                    fill: 'white !important',
                                }

                            }}
                        >
                            {category &&
                                category.map((category: any) => (
                                    <MenuItem key={category._id} value={category._id}>
                                        {category.name}
                                    </MenuItem>
                                ))}

                        </Select>
                    </FormControl>
                </Grid>
            )}



// 260
<Grid container spacing={2} sx={{ mt: 2 }}>
    <Grid sx={{ xs: 12, sm: 12}}>
        <Button

            variant='contained'
            sx={{
                width: "100%",
                p: 3,
                backgroundColor: 'blue',
                '&:hover': {
                    backgroundColor: 'blue',
                },
                height: '100%',
                //minWidth: '600px',
            }}
            onClick={handleSubmit}
        >
            Search  //276
        </Button>
    </Grid>
</Grid>
{data && (
    <div>
        <h2
            style={{
                fontSize: '3rem',
                color:"#0073E6",
                marginBottom: "20px",
                textAlign: "center",
                fontWeight: "bold",
                textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
                padding:"10px",
                borderBottom: "2px solid #0073E6",
                letterSpacing: "1px", //291
            }}
        >
            Supplier and Product Wise Report

        </h2>

        <Table
            style={{
                backgroundColor: "white",
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // 306
            }}
        >
            <TableHead>
                <TableRow>
                    <TableCell>S.No</TableCell>
                    <TableCell>Product Name</TableCell>
                    <TableCell>Category Name</TableCell>
                    <TableCell>Stock //314</TableCell>

                </TableRow>
            </TableHead>



            <TableBody>
                {data &&
                data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((product: any, index: number) => (
                    <TableRow key={product._id}>
                        <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                        <TableCell>{product?.name}</TableCell>
                        <TableCell>{typeof product?.category === 'object' ? product?.category?.name : product?.category}</TableCell>
                        <TableCell>{product?.quantity}</TableCell>
                    </TableRow>
                ))
                }
            </TableBody>
        </Table>
        {
            data &&
            <Grid container spacing={2} sx={{ mt: 2}}>
                <Grid sx={{ xs: 12, sm: 12}}>
                    <Button
                        fullWidth
                        variant='contained'
                        startIcon={<PrintIcon />}
                        onClick={ printTable }
                        sx={{
                            p: 3,
                            alignContent: 'center',
                            backgroundColor: 'blue',
                            '&:hover': {
                                backgroundColor: 'blue',
                            },
                            height: '100%',
                            minWidth: '600px',
                        }}
                    >
                        Print
                    </Button>
                </Grid>
            </Grid>
        }

    </div>
)}









        </>
    );
}
}

export default SupplierProductReport;