import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cognora.in";
  
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/write", "/write/", "/login", "/signup"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
