import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseUrl } from "../../utils/apiConfig";

export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: getBaseUrl("payment"),
  }),
  endpoints: (builder) => ({
    initiatePayment: builder.mutation({
      query: (data) => ({
        url: "/initiate",
        method: "POST",
        body: data,
      }),
    }),
    checkPaymentStatus: builder.query({
      query: (merchantTransactionId) => `/status/${merchantTransactionId}`,
    }),
  }),
});

export const { useInitiatePaymentMutation, useCheckPaymentStatusQuery } = paymentApi;
