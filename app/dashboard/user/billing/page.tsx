"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CircularProgress from "@mui/material/CircularProgress";

//import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { useGetSubscriptionsQuery } from "@/lib/features/billing/subscriptionsApiSlice";


const SubscriptionTable = () => {

    //const dispatch = useAppDispatch();

    const { data: subscriptionData, error, isLoading: loading } = useGetSubscriptionsQuery();

    const [remainingDays, setRemainingDays] = useState<number>(0);

    let subscription: any = subscriptionData;
    console.log("Subscription", subscription);

    useEffect(() => {
        if (subscription?.endDate) {
            const today = new Date();
            const endDate = new Date(subscription.endDate);
            const timeDifference = endDate.getTime() - today.getTime();
            const daysRemaining = Math.ceil(timeDifference / (1000 * 3600 * 24));
            setRemainingDays(daysRemaining);
        }
    }, [subscription]);

    if (error) {
        return (
            <p
                style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: "#D32F2F", // Red color for error
                    textAlign: "center",
                    marginTop: '20px',
                    padding: '10px',
                    backgroundColor: '#FFEBEE', // Lighter red background
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
            >
                Error loading subscription!
            </p>
        );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div
          style={{
            padding: "20px",
            background: "blue",
            borderRadius: "12px",
            maxWidth: "500px",
            margin: "0 auto",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
          }}
        >
          <div
            style={{
              backgroundColor: "#212121",
              borderRadius: "8px",
              padding: "20px",
            }}
          >
            {loading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "300px",
                  width: "300px",
                  padding: "20px",
                }}
              >
                <CircularProgress color="secondary" size={50} />
              </div>
            ) : (
              <>
                {subscription && (
                  <>
                    <motion.p
                      style={{
                        marginBottom: "10px",
                        fontSize: "20px",
                        color: "white",
                        fontWeight: "bold",
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <strong>Plan: </strong> {subscription?.plan || "Premium"}
                    </motion.p>

                    <motion.p
                      style={{
                        marginBottom: "10px",
                        fontSize: "20px",
                        color: "white",
                        fontWeight: "bold",
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <strong>Start Date: </strong>{" "}
                      {new Date(subscription?.startDate).toLocaleString() || ""}
                    </motion.p>

                    <motion.p
                      style={{
                        marginBottom: "10px",
                        fontSize: "20px",
                        color: "white",
                        fontWeight: "bold",
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <strong>End Date: </strong>{" "}
                      {new Date(subscription?.endDate).toLocaleString() || ""}
                    </motion.p>

                    <motion.p
                      style={{
                        marginBottom: "10px",
                        fontSize: "20px",
                        color: "white",
                        fontWeight: "bold",
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      <strong>Price: </strong> ${subscription?.price || ""}{" "}
                      /year
                    </motion.p>

                    {remainingDays !== null && (
                      <motion.p
                        style={{
                          marginTop: "20px",
                          fontSize: "26px",
                          color: "#D32F2F",
                          fontWeight: "bold",
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                      >
                        <strong>
                          Subscription expired in {remainingDays} days
                        </strong>
                      </motion.p>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </motion.div>
    );
}

export default SubscriptionTable;
