import axios from "axios";
import { Article, Comment } from "./types";

export const getApiBaseUrl = (): string => {
  if (typeof window === "undefined") {
    return process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api";
  }
  const hostname = window.location.hostname;
  const isLocal = hostname === "localhost" || 
                  hostname === "127.0.0.1" || 
                  hostname.startsWith("192.168.") || 
                  hostname.startsWith("10.") || 
                  hostname.startsWith("172.");
  
  return isLocal 
    ? `http://${hostname}:5000/api` 
    : "https://aktunotesapp.onrender.com/api";
};

// Create client axios instance for client-side fetches (with credentials for cookies)
export const api = axios.create({
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  config.baseURL = getApiBaseUrl();
  return config;
});

// SSR / Server Component calls (running on the Node server during SSR/SSG/ISR)
export const getArticles = async (): Promise<Article[]> => {
  try {
    const res = await fetch(`${getApiBaseUrl()}/articles`, {
      next: { revalidate: 60 }, // ISR with 60 seconds revalidation
    });
    if (!res.ok) throw new Error("Failed to fetch articles");
    return await res.json();
  } catch (error) {
    console.error("Error in getArticles server-side fetch:", error);
    return [];
  }
};

export const getArticleBySlug = async (slug: string, cookieHeader?: string): Promise<Article | null> => {
  try {
    // If the server component runs and has cookies (optionalAuth), pass them along
    const headers: Record<string, string> = {};
    if (cookieHeader) {
      headers["Cookie"] = cookieHeader;
    }

    const res = await fetch(`${getApiBaseUrl()}/articles/${slug}`, {
      headers,
      next: { revalidate: 10 }, // Quick ISR refresh
    });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Failed to fetch article: ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error(`Error in getArticleBySlug server-side fetch (${slug}):`, error);
    return null;
  }
};

// --- REST OF FEATURES FROM articleApi.js ---

// checkProfileStatus: GET /articles/profile/status
export const checkProfileStatus = async (): Promise<{ hasProfile: boolean; profile?: any }> => {
  const res = await api.get("/articles/profile/status");
  return res.data;
};

// updateProfile: POST /articles/profile
export const updateProfile = async (profileData: any): Promise<any> => {
  const res = await api.post("/articles/profile", profileData);
  return res.data;
};

// createArticle: POST /articles
export const createArticle = async (articleData: any): Promise<Article> => {
  const res = await api.post("/articles", articleData);
  return res.data;
};

// updateArticle: PUT /articles/:id
export const updateArticle = async (id: string, articleData: any): Promise<Article> => {
  const res = await api.put(`/articles/${id}`, articleData);
  return res.data;
};

// getUserArticles: GET /articles/user/articles
export const getUserArticles = async (): Promise<Article[]> => {
  const res = await api.get("/articles/user/articles");
  return res.data;
};

// likeArticle: POST /articles/:id/like
export const likeArticle = async (id: string): Promise<{ isLiked: boolean; likes: string[] }> => {
  const res = await api.post(`/articles/${id}/like`);
  return res.data;
};

// addComment: POST /articles/:id/comments
export const addComment = async (id: string, text: string): Promise<Comment> => {
  const res = await api.post(`/articles/${id}/comments`, { text });
  return res.data;
};

// deleteComment: DELETE /articles/:articleId/comments/:commentId
export const deleteComment = async (articleId: string, commentId: string): Promise<any> => {
  const res = await api.delete(`/articles/${articleId}/comments/${commentId}`);
  return res.data;
};

// followUser: POST /articles/follow/:userId
export const followUser = async (userId: string): Promise<{ isFollowing: boolean; following: string[]; message: string }> => {
  const res = await api.post(`/articles/follow/${userId}`);
  return res.data;
};

// deleteArticle: DELETE /articles/:id
export const deleteArticle = async (id: string): Promise<any> => {
  const res = await api.delete(`/articles/${id}`);
  return res.data;
};


