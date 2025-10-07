"use client"


// component/LatestTransaction.ts
import React, { useState, useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import { green, orange } from '@mui/material/colors';
import CircleIcon from '@mui/icons-material/Circle';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/system';//

const transactions = [
    {name: "Charles Casey", position: "Web Developer", status: "Active", age: "26", startDate: "2020/01/07"},
    {name: "Alex Adams", position: "Python Developer", status: "Deactive", age: "36", startDate: "2025/05/31"},
    {name: "Prezy Kelsey", position: "Senior Javascript Developer", status: "Active", age: "59", startDate: "2008/07/30"},
    {name: "Ruhi Fancher", position: "React Developer", status: "Active", age: "21", startDate: "2004/09/18"}
];



const LatestTransactions = () => {  //18
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <TableContainer component={Paper} sx ={{ overflowX: 'auto', mb: 2 }}>
            <Table sx={{ minWidth: 250 }}>
                <TableHead>
                    <TableRow>
                        <TableCell>Transaction ID</TableCell>
                        <TableCell>Product Name</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Transaction Date</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {transactions && transactions.map((transaction, index) => (
                        <TableRow 
                            key={index}
                            sx={{
                                '&:hover': {
                                    backgroundColor: theme.palette.action.hover,
                                }
                            }}
                        >

                            <TableCell>
                                <Box sx={{ display:'flex', alignItems:'center'}}>
                                    <Typography variant='body2'>{transaction.name}</Typography>
                                </Box>                               
                            </TableCell>
                            {isSmallScreen && (
                                <TableCell>
                                    <Typography variant='body2'>{transaction.position}</Typography>
                                </TableCell>
                            )}
                            <TableCell>
                                <Box sx={{ display:'flex', alignItems:'center'}}>
                                    <CircleIcon style={{ color: transaction.status === 'Active' ? green[500] : orange[500], fontSize: 'small' }} />
                                    <Typography variant='body2'>{transaction.status}</Typography>
                                </Box>
                            </TableCell>
                            {isSmallScreen && (<TableCell>
                                <Typography variant='body2'>{transaction.age}</Typography>
                            </TableCell>
                            )}
                            {isSmallScreen && (<TableCell>
                                <Typography variant='body2'>{transaction.startDate}</Typography>
                            </TableCell>
                            )}
                        </TableRow>
                    ))
                    }
                </TableBody>
            </Table>

        </TableContainer>




    );




}

















export default LatestTransactions;  //82
