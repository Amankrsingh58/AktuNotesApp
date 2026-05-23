import axios from "axios";
import { Article, Comment } from "./types";

// ✅ Always use env variable — no dynamic window logic needed
export const getApiBaseUrl = (): string => {
  return process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api";
};

// ✅ Client-side axios instance
export const api = axios.create({
  baseURL: getApiBaseUrl(), // ✅ Set once, not on every request
  withCredentials: true,
});

// ✅ SSR fetch — with revalidation instead of no-store
export const getArticles = async (): Promise<Article[]> => {
  try {
    const res = await fetch(`${getApiBaseUrl()}/articles`, {
      next: { revalidate: 60 }, // ✅ Cache for 60s, not no-store
    });
    if (!res.ok) throw new Error("Failed to fetch articles");
    const data = await res.json();
    return Array.isArray(data) ? data : []; // ✅ Safety check
  } catch (error) {
    console.error("Error in getArticles:", error);
    return [];
  }
};

export const getArticleBySlug = async (
  slug: string,
  cookieHeader?: string
): Promise<Article | null> => {
  try {
    const headers: Record<string, string> = {};
    if (cookieHeader) headers["Cookie"] = cookieHeader;

    const res = await fetch(`${getApiBaseUrl()}/articles/${slug}`, {
      headers,
      next: { revalidate: 60 }, // ✅ Cache individual articles too
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Failed to fetch article: ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error(`Error fetching article (${slug}):`, error);
    return null;
  }
};

export const checkProfileStatus = async (): Promise<{
  hasProfile: boolean;
  profile?: any;
}> => {
  const res = await api.get("/articles/profile/status");
  return res.data;
};

export const updateProfile = async (profileData: any): Promise<any> => {
  const res = await api.post("/articles/profile", profileData);
  return res.data;
};

export const createArticle = async (articleData: any): Promise<Article> => {
  const res = await api.post("/articles", articleData);
  return res.data;
};

export const updateArticle = async (
  id: string,
  articleData: any
): Promise<Article> => {
  const res = await api.put(`/articles/${id}`, articleData);
  return res.data;
};

export const getUserArticles = async (): Promise<Article[]> => {
  const res = await api.get("/articles/user/articles");
  return Array.isArray(res.data) ? res.data : []; // ✅ Safety check
};

export const likeArticle = async (
  id: string
): Promise<{ isLiked: boolean; likes: string[] }> => {
  const res = await api.post(`/articles/${id}/like`);
  return res.data;
};

export const addComment = async (
  id: string,
  text: string
): Promise<Comment> => {
  const res = await api.post(`/articles/${id}/comments`, { text });
  return res.data;
};

export const deleteComment = async (
  articleId: string,
  commentId: string
): Promise<any> => {
  const res = await api.delete(`/articles/${articleId}/comments/${commentId}`);
  return res.data;
};

export const followUser = async (
  userId: string
): Promise<{
  isFollowing: boolean;
  following: string[];
  message: string;
}> => {
  const res = await api.post(`/articles/follow/${userId}`);
  return res.data;
};

export const deleteArticle = async (id: string): Promise<any> => {
  const res = await api.delete(`/articles/${id}`);
  return res.data;
};