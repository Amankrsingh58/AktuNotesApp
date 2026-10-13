import { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/write", "/write/", "/login", "/signup", "/linksin", "/admin", "/admin/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
