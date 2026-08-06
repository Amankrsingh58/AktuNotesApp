import { MetadataRoute } from "next";
import { getArticles } from "@/lib/api";
import { getSiteUrl } from "@/lib/site";
import { isArticleIndexable } from "@/lib/articleQuality";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();

  // Fetch all published articles
  const articles = await getArticles();

  // Create article URLs
  const articleUrls = articles
    .filter((a) => a.status === "published" && isArticleIndexable(a))
    .map((art) => ({
      url: `${siteUrl}/articles/${art.slug}`,
      lastModified: new Date(art.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  const staticPages = ["/about", "/contact", "/privacy", "/terms", "/cookie-policy", "/faq"].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date("2026-08-04"),
    changeFrequency: "monthly" as const,
    priority: path === "/about" ? 0.7 : 0.5,
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    ...staticPages,
    ...articleUrls,
  ];
}
