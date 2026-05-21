import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseUrl } from "../../utils/apiConfig";

export const pyqStats = createApi({
    reducerPath: "pyqStats",

   baseQuery: fetchBaseQuery({
    baseUrl: getBaseUrl(),
    credentials: "include",
  }),

  tagTypes: ["DownloadCount", "DashboardStats", "ActivityLogs"],
  endpoints: (builder) => ({
    getDownloadCountPyqs: builder.query({
      query: () => "/dashboard/getpyqdownloadcount",
      providesTags: ["DownloadCount"],
    }),

    getDashboardStats: builder.query({
      query: () => "/dashboard/stats",
      providesTags: ["DashboardStats"],
    }),

    getActivityLogs: builder.query({
      query: () => "/dashboard/logs",
      providesTags: ["ActivityLogs"],
    }),

    updateDounloadCountPyq: builder.mutation({
      query: ({ year }) => ({
        url: `/dashboard/updatepyqdownloadcount`,  
        method: "PUT",
        body: { year },
      }),
      invalidatesTags: ["DownloadCount", "DashboardStats"],
    }),

    updateNotesDownloadCount: builder.mutation({
      query: ({ year }) => ({
        url: `/dashboard/updatenotesdownloadcount`,  
        method: "PUT",
        body: { year },
      }),
      invalidatesTags: ["DownloadCount", "DashboardStats"],
    }),
  }),
});

export const {
  useGetDownloadCountPyqsQuery,
  useUpdateDounloadCountPyqMutation,
  useUpdateNotesDownloadCountMutation,
  useGetDashboardStatsQuery,
  useGetActivityLogsQuery,
} = pyqStats;