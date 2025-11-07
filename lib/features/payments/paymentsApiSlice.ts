import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface Payment {
    date: Date;
    invoice: string | { _id: string; invoiceNumber: string };
    customer: string | { _id: string; name: string };
    status: string;
    paidAmount: number;
    dueAmount: number;
    totalAmount: number;
    discountAmount: number;
}

interface PaymentsApiResponse {
    payments: Payment[];
}

export interface PaymentsSliceState {
    payments: Payment[];
    status: "idle" | "loading" | "failed" | "fulfilled";
}

const initialState: PaymentsSliceState = {
    payments: [],
    status: "idle",
};

export const paymentsApiSlice = createApi({
    reducerPath: 'paymentsApi',
    baseQuery: fetchBaseQuery({ baseUrl: "/api/user/payment" }),
    tagTypes: ['Payments'],
    endpoints: (builder) => ({
        getPayments: builder.query<PaymentsApiResponse, void>({
            query: () => '',
            providesTags: ['Payments'],
        }),
        getPaymentById: builder.query<{ payment: Payment }, string>({
            query: (id) => `/${id}`,
            providesTags: ['Payments'],
        }),
        getPaymentsByInvoice: builder.query<PaymentsApiResponse, string>({
            query: (invoiceId) => `?invoiceId=${invoiceId}`,
            providesTags: ['Payments'],
        }),
        addPayment: builder.mutation<Payment, Omit<Payment, 'status'>>({
            query: (newPayment) => ({
                url: '',
                method: 'POST',
                body: newPayment,
            }),
            invalidatesTags: [{ type: 'Payments' }],
        }),
        deletePayment: builder.mutation<{ deletingPayment: Payment }, string>({
            query: (id) => ({
                url: `/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Payments' }],
        }),
    }),
});

export const { useGetPaymentsQuery, useGetPaymentByIdQuery, useGetPaymentsByInvoiceQuery, useAddPaymentMutation, useDeletePaymentMutation } = paymentsApiSlice;