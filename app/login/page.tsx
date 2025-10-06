"use client"

import { Button, TextField, Link, Typography, Box, Snackbar, Alert, IconButton, InputAdornment } from '@mui/material';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {useState} from 'react';
import { signIn, useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';


const LoginPage = () => {

    const { data } = useSession();
    
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [error, setError] = useState('');
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }
        try 
        {
            const result = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });

            console.log("response", result);

            if (result?.error) {
                setSnackbar({
                    open: true,
                    message: result.error || 'Invalid credentials',
                    severity: 'error'
                });
                return;
            } else {
                setSnackbar({
                    open: true,
                    message: 'Login successful',
                    severity: 'success'
                });
                if (data) {
                    router.push(`/dashboard/${data?.user?.role}`)
                }
            }

        } catch (error) {
            console.log(error);
            setSnackbar({
                open: true,
                message: 'An error occurred please try again!',
                severity: 'error'
            });
        }
    }

    const handleCloseSnackbar = () => {
        setSnackbar({
            ...snackbar,
            open: false,
        });
    }

    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };
    
    return (
        <Box
            sx={{
                backgroundImage: 'url(/images/pos.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                height: '100vh',
                width: '100vw',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                px: 2,
                opacity: 0.9,
            }}
        >
            <Box component="form"

                sx  = {{

                    p: 4,
                    backgroundColor: 'black',
                    borderRadius: 2,
                    boxShadow: 3,
                    width: '100%',
                    maxWidth: '400px',
                    textAlign: 'center',

                    opacity: 0.9,
                    '& .MuiTextField-root': {
                        mb: 2,
                    },
                }}
                
                onSubmit={handleSubmit}
            >
                <Typography variant="h4" gutterBottom>
                    Login
                </Typography>

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
                    href="/register"
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
                        Don't have an account? Sign up
                    </Typography>
                </Link>  
                 
            </Box>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                //onClose={() => setSnackbar({ ...snackbar, open: false })}
                onClose={handleCloseSnackbar}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    security={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    { snackbar.message }
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default LoginPage;