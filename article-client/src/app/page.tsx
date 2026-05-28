import type { Metadata } from "next";
import React, { Suspense } from "react";
import { getArticles } from "@/lib/api";
import Header from "@/components/Header";
import AuthModal from "@/components/AuthModal";
import JsonLd from "@/components/JsonLd";
import MainLayout from "@/components/MainLayout";
import CircleDotsPreloader from "@/components/CircleDotsPreloader";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cognora | Articles, Technologies & AI Insights Feed",
  description: "Browse the latest tech articles on AI, software engineering, and modern technologies. Join the community and share your insights on Cognora.",
  alternates: {
    canonical: "/",
  },
};

export default async function Page() {
  const articles = await getArticles();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // Create CollectionPage Schema Markup for SEO
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Cognora Articles | AI, Tech & Engineering Insights",
    "description": "Explore the latest tech articles on AI, software engineering, and modern technologies on Cognora.",
    "url": siteUrl,
    "hasPart": articles.slice(0, 10).map((art) => ({
      "@type": "CreativeWork",
      "headline": art.title,
      "description": art.summary,
      "url": `${siteUrl}/articles/${art.slug}`,
      "author": {
        "@type": "Person",
        "name": art.author?.name || "Author",
      },
    })),
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": siteUrl,
    "name": "Cognora",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${siteUrl}/?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <JsonLd data={collectionSchema} />
      <JsonLd data={websiteSchema} />
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <AuthModal />
        <Header />
        <Suspense fallback={
          <div className="min-h-[50vh] flex items-center justify-center bg-background">
            <CircleDotsPreloader />
          </div>
        }>
          <MainLayout initialArticles={articles} />
        </Suspense>
      </div>
    </>
  );
}
