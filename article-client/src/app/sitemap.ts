import { MetadataRoute } from "next";
import { getArticles } from "@/lib/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cognora.in";

  // Fetch all published articles
  const articles = await getArticles();

  // Create article URLs
  const articleUrls = articles
    .filter((a) => a.status === "published")
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
