"use client"

import { Container, TextField, Button, Link, Typography, Box, Snackbar, Alert, IconButton, InputAdornment } from '@mui/material';
import Grid from '@mui/material/Grid'; // https://mui.com/material-ui/migration/upgrade-to-grid-v2/
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

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


    const handleRegister = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!name || !phone || !email || !password) {
            setSnackbarMessage('Please fill in all fields.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            return;
        }
        //console.log({name, phone, email, password});
    }

    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    }

    
    return (
        <>
            <Container maxWidth={false}>
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
                            onSubmit={handleRegister}
                        >
                            <Typography variant="h4" gutterBottom>
                                Register
                            </Typography>

                            <TextField
                                id="name"
                                label="Name"
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                sx={{
                                    input: {
                                        color: 'white',
                                        backgroundColor: 'black',
                                        '&:-webkit-autofill': {
                                            WebkitBoxShadow: '0 0 0 1000px black inset',
                                            WebkitTextFillColor: 'white',
                                        },
                                        '&:-webkit-autofill:hover': {
                                            WebkitBoxShadow: '0 0 0 1000px black inset',
                                            WebkitTextFillColor: 'white',
                                        },
                                        '&:-webkit-autofill:focus': {
                                            WebkitBoxShadow: '0 0 0 1000px black inset',
                                            WebkitTextFillColor: 'white',
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: 'white',
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: 'white',
                                    },
                                    '& .MuiOutlinedInput-root': {
                                        color: 'white',
                                        '& fieldset': {
                                            borderColor: 'blue',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: 'blue',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#1976d2',
                                            borderWidth: '2px',
                                        },
                                    },
                                }}
                            />

                            <TextField
                                id="phone"
                                label="Phone"
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                sx={{
                                    input: {
                                        color: 'white',
                                        backgroundColor: 'black',
                                        '&:-webkit-autofill': {
                                            WebkitBoxShadow: '0 0 0 1000px black inset',
                                            WebkitTextFillColor: 'white',
                                        },
                                        '&:-webkit-autofill:hover': {
                                            WebkitBoxShadow: '0 0 0 1000px black inset',
                                            WebkitTextFillColor: 'white',
                                        },
                                        '&:-webkit-autofill:focus': {
                                            WebkitBoxShadow: '0 0 0 1000px black inset',
                                            WebkitTextFillColor: 'white',
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: 'white',
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: 'white',
                                    },
                                    '& .MuiOutlinedInput-root': {
                                        color: 'white',
                                        '& fieldset': {
                                            borderColor: 'blue',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: 'blue',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#1976d2',
                                            borderWidth: '2px',
                                        },
                                    },
                                }}
                            />

                            <TextField
                                id="email"
                                label="Email"
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                sx={{
                                    input: {
                                        color: 'white',
                                        backgroundColor: 'black',
                                        '&:-webkit-autofill': {
                                            WebkitBoxShadow: '0 0 0 1000px black inset',
                                            WebkitTextFillColor: 'white',
                                        },
                                        '&:-webkit-autofill:hover': {
                                            WebkitBoxShadow: '0 0 0 1000px black inset',
                                            WebkitTextFillColor: 'white',
                                        },
                                        '&:-webkit-autofill:focus': {
                                            WebkitBoxShadow: '0 0 0 1000px black inset',
                                            WebkitTextFillColor: 'white',
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: 'white',
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: 'white',
                                    },
                                    '& .MuiOutlinedInput-root': {
                                        color: 'white',
                                        '& fieldset': {
                                            borderColor: 'blue',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: 'blue',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#1976d2',
                                            borderWidth: '2px',
                                        },
                                    },
                                }}
                            />

                            <TextField
                                id="password"
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                sx={{
                                    input: {
                                        color: 'white',
                                        backgroundColor: 'black',
                                        '&:-webkit-autofill': {
                                            WebkitBoxShadow: '0 0 0 1000px black inset',
                                            WebkitTextFillColor: 'white',
                                        },
                                        '&:-webkit-autofill:hover': {
                                            WebkitBoxShadow: '0 0 0 1000px black inset',
                                            WebkitTextFillColor: 'white',
                                        },
                                        '&:-webkit-autofill:focus': {
                                            WebkitBoxShadow: '0 0 0 1000px black inset',
                                            WebkitTextFillColor: 'white',
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: 'white',
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: 'white',
                                    },
                                    '& .MuiOutlinedInput-root': {
                                        color: 'white',
                                        '& fieldset': {
                                            borderColor: 'blue',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: 'blue',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#1976d2',
                                            borderWidth: '2px',
                                        },
                                    },
                                }}
                                slotProps={{
                                    inputLabel: {
                                        style: {
                                            color: 'white',
                                        },
                                    },
                                    input: {
                                        style: {
                                            color: 'white',
                                            borderColor: 'blue'
                                        },
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    sx={{color: 'white'}}
                                                    onClick={ togglePasswordVisibility }

                                                >
                                                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    },         
                                }}                                    
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                sx={{
                                    backgroundColor: 'darkblue',
                                    '&:hover': {
                                        backgroundColor: 'blue',
                                    },
                                    mt: 2,
                                    width: '100%'
                                }}
                            >
                                Submit
                            </Button>

                            <Link
                                href="/login"
                                variant="body2"
                                sx={{
                                    mt: 2,
                                    color: 'white',
                                    '&:hover': {
                                        color: '#fff',
                                    },
                                }}
                            >
                                <Typography variant="body2" sx={{mt: 2}}>
                                    Already have an account? Login
                                </Typography>
                            </Link>                         
                        </Box>

                    </Grid>

                    <Grid
                        size={{ xs: 12, md: 6}}

                    >
                        <Box
                            sx={{
                                width: '100%',
                                height: '100vh',
                                display: { xs: 'none', md: 'block' },
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Box
                                component="img"
                                src="images/pos.png"
                                alt="register image"
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    display: { xs: 'none', md: 'block' },
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}

                            />
                        </Box>
                    </Grid>


                </Grid>


                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                >

                    <Alert 
                        onClose={handleCloseSnackbar}
                        severity={snackbarSeverity}
                        sx={{ width: '100%' }}>
                        { snackbarMessage }
                    </Alert>
                </Snackbar>


            </Container>
        </>
    )
}

export default RegisterPage;