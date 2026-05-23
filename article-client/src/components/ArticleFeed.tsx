"use client";

import React, { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Article } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";
import ArticleCard from "./ArticleCard";
import ArticleSkeleton from "./ArticleSkeleton";
import Icon from "./Icons";

interface ArticleFeedProps {
  initialArticles: Article[];
  isLoading?: boolean;
}

export default function ArticleFeed({ initialArticles, isLoading = false }: ArticleFeedProps) {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

  const [feedTab, setFeedTab] = useState<"for-you" | "following" | "top">("for-you");

  const filteredArticles = useMemo(() => {
    let baseArticles = [...initialArticles].filter((a) => a.status === "published");

    // Filter by Tab
    if (feedTab === "following") {
      baseArticles = baseArticles.filter((art) =>
        user?.following?.includes(art.author?._id)
      );
    } else if (feedTab === "top") {
      baseArticles = baseArticles.sort(
        (a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)
      );
    }

    // Filter by Search Query
    if (!searchQuery) return baseArticles;

    const query = searchQuery.toLowerCase();
    return baseArticles.filter(
      (art) =>
        art.title.toLowerCase().includes(query) ||
        art.summary.toLowerCase().includes(query) ||
        art.tags?.some((tag) => tag.toLowerCase().includes(query))
    );
  }, [initialArticles, searchQuery, feedTab, user]);

  return (
    <div className="flex-1 min-w-0 lg:max-w-[720px]">
      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-border mb-8 overflow-x-auto scrollbar-hide">
        <button
          onClick={() => setFeedTab("for-you")}
          className={`pb-4 text-sm font-medium whitespace-nowrap transition-all border-b-2 ${
            feedTab === "for-you"
              ? "text-foreground border-primary"
              : "text-muted-foreground border-transparent hover:text-foreground"
          }`}
        >
          For you
        </button>
        <button
          onClick={() => setFeedTab("following")}
          className={`pb-4 text-sm font-medium whitespace-nowrap transition-all border-b-2 ${
            feedTab === "following"
              ? "text-foreground border-primary"
              : "text-muted-foreground border-transparent hover:text-foreground"
          }`}
        >
          Following
        </button>
        <button
          onClick={() => setFeedTab("top")}
          className={`pb-4 text-sm font-medium whitespace-nowrap transition-all border-b-2 ${
            feedTab === "top"
              ? "text-foreground border-primary"
              : "text-muted-foreground border-transparent hover:text-foreground"
          }`}
        >
          Top Articles
        </button>
      </div>

      {/* Feed List */}
      <div className="space-y-12">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <ArticleSkeleton key={`skeleton-${index}`} />
          ))
        ) : filteredArticles.length === 0 ? (
          <div className="py-20 text-center">
            <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Search" size={24} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-1">
              No articles found
            </h3>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
              {feedTab === "following"
                ? "Follow some authors to see their latest stories here."
                : "Try adjusting your search or check back later."}
            </p>
            {feedTab === "following" && (
              <button
                onClick={() => setFeedTab("for-you")}
                className="mt-6 text-primary font-bold text-sm hover:underline"
              >
                Explore popular articles
              </button>
            )}
          </div>
        ) : (
          filteredArticles.map((article) => (
            <ArticleCard
              key={article._id}
              article={article}
              currentUserId={user?._id}
            />
          ))
        )}
      </div>
    </div>
  );
}
