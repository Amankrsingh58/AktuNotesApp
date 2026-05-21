import React, { Suspense } from "react";
import { getArticles } from "@/lib/api";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ArticleFeed from "@/components/ArticleFeed";
import PickedSidebar from "@/components/PickedSidebar";
import AuthModal from "@/components/AuthModal";
import JsonLd from "@/components/JsonLd";

export const revalidate = 60; // Page caches with ISR for 60 seconds

export default async function Page() {
  const articles = await getArticles();

  // Create CollectionPage Schema Markup for SEO
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "AKTU Notes Articles",
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
        <div className="flex pt-14">
          <Sidebar activeView="home" />
          <main className="flex-1 min-w-0">
            <div className="pb-20 max-w-[1300px] mx-auto px-4 md:px-8 pt-8">
              <div className="flex flex-col justify-center lg:flex-row gap-12">
                <Suspense
                  fallback={
                    <div className="flex-1 space-y-12">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse flex gap-6">
                          <div className="flex-1 space-y-4">
                            <div className="h-4 bg-muted rounded w-24"></div>
                            <div className="h-8 bg-muted rounded w-3/4"></div>
                            <div className="h-4 bg-muted rounded w-full"></div>
                          </div>
                          <div className="w-28 md:w-40 h-28 bg-muted rounded"></div>
                        </div>
                      ))}
                    </div>
                  }
                >
                  <ArticleFeed initialArticles={articles} />
                </Suspense>
                <PickedSidebar articles={articles} />
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
