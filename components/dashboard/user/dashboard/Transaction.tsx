"use client"


// component/LatestTransaction.ts
import React, { useState, useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import { green, orange } from '@mui/material/colors';
import CircleIcon from '@mui/icons-material/Circle';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/system';//

const transactions = [
    {name: "Charles Casey", position: "Web Developer", status: "Active", age: "23", startDate: "2021/04/04", salory: "$42,450"},
    {name: "Alex Adams", position: "Python Developer", status: "Deactive", age: "28", startDate: "2020/05/31", salory: "$25,060"},
    {name: "Prezy Kelsey", position: "Senior Javascript Developer", status: "Active", age: "35", startDate: "2008/07/30", salory: "$59,350"},
    {name: "Ruhi Fancher", position: "React Developer", status: "Active", age: "25", startDate: "2004/09/18", salory: "$22,900"}
];



const LatestTransactions = () => {  //18
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <TableContainer component={Paper} sx ={{ overflowX: 'auto', mb: 2 }}>
            <Table sx={{ minWidth: 250 }}>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        {!isSmallScreen && (
                        <TableCell>Position</TableCell>)}
                        <TableCell>Status</TableCell>
                        {!isSmallScreen && (
                        <TableCell>Age</TableCell>)}
                        {!isSmallScreen && (
                        <TableCell>Start date</TableCell>)}
                        <TableCell>Salary</TableCell>
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
                            {!isSmallScreen && (
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
                            {!isSmallScreen && (<TableCell>
                                <Typography variant='body2'>{transaction.age}</Typography>
                            </TableCell>
                            )}
                            {!isSmallScreen && (<TableCell>
                                <Typography variant='body2'>{transaction.startDate}</Typography>
                            </TableCell>
                            )}
                            <TableCell>
                                <Typography variant='body2'>{transaction.salory}</Typography>
                            </TableCell>
                        </TableRow>
                    ))
                    }
                </TableBody>
            </Table>

        </TableContainer>
    );
}

export default LatestTransactions;
