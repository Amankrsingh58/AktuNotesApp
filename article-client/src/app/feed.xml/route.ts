import { NextResponse } from "next/server";
import { getArticles } from "@/lib/api";
import { getSiteUrl } from "@/lib/site";

export async function GET() {
  const siteUrl = getSiteUrl();
  const articles = await getArticles();
  
  const publishedArticles = articles.filter((a) => a.status === "published");

  const escapeXml = (str: string) =>
    str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");

  const feedItems = publishedArticles
    .map((art) => {
      const artUrl = `${siteUrl}/articles/${art.slug}`;
      const categoryTags = (art.tags || [])
        .map((tag) => `        <category>${escapeXml(tag)}</category>`)
        .join("\n");
      const mediaThumbnail = art.coverImage
        ? `        <media:thumbnail url="${escapeXml(art.coverImage)}" />\n        <media:content url="${escapeXml(art.coverImage)}" medium="image" />`
        : "";
      return `
      <item>
        <title><![CDATA[${art.title}]]></title>
        <link>${artUrl}</link>
        <guid isPermaLink="true">${artUrl}</guid>
        <pubDate>${new Date(art.createdAt).toUTCString()}</pubDate>
        <description><![CDATA[${art.summary}]]></description>
        <content:encoded><![CDATA[${art.content}]]></content:encoded>
        <dc:creator><![CDATA[${art.author?.name || "Author"}]]></dc:creator>
${categoryTags}
${mediaThumbnail}
      </item>`;
    })
    .join("");

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:media="http://search.yahoo.com/mrss/">
<channel>
  <title>Cognora | AI, Tech &amp; Software Engineering Articles</title>
  <link>${siteUrl}</link>
  <description>Explore the latest articles on AI, emerging technologies, software engineering, coding tutorials, and modern developer insights on Cognora.</description>
  <language>en-us</language>
  <copyright>Copyright ${new Date().getFullYear()} Cognora. All rights reserved.</copyright>
  <managingEditor>team@cognora.in (Cognora Team)</managingEditor>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
  <image>
    <url>${siteUrl}/mainlogo2.png</url>
    <title>Cognora</title>
    <link>${siteUrl}</link>
  </image>
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
