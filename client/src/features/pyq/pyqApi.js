import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseUrl } from "../../utils/apiConfig";

export const pyqApi = createApi({
  reducerPath: "pyqApi",
    baseQuery: fetchBaseQuery({
      baseUrl: getBaseUrl(),
      credentials: "include", 
    }),
  
  tagTypes: ["PYQ"],
  endpoints: (builder) => ({
    
    getPyqs: builder.query({
      query: () => "/getpyqs",
      providesTags: ["PYQ"],
    }),

    getDashboardPyqs: builder.query({
      query: () => "/getdashboardpyqs",
      providesTags: ["PYQ"],
    }),

    createPyq: builder.mutation({
      query: (data) => ({
        url: "/createpyqs",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["PYQ"],
    }),

    updatePyq: builder.mutation({
      query: ({ id, data }) => ({
        url: `/updatepyqs/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["PYQ"],
    }),

    deletePyq: builder.mutation({
      query: (id) => ({
        url: `/deletepyqs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PYQ"],
    }),
  }),
});

export const {
  useGetPyqsQuery,
  useGetDashboardPyqsQuery,
  useCreatePyqMutation,
  useUpdatePyqMutation,
  useDeletePyqMutation,
} = pyqApi;
