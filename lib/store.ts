//"use client";

import type { Action, ThunkAction } from "@reduxjs/toolkit";
import { combineSlices, configureStore } from "@reduxjs/toolkit";
import { counterSlice } from "./features/counter/counterSlice";
import { quotesApiSlice } from "./features/quotes/quotesApiSlice";
import { categoriesApiSlice } from "./features/categories/categoriesApiSlice";
import { unitsApiSlice } from "./features/units/unitsApiSlice";
import { suppliersApiSlice } from "./features/suppliers/suppliersApiSlice";
import { customersApiSlice } from "./features/customers/customersApiSlice";
import { productsApiSlice } from "./features/products/productsApiSlice";
import { ordersApiSlice } from "./features/orders/ordersApiSlice";
import { invoicesApiSlice } from "./features/invoices/invoicesApiSlice";
import { paymentsApiSlice } from "./features/payments/paymentsApiSlice";
import { invoiceDetailsApiSlice } from "./features/invoice-details/invoiceDetailsApiSlice";
import { invoicesApproveApiSlice } from "./features/invoice-approve/invoicesApproveApiSlice";
import { subscriptionsApiSlice } from "./features/subscriptions/transactionsApiSlice";

// `combineSlices` automatically combines the reducers using
// their `reducerPath`s, therefore we no longer need to call `combineReducers`.
const rootReducer = combineSlices(
  counterSlice, 
  quotesApiSlice, 
  categoriesApiSlice,
  unitsApiSlice,
  suppliersApiSlice,
  customersApiSlice,
  productsApiSlice,
  ordersApiSlice,
  invoicesApiSlice,
  paymentsApiSlice,
  invoiceDetailsApiSlice,
  invoicesApproveApiSlice,
  subscriptionsApiSlice,  
);

// Infer the `RootState` type from the root reducer
export type RootState = ReturnType<typeof rootReducer>;

// `makeStore` encapsulates the store configuration to allow
// creating unique store instances, which is particularly important for
// server-side rendering (SSR) scenarios. In SSR, separate store instances
// are needed for each request to prevent cross-request state pollution.
export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
    // Adding the api middleware enables caching, invalidation, polling,
    // and other useful features of `rtk-query`.
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware().concat(
        quotesApiSlice.middleware,
        categoriesApiSlice.middleware,
        unitsApiSlice.middleware,
        suppliersApiSlice.middleware,
        customersApiSlice.middleware,
        productsApiSlice.middleware,
        ordersApiSlice.middleware,
        invoicesApiSlice.middleware,
        paymentsApiSlice.middleware,
        invoiceDetailsApiSlice.middleware,
        invoicesApproveApiSlice.middleware,
        subscriptionsApiSlice.middleware,
      );
    },
  });
};

// Infer the return type of `makeStore`
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = AppStore["dispatch"];
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;
