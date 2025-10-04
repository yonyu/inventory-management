"use client"

import { Container, TextField, Button, Link, Typography, Box, Snackbar, Alert, IconButton, InputAdornment } from '@mui/material';
import Grid from '@mui/material/Grid'; // https://mui.com/material-ui/migration/upgrade-to-grid-v2/

import {useState} from 'react';


const RegisterPage = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');

    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    return (
        <>
            <Container maxWidth="xl">
                <Grid container spacing={2} alignItems="center" justifyContent="center"
                    sx={{minHeight:"100vh"}}
                >
                    <Grid size={{ xs: 12, md: 6}}>
                        <Box component="form"
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                            sx={{
                                p: 3
                            }}
                        >
                            <Typography variant="h4" gutterBottom>
                                Register
                            </Typography>


                        </Box>

                    </Grid>

                </Grid>
            </Container>
        </>
    )
}

export default RegisterPage;