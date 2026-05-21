import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseUrl } from "../../utils/apiConfig";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: getBaseUrl(),
    credentials: "include", 
  }),
  
  tagTypes: ["Admins", "Users", "Articles"],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
    }),

    me: builder.query({
      query: () => "/auth/me",
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),

    getAllAdmins: builder.query({
      query: () => "/auth/all-admins",
      providesTags: ["Admins"],
    }),

    createAdmin: builder.mutation({
      query: (data) => ({
        url: "/auth/create-admin",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Admins"],
    }),

    deleteAdmin: builder.mutation({
      query: (id) => ({
        url: `/auth/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Admins"],
    }),

    toggleUploadPermission: builder.mutation({
      query: (id) => ({
        url: `/auth/toggle-upload/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Admins"],
    }),

    getAllUsers: builder.query({
      query: () => "/auth/users",
      providesTags: ["Users"],
    }),

    createUser: builder.mutation({
      query: (data) => ({
        url: "/auth/create-user",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/auth/user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),

    getAllArticlesAdmin: builder.query({
      query: () => "/auth/articles",
      providesTags: ["Articles"],
    }),

    deleteArticleAdmin: builder.mutation({
      query: (id) => ({
        url: `/auth/article/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Articles"],
    }),
  }),
});

export const {
  useLoginMutation,
  useMeQuery,
  useLogoutMutation,
  useGetAllAdminsQuery,
  useCreateAdminMutation,
  useDeleteAdminMutation,
  useToggleUploadPermissionMutation,
  useGetAllUsersQuery,
  useCreateUserMutation,
  useDeleteUserMutation,
  useGetAllArticlesAdminQuery,
  useDeleteArticleAdminMutation,
} = authApi;
