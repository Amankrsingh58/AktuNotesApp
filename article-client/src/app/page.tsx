import React, { Suspense } from "react";
import { getArticles } from "@/lib/api";
import Header from "@/components/Header";
import AuthModal from "@/components/AuthModal";
import JsonLd from "@/components/JsonLd";
import MainLayout from "@/components/MainLayout";
import CircleDotsPreloader from "@/components/CircleDotsPreloader";

export const dynamic = "force-dynamic"; // Disable page caching to reflect publishes and deletes instantly

export default async function Page() {
  const articles = await getArticles();

  // Create CollectionPage Schema Markup for SEO
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Cognora Articles",
    "description": "Premium engineering, exam prep, preparation strategies, and B.Tech student notes and articles.",
    "url": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    "hasPart": articles.slice(0, 10).map((art) => ({
      "@type": "CreativeWork",
      "headline": art.title,
      "description": art.summary,
      "url": `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/articles/${art.slug}`,
      "author": {
        "@type": "Person",
        "name": art.author?.name || "Author",
      },
    })),
  };

  return (
    <>
      <JsonLd data={schemaData} />
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
