

import { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import PrintIcon  from '@mui/icons-material/Print';
import {
    Box, Button,
    Typography, Table, TableBody, TableCell, TableHead, TableRow
} from '@mui/material';

import FindInPageIcon from '@mui/icons-material/FindInPage';
import Grid from '@mui/material/Grid';
import { border, borderColor, height, minWidth } from '@mui/system';
import { BorderStyle } from '@mui/icons-material';

import SnapPOS from '@/components/nav/SnapPOS';

const DailyOrderReport = () => {

    const [daily, setDaily] = useState([]);

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const tableRef = useRef<HTMLDivElement>(null);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };


    const handleSearch = async () => {
        if (!startDate || !endDate) {
            alert('Please select both start and end dates.');
            return;
        }

        const response = await fetch(`${process.env.API}/user/order-daily-report`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ startDate, endDate }),
        });

        const data = await response.json();
        //console.log('API Response:', data);
        //console.log('Is Array:', Array.isArray(data));
        const orders = Array.isArray(data) ? data : (data?.orders || data?.data || []);
        //console.log('Orders to set:', orders);
        setDaily(orders);


    };

    const printTable = () => {

        // if (!tableRef.current) return;
        // const printContent = tableRef.current.innerHTML;

        // window.print();
        // document.body.innerHTML = printContent;


        if (!tableRef.current) return;
        const printContent = tableRef.current.innerHTML;
        const printWindow = window.open('', '', 'width=800,height=600');
        if (!printWindow) return;
        printWindow.document.body.innerHTML = `
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                th { background-color: #0073e6; color: white; font-weight: bold; }
                tr:nth-child(even) { background-color: #f9f9f9; }
                h1 { color: #0073e6; text-align: center; border-bottom: 2px solid #0073e6; padding-bottom: 10px; }
                @media print { button { display: none; } }
            </style>
            ${printContent}
        `;
        printWindow.print();
    }


    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <DatePicker
                    selected={startDate}
                    onChange={(date: Date) => setStartDate(date)}
                    placeholderText="Start Date"
                    dateFormat="dd/MM/yyyy"
                    customInput={<input style={customInputStyles} />}

                />

                <DatePicker
                    selected={endDate}
                    onChange={(date: Date) => setEndDate(date)}
                    placeholderText="End Date"
                    dateFormat="dd/MM/yyyy"
                    customInput={<input style={customInputStyles} />}

                />

                <Grid container sx={{ mb: 2 }}>
                    <Grid sx={{ xs: 12, sm: 8 }}>
                        <Button 
                            fullWidth
                            variant="contained" 
                            startIcon={<FindInPageIcon />}
                            onClick={handleSearch}
                            sx={{ 
                                p: 2,
                                mt: 1,
                                height: '100%',
                                minWidth: '300px',
                            }}
                        >
                            Search
                        </Button>
                    </Grid>
                </Grid>
            </Box>

            <Box
                ref={tableRef}
            >
                        <h1
                            style={{
                                fontSize: '3rem',
                                color: '#0073e6', // a nice blue color
                                marginBottom: '20px', // to center the text vertically
                                textAlign: 'center', // to center the text horizontally
                                fontWeight: 'bold', // to make the text bold
                                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)', // to add a shadow effect
                                padding: '10px', // to add some padding around the text
                                borderBottom: '2px solid #0073e6', // to add a bottom border
                                letterSpacing: '1px',
                            }}
                        >
                            Daily Order Report
                        </h1>
                        <SnapPOS />
                        <Table
                            
                            sx={{
                                backgroundColor: 'white',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',

                            }}
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>S.No.</TableCell>
                                    <TableCell sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>Order No.</TableCell>
                                    <TableCell sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>Supplier Name</TableCell>
                                    <TableCell sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>Product Name</TableCell>
                                    <TableCell sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>Buying Quantity</TableCell>
                                    <TableCell sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>Unit Price</TableCell>
                                    <TableCell sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>Total Cost</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {daily.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((order: any, index: number) => (
                                <TableRow key={order._id}>
                                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                        <TableCell>{order?.order_number}</TableCell>
                                        <TableCell>{order?.supplier?.name}</TableCell>
                                        <TableCell>{order?.product?.name}</TableCell>
                                        <TableCell>{order.quantity}</TableCell>
                                        <TableCell>{order.unit_price}</TableCell>
                                        <TableCell>{order.total_cost}</TableCell>
                                    </TableRow>
                                ))
                                }
                            </TableBody>
                        </Table>
                        <Grid container spacing={2} sx={{ mt: 2}}>
                            <Grid sx={{ xs: 12, sm: 12}}>
                                <Button
                                    fullWidth
                                    variant='contained'
                                    startIcon={<PrintIcon />}
                                    onClick={ printTable }
                                    sx={{
                                        p: 3,
                                        backgroundColor: 'blue',
                                        '&:hover': {
                                            backgroundColor: 'darkblue',
                                        },
                                        height: '100%',
                                        minWidth: '300px',
                                    }}
                                >
                                    Print
                                </Button>
                            </Grid>
                        </Grid>
            </Box>

            
        </>
    );
}














const customInputStyles = { // 218
    minWidth: '430px',
    height: '60px',
    borderColor: 'blue',
    borderWidth: '2px',
    borderStyle: 'solid',
    backgroundColor: 'black',
    color: 'white',
    padding: '5px', // Padding to ensure text doesn't touch the border
    outline: 'none',
};

// 230
export default DailyOrderReport;