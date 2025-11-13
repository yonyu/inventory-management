"use client"

import { useRouter } from "next/navigation";


import { Box, Button, Grid, Typography, Card, CardActionArea, CardContent, CircularProgress } from "@mui/material";
import { styled } from "@mui/system";
import { Dashboard, Inventory, Add, ListAlt, Assessment, People, Settings, ShoppingCart, BarChart } from "@mui/icons-material";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";


// Background and styling
const BackgroundBox = styled(Box) ({
    backgroundImage: 'url(/images/pos1.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    position: 'relative',
    padding: '4rem 2rem',
    textAlign: 'center',
    color: '#fff',
    overflow: 'hidden',
});

const Overlay = styled(Box) ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 1,
});

const ContentBox = styled(Box) ({
    position: 'relative',
    zIndex: 2,
});


    


const Home = () => {
    const router = useRouter();
    const [isAnnually, setIsAnnually] = useState(false);

    const [data, setData] = useState<{
        categoryCount?: number;
        customerCount?: number;
        invoiceCount?: number;
        invoiceDetailsCount?: number;
        paymentCount?: number;
        paymentDetailsCount?: number;
        productCount?: number;
        orderCount?: number;
        subscriptionCount?: number;
        supplierCount?: number;
        unitCount?: number;
    }>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.API}/admin/home`);
                const jsonData = await response.json();
                setData(jsonData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const pages = [
        { name : 'Categories', icon: <Dashboard />, path: '/dashboard', count: data?.categoryCount },
        { name : 'Customers', icon: <Inventory />, path: '/products', count: data?.customerCount },
        { name : 'Invoices', icon: <Add />, path: '/add-product', count: data?.invoiceCount },
        { name : 'Invoice Details', icon: <ListAlt />, path: '/inventory', count: data?.invoiceDetailsCount },
        { name : 'Payments', icon: <ShoppingCart />, path: '/orders', count: data?.paymentCount },
        { name : 'Payment Details', icon: <Assessment />, path: '/reports', count: data?.paymentDetailsCount },
        { name : 'Products', icon: <People />, path: '/customers', count: data?.productCount },
        { name : 'Purchase', icon: <Settings />, path: '/settings', count: data?.orderCount },
        { name : 'Subscription', icon: <BarChart />, path: '/analytics', count: data?.subscriptionCount || 0 },

        { name : 'Suppliers', icon: <People />, path: '/settings', count: data?.supplierCount },
        { name : 'Units', icon: <Settings />, path: '/analytics', count: data?.unitCount },
    ];

    if (loading) {
        return (
            <Box
                sx={{
                    display:'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (!data) {
        return (
            <Box
                sx={{
                    display:'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',

                }}
            >
                <Typography 
                    variant="h6"
                    sx={{
                        textAlign: 'center',
                        mt: '2rem',
                    }}
                >
                    No data available
                </Typography>
            </Box>
        );
    }

    return (
        <BackgroundBox>
            <Overlay />
            <ContentBox>
                { /* Hero Section */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <Box sx={{ textAlign: 'center', mb: 5 }}>
                        { /* Heading */}                    
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1 }}
                        >
                            <Typography
                                variant="h3"
                                sx={{
                                    fontWeight: 'bold',
                                    mb: 2,
                                    background: 'linear-gradient(90deg, #ff8a00, #ffeb3b)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    //color: 'white',
                                    animation: 'gradient 5s ease infinite',
                                }}
                            >
                                Welcome to the Product Inventory System
                            </Typography>


                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                            >
                                <Box sx={{ mb: 1, }}>
                                    <motion.div 
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.2, duration: 0.5 }}
                                    >
                                        <Typography>
                                            Manage your products, inventory, and orders efficiently with our intuitive dashboard.
                                        </Typography>
                                    </motion.div>


                                </Box>
                            </motion.div>


 
                        </motion.div>
                    </Box>
                </motion.div>


                {/*Rreponsive Navigation Cards */ }
                <Grid container spacing={4} justifyContent='center'>
                    {pages && pages.map((page, index) => (
                        <Grid 
                            key={index} 
                            sx={{ 
                                xs:12, 
                                sm:6, 
                                md:4, 
                            }}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0, }}
                                animate={{ scale: 1, opacity: 1, }}
                                transition={{ delay: index * 0.2, duration: 0.5 }}
                            >
                                <Card
                                    sx={{
                                        minHeight: 180,
                                        boxShadow: 5,
                                        borderRadius: 2,
                                        backgroundColor: '#000',
                                        color: '#fff',
                                        transition: 'transform 0.3s, background-color 0.3s',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                            backgroundColor: 'blue',
                                            color: '#fff',
                                        },
                                    }}
                                >
                                    <CardActionArea>
                                        <CardContent sx={{ textAlign: 'center', padding: '1rem' }}>
                                            <Box sx={{ fontSize: 98, mb: 1, color: 'greenyellow'}}>{page.icon}</Box>
                                            <Box sx={{ fontSize: 30, mb: 1, color: 'greenyellow'}}>{page.count}</Box>
                                            <Typography variant="h5" component='div' sx={{ mb: 1, fontWeight: 'bold' }} gutterBottom>
                                                {page.name}
                                            </Typography>
                                            <Typography variant="body2" sx={{ mb: 1, color: 'inherit' }}>
                                                {`Go to ${page.path} section`}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>


            </ContentBox>
        </BackgroundBox>
    );
}

export default Home;