"use client"

import { useState } from "react";

import {
    Box,
    Button,
    TextField,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Paper,
    Snackbar,
    Alert,
    Card,
    Switch,
    CardContent,
    IconButton,
} from "@mui/material";

import { styled } from "@mui/system";

import StarIcon from "@mui/icons-material/Star";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { color, motion } from "framer-motion";
import { FormControlLabel } from "@mui/material";
import { error } from "console";

interface PricingCardProps {
    title: string;
    price: string;
    features: string[];
    buttonLabel: string;
    icon: React.ReactNode;
    billingPeriod: string;
    handleCheckout: (billingPeriod: string, price: string) => void;
}

const StyledCard = styled(Card) (( { theme, variant }) => ({
    maxWidth: 500,
    backgroundColor: "#141414",

    color: "#ffffff",
    padding: theme.spacing(3),
    borderRadius: theme.spacing(1.5),
    position: "relative",
    borderColor: variant === 'elevation' ? "#0A84FF" : "#1E1E1E",
    transition: "background-color 0.3s color 0.3s",
    "&:hover": {
        backgroundColor: "blue",
        color: "#ffffff",
        //borderColor: "#0A84FF",
    },
    "& MuiTypography-root": {
        color: "#FFFFFF"

    },
    "& MuiButton-root": {
        color: "#FFFFFF"
    },
}));

const PriceText = styled(Typography)({
    fontSize: "30px",
    fontWeight: "bold",
});

const PlanTitle = styled(Typography)({
    fontSize: "22px",
    color: "#C7C7C7",
    display: "flex",
    alignItems: "center",
    gap: "8px",
});

const FeatureText = styled(Typography)({
    fontSize: "16px",
    color: "#A6A6A6",
});

const ButtonStyled = styled(Button)({
    backgroundColor: "#0A84FF", // blue
    color: "#ffffff",
    borderRadius: 20,
    marginTop: 16,
    padding: "10px 24px",
    "&:hover": {
        backgroundColor: "#0077E4",
    },
});


// Background and styling
const BackgroundBox = styled(Box)({
    backgroundImage: "url('/images/pos1.png')",
    backgroundSize: "100vw 100vh",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    position: "relative",
    padding: "4rem 2rem",
    textAlign: "center",
    color: "#FFFFFF",
    overflow: "hidden",
    minHeight: "100vh",
    width: "100vw",
});


const PricingCard: React.FC<PricingCardProps> = ({title, price, features, buttonLabel, icon, billingPeriod, handleCheckout}) => {
    return (
        <StyledCard>
            <CardContent>
                <PlanTitle variant="h6">
                    <IconButton size="small" sx={{
                        color: "yellow",
                    }}>{icon}</IconButton>
                    {title}
                </PlanTitle>
                <PriceText>{price}</PriceText>
                <Box mt={2}>
                    {
                        features.map((feature, index) => (
                            <FeatureText key={index}>{feature}</FeatureText>
                        ))
                    }
                </Box>
                <ButtonStyled onClick={() => handleCheckout(billingPeriod, price)}>
                    {buttonLabel}
                </ButtonStyled>
            </CardContent>
        </StyledCard>
    );
}


const BillingToggle = () => {

    const [isAnually, setIsAnually] = useState(false);

    const handleToggle = () => setIsAnually(!isAnually);

    const handleCheckout = async (billingPeriod:string, price: string) => {
        try {
            console.log("Checkout initiated");
            console.log("Billing Period: ", billingPeriod);
            console.log("Price: ", price);

            const numericPrice = parseFloat(price.replace(/[^0-9.]/g, ''));

            console.log("server url ", `${process.env.API}/user/billing-toggle`);
            
            const response = await fetch(`${process.env.API}/user/billing-toggle`,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    billingPeriod,
                    price: isAnually ? numericPrice * 10 : numericPrice,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log(data);
            
            if (data?.err) {
                console.log("Error occurred when checking out: ", data?.err);
                return;
            } else {
                window.location.href = data.id;
            }
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    return (
        <BackgroundBox>
            <Typography variant="h4" sx={{ mb: 4 }}>
                Pricing Plans
            </Typography>

            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    minHeight: "100vh",
                    padding: 8,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        color: "#FFFFFF",
                        m: 11,
                    }}                
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Box
                            sx={{
                                display: "inline-block",
                                padding: "0.3rem 1rem",
                                borderRadius: "20px",
                                background: "blue",
                                color: "#FFFFFF",
                                fontSize: "1rem",
                                fontWeight: "bold",
                                textAlign: "center",
                                textTransform: "uppercase",
                                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.15)",
                                transition: "background 0.3s ease",
                                "&:hover": {
                                    backgroundColor: "blue", //"#0077E4",
                                    boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.25)",
                                },
                            }}                         
                        >
                            <Typography variant="body1">Bill Monthly</Typography>
                        </Box>
                    </motion.div>

                    <Switch
                        checked={isAnually}
                        onChange={handleToggle}
                        color="warning" 
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Box
                            sx={{
                                display: "inline-block",
                                padding: "0.3rem 1rem",
                                borderRadius: "20px",
                                background: "blue",
                                color: "#FFFFFF",
                                fontSize: "1rem",
                                fontWeight: "bold",
                                textAlign: "center",
                                textTransform: "uppercase",
                                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.15)",
                                transition: "background 0.3s ease",
                                "&:hover": {
                                    backgroundColor: "blue", //"#0077E4",
                                    boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.25)",
                                },
                            }}                               
                        >
                            <Typography variant="body1">Annualy</Typography>
                        </Box>
                    </motion.div>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: 3,
                    }}
                >
                    <PricingCard
                        title={"purchase 1 report"}
                        price={isAnually ? "$290 USD/Year" : "$29 USD"}
                        features={[
                            "Unlimited Reports",
                            "Unlimited Customers",
                            "Unlimited Products",
                        ]}
                        buttonLabel="Purchase"
                        icon={<AssessmentIcon />}
                        billingPeriod={isAnually ? "Year" : "Month"}
                        handleCheckout={handleCheckout}
                    />       

                    <PricingCard
                        title="Starter Plan"
                        price={isAnually ? "$190 USD/Year" : "$19 USD"}
                        features={[
                            "Unlimited Reports",
                            "Unlimited Customers",
                            "Unlimited Products",
                        ]}
                        buttonLabel="Get Started"
                        icon={<FlashOnIcon />}
                        billingPeriod={isAnually ? "Year" : "Month"}
                        handleCheckout={handleCheckout}
                    />

                    <PricingCard
                        title="Agency Plan"
                        price={isAnually ? "$990 USD/Year" : "$99 USD"}
                        features={
                            isAnually
                                ? [
                                    "Custom dashboard with analytics",
                                    "Priority Customer support",
                                    "Advanced inventory categorization",
                                ]
                                : [
                                    "Basic inventory tools",
                                    "Real time stock updates",
                                    "User adn admin roles",
                                ]
                        }
                        buttonLabel="Get Started"
                        icon={<StarIcon />}
                        billingPeriod={isAnually ? "Year" : "Month"}
                        handleCheckout={handleCheckout}
                    />                                 
                </Box>
            </Box>
        </BackgroundBox>
    );
};

export default BillingToggle;

// 185