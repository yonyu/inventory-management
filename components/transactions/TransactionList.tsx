"use client";

import React from "react";

import { useGetTransactionsQuery } from "@/lib/features/transactions/transactionsApiSlice";

const TransactionTable = () => {
  const {
    data: transactionData,
    error,
    isLoading: loading,
  } = useGetTransactionsQuery();

  let transactions: any = transactionData?.transactions || [];

  if (loading) {
    return (
      <p
        style={{
          marginTop: 30,
          textAlign: "center",
          color: "grey",
          fontSize: 20,
        }}
      >
        Loading transactions ...
      </p>
    );
  }

  if (error) {
    return (
      <p
        style={{
          fontSize: "18px",
          fontWeight: "bold",
          color: "#D32F2F", // Red color for error
          textAlign: "center",
          marginTop: "20px",
          padding: "10px",
          backgroundColor: "#FFEBEE", // Lighter red background
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        Error: error loading transactions!
      </p>
    );
  }

  return (
    <div style={{ padding: "10px", margin: "4px" }}>
      <h2
        style={{
          fontSize: "3rem",
          color: "0073e6", // a nice blue color
          marginBottom: "20px", // 1rem = 16px
          textAlign: "center",
          fontWeight: "bold",
          textShadow: "1px 1px 2px rgba(109, 71, 71, 0.2)", // add a subtle shadow
          padding: "10px",
          borderBottom: "2px solid #0073e6", // underline effect
          letterSpacing: "1px",
        }}
      >
        Your transactions
      </h2>

      {transactions.length === 0 ? (
        <p style={{ textAlign: "center", fontSize: "18px", color: "#999" }}>
          No transactions found
        </p>
      ) : (
        // Add reponsive container with horizontal scrollbar
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              backgroundColor: "#FFFFFF",
              borderRadius: "8px",
              color: "#000000",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "blue", color: "#FFFFFF" }}>
                <th
                  style={{
                    padding: "10px",
                    textAlign: "left",
                    fontSize: "16px",
                    whiteSpace: "nowrap",
                  }}
                >
                  S.No
                </th>
                <th
                  style={{
                    padding: "10px",
                    textAlign: "left",
                    fontSize: "16px",
                    whiteSpace: "nowrap",
                  }}
                >
                  ID
                </th>
                <th
                  style={{
                    padding: "10px",
                    textAlign: "left",
                    fontSize: "16px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Status
                </th>
                <th
                  style={{
                    padding: "10px",
                    textAlign: "left",
                    fontSize: "16px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Payment Method
                </th>
                <th
                  style={{
                    padding: "10px",
                    textAlign: "left",
                    fontSize: "16px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Payment Status
                </th>
                <th
                  style={{
                    padding: "10px",
                    textAlign: "left",
                    fontSize: "16px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Stripe Transaction ID
                </th>
                <th
                  style={{
                    padding: "10px",
                    textAlign: "left",
                    fontSize: "16px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Total Price
                </th>
                <th
                  style={{
                    padding: "10px",
                    textAlign: "left",
                    fontSize: "16px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Transaction Date
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(
                (
                  transaction: any,
                  index: number
                ) => (
                  <tr
                    key={transaction._id}
                    style={{
                      transition: "background-color 0.3s ease",
                      cursor: "pointer",
                    }}
                  >
                    <td
                      style={{
                        padding: "10px",
                        textAlign: "left",
                        fontSize: "16px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {index + 1}
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        textAlign: "left",
                        fontSize: "16px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {transaction._id}
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        textAlign: "left",
                        fontSize: "16px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {transaction.status}
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        textAlign: "left",
                        fontSize: "16px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {transaction.paymentMethod}
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        textAlign: "left",
                        fontSize: "16px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {transaction.paymentStatus}
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        textAlign: "left",
                        fontSize: "16px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {transaction.transactionId}
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        textAlign: "left",
                        fontSize: "16px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {transaction.totalPrice}
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        textAlign: "left",
                        fontSize: "16px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {new Date(transaction.createdAt).toLocaleString()}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TransactionTable;
