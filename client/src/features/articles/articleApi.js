import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseUrl } from "../../utils/apiConfig";

export const articleApi = createApi({
  reducerPath: "articleApi",
  baseQuery: fetchBaseQuery({
    baseUrl: getBaseUrl("articles"),
    credentials: 'include',
    prepareHeaders: (headers) => {
      return headers;
    },
  }),
  tagTypes: ["Article", "Profile"],
  endpoints: (builder) => ({
    getArticles: builder.query({
      query: () => "/",
      providesTags: ["Article"],
    }),
    getArticleBySlug: builder.query({
      query: (slug) => `/${slug}`,
      providesTags: (result, error, slug) => [{ type: "Article", id: slug }],
    }),
    checkProfileStatus: builder.query({
      query: () => "/profile/status",
      providesTags: ["Profile"],
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/profile",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Profile"],
    }),
    createArticle: builder.mutation({
      query: (data) => ({
        url: "/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Article"],
    }),
    getUserArticles: builder.query({
      query: () => "/user/articles",
      providesTags: ["Article"],
    }),
    likeArticle: builder.mutation({
      query: (id) => ({
        url: `/${id}/like`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Article" }],
    }),
    addComment: builder.mutation({
      query: ({ id, text }) => ({
        url: `/${id}/comments`,
        method: "POST",
        body: { text },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Article" }],
    }),
    updateArticle: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Article" }],
    }),
    followUser: builder.mutation({
      query: (userId) => ({
        url: `/follow/${userId}`,
        method: "POST",
      }),
      invalidatesTags: ["Profile", "Article"],
    }),
    deleteArticle: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Article"],
    }),
  }),
});

export const {
  useGetArticlesQuery,
  useGetArticleBySlugQuery,
  useCheckProfileStatusQuery,
  useUpdateProfileMutation,
  useCreateArticleMutation,
  useUpdateArticleMutation,
  useGetUserArticlesQuery,
  useLikeArticleMutation,
  useAddCommentMutation,
  useFollowUserMutation,
  useDeleteArticleMutation,
} = articleApi;

