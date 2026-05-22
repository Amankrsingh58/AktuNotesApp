import { NextResponse } from "next/server";
import { getArticles } from "@/lib/api";

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const articles = await getArticles();
  
  const publishedArticles = articles.filter((a) => a.status === "published");

  const feedItems = publishedArticles
    .map((art) => {
      const artUrl = `${siteUrl}/articles/${art.slug}`;
      return `
      <item>
        <title><![CDATA[${art.title}]]></title>
        <link>${artUrl}</link>
        <guid isPermaLink="true">${artUrl}</guid>
        <pubDate>${new Date(art.createdAt).toUTCString()}</pubDate>
        <description><![CDATA[${art.summary}]]></description>
        <content:encoded><![CDATA[${art.content}]]></content:encoded>
        <author>${art.author?.name || "Author"}</author>
      </item>`;
    })
    .join("");

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>cognora Articles</title>
  <link>${siteUrl}</link>
  <description>Latest student guides, preparation tips, notes, and B.Tech resources.</description>
  <language>en-us</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
  ${feedItems}
</channel>
</rss>`;

  return new NextResponse(rssFeed, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=18000",
    },
  });
}
