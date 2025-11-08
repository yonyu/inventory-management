import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface InvoiceDetail {
    _id?: string;
    invoiceId: string;
    productId: string;
    quantity: number;
    unitPrice: number;
    total: number;
}

interface InvoiceDetailsApiResponse {
    invoiceDetails: InvoiceDetail[];
}

export const invoiceDetailsApiSlice = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: "/api/user/invoice-detail" }),
    reducerPath: "invoiceDetailsApi",
    tagTypes: ["InvoiceDetails"],
    endpoints: (build) => ({
        getInvoiceDetails: build.query<InvoiceDetailsApiResponse, void>({
            query: () => '',
            providesTags: ['InvoiceDetails'],
        }),
        getInvoiceDetailsByInvoice: build.query<InvoiceDetailsApiResponse, string>({
            query: (invoiceId) => `?invoiceId=${invoiceId}`,
            providesTags: ['InvoiceDetails'],
        }),
        addInvoiceDetail: build.mutation<InvoiceDetail, any>({
            query: (newDetail) => ({
                url: '',
                method: 'POST',
                body: newDetail,
            }),
            invalidatesTags: ['InvoiceDetails'],
        }),
        deleteInvoiceDetail: build.mutation<{ deletingInvoiceDetail: InvoiceDetail }, string>({
            query: (id) => ({
                url: `/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['InvoiceDetails'],
        }),
        getInvoiceWithDetails: build.query<any, string>({
            query: (invoiceId) => `/full/${invoiceId}`,
            providesTags: ['InvoiceDetails'],
        }),
    }),
});

export const { 
    useGetInvoiceDetailsQuery, 
    useGetInvoiceDetailsByInvoiceQuery, 
    useAddInvoiceDetailMutation, 
    useDeleteInvoiceDetailMutation,
    useGetInvoiceWithDetailsQuery
} = invoiceDetailsApiSlice;
