import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseUrl } from "../../utils/apiConfig";

export const notesApi = createApi({
  reducerPath: "notesApi",
    baseQuery: fetchBaseQuery({
      baseUrl: getBaseUrl("notes"),
      credentials: "include", 
    }),
  
  tagTypes: ["Notes"],
  endpoints: (builder) => ({

    getNotes: builder.query({
      query: () => "/getnotes",
      providesTags: ["Notes"],
    }),

    getDashboardNotes: builder.query({
      query: () => "/getnotes",
      providesTags: ["Notes"],
    }),

    createNotes: builder.mutation({
      query: (data) => ({
        url: "/createnotes",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Notes"],
    }),

    updateNotes: builder.mutation({
      query: ({ id, data }) => ({
        url: `/updatenotes/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Notes"],
    }),

    deleteNotes: builder.mutation({
      query: (id) => ({
        url: `/deletenotes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notes"],
    }),
  }),
});

export const {
  useGetNotesQuery,
  useGetDashboardNotesQuery,
  useCreateNotesMutation,
  useUpdateNotesMutation,
  useDeleteNotesMutation,
} = notesApi;