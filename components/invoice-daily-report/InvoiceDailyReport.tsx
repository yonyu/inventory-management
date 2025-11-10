"use client";

import { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import PrintIcon  from '@mui/icons-material/Print';
import {
    Box, Button,
    Typography, Table, TableBody, TableCell, TableHead, TableRow
} from '@mui/material';

import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";

import FindInPageIcon from '@mui/icons-material/FindInPage';
import Grid from '@mui/material/Grid';
import { border, borderColor, height, minWidth } from '@mui/system';
import { BorderStyle } from '@mui/icons-material';

import { useAddInvoiceMutation, useGetInvoicesQuery, useDeleteInvoiceMutation } from "@/lib/features/invoices/invoicesApiSlice";
import { useGetPaymentsQuery } from "@/lib/features/payments/paymentsApiSlice";

import SnapPOS from '@/components/nav/SnapPOS';

const InvoiceDailyReport = () => {

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [daily, setDaily] = useState([]);

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



    const payments = paymentData?.payments || [];



    const handleSearch = async () => {
        if (!startDate || !endDate) {
            alert('Please select both start and end dates.');
            return;
        }

        try {
            const response = await fetch(`${process.env.API}/user/invoice-daily-report`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ startDate, endDate }),
            });

            const data = await response.json();
            //console.log('API Response:', data);
            //console.log('Is Array:', Array.isArray(data));
            const invoices = Array.isArray(data) ? data : (data?.invoices || data?.data || []);
            //console.log('Orders to set:', orders);
            setDaily(invoices);

        } catch(err) {
            console.error('Error fetching invoice data:', err);
        }
    };

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

        // if (!tableRef.current) return;
        // const printContent = tableRef.current.innerHTML;
        // const printWindow = window.open('', '', 'width=800,height=600');
        // if (!printWindow) return;
        // printWindow.document.body.innerHTML = `
        //     <style>
        //         body { font-family: Arial, sans-serif; margin: 20px; }
        //         table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        //         th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        //         th { background-color: #0073e6; color: white; font-weight: bold; }
        //         tr:nth-child(even) { background-color: #f9f9f9; }
        //         h1 { color: #0073e6; text-align: center; border-bottom: 2px solid #0073e6; padding-bottom: 10px; }
        //         @media print { button { display: none; } }
        //     </style>
        //     ${printContent}
        // `;
        // printWindow.print();
    }


    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap:2 }}>

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
                            startIcon={<ContentPasteSearchIcon />}
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
                            <TableCell>S.No</TableCell>
                            <TableCell>Invoice Number</TableCell>
                            <TableCell>Invoice Date</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Customer Name</TableCell>
                            <TableCell>Amount</TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {daily &&
                        daily.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((invoice: any, index: number) => (
                            <TableRow key={invoice._id}>
                                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                <TableCell>{invoice?.invoiceNumber}</TableCell>
                                <TableCell>{new Date(invoice?.invoiceDate).toLocaleDateString()}</TableCell>
                                <TableCell>{invoice?.description}</TableCell>

                                {
                                    (() => {
                                        const matchingPayment = Array.isArray(payments) ? payments.find((payment: any) => payment?.invoice?._id?.toString() === invoice._id.toString()) : null;
                                        const customerName = matchingPayment && typeof matchingPayment.customer === 'object' ? matchingPayment.customer.name : 'n/a';
                                        return (
                                            <>
                                                <TableCell>{customerName}</TableCell>
                                                <TableCell>{matchingPayment?.totalAmount || 'n/a'}</TableCell>
                                            </>
                                        );
                                    })()
                                }
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
                                alignContent: 'center',
                                backgroundColor: 'blue',
                                '&:hover': {
                                    backgroundColor: 'darkblue',
                                },
                                height: '100%',
                                minWidth: '600px',
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

const customInputStyles = {
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

export default InvoiceDailyReport;