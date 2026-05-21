import axios from "axios";
import { Article } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api";

// Create client axios instance for client-side fetches (with credentials for cookies)
export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// SSR / Server Component calls (running on the Node server during SSR/SSG/ISR)
export const getArticles = async (): Promise<Article[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/articles`, {
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

    const res = await fetch(`${API_BASE_URL}/articles/${slug}`, {
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
