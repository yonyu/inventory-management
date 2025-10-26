

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

    const [daily, setDaily] = useState(null);

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

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

        const response = await fetch(`${process.env.API}/user/daily-order-report`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ startDate, endDate }),
        });

        const data = await response.json();
        setDaily(data);
        console.log(data);


    };


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
                    onChange={(date: Date) => setStartDate(date)}
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
                            }}
                        >
                            Search
                        </Button>
                    </Grid>
                </Grid>
            </Box>

            {daily && (
                <>

                </>
            )}

            
        </>
    );
}














const customInputStyles = { // 218
    minWidth: '430px',
    height: '60px',
    borderColor: 'blue',
    borderWidth: '2px',
    BorderStyle: 'solid',
    backGroundColor: 'black',
    color: 'white',
    padding: '5px', // Padding to ensure text doesn't touch the border
    outline: 'none',
};

// 230
export default DailyOrderReport;