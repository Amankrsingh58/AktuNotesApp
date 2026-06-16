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

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    ...articleUrls,
  ];
}
