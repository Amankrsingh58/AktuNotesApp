"use client";

import React, { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const selectedCategory = searchParams.get("category") || "";
  const categories = useMemo(
    () =>
      Array.from(
        new Set(
          initialArticles
            .map((article) => article.category)
            .filter((category): category is string => Boolean(category && category !== "Uncategorized"))
        )
      ).sort(),
    [initialArticles]
  );

  const [feedTab, setFeedTab] = useState<"for-you" | "following" | "top">("for-you");
  const [dismissAutoFilter, setDismissAutoFilter] = useState(false);

  // Check user's preferred category and whether it has at least 5 articles
  const userCategory = user?.category?.trim();
  const matchingCategoryCount = useMemo(() => {
    if (!userCategory || userCategory.toLowerCase() === "all") return 0;
    return initialArticles.filter(
      (a) => a.status === "published" && a.category?.toLowerCase() === userCategory.toLowerCase()
    ).length;
  }, [userCategory, initialArticles]);

  const isAutoFilterActive = Boolean(
    feedTab === "for-you" &&
    !selectedCategory &&
    !dismissAutoFilter &&
    userCategory &&
    userCategory.toLowerCase() !== "all" &&
    matchingCategoryCount >= 5
  );

  const filteredArticles = useMemo(() => {
    let baseArticles = [...initialArticles].filter((a) => a.status === "published");

    // Filter by Tab
    if (feedTab === "following") {
      baseArticles = baseArticles.filter((art) =>
        user?.following?.includes(art.author?._id)
      );
    } else if (feedTab === "top") {
      baseArticles = baseArticles.sort(
        (a, b) =>
          (b.views || 0) - (a.views || 0) ||
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (feedTab === "for-you") {
      // Auto-filter by user's preferred category ONLY IF it has >= 5 articles
      // And only when no manual category filter is selected and not dismissed
      if (isAutoFilterActive && userCategory) {
        baseArticles = baseArticles.filter(
          (article) => article.category?.toLowerCase() === userCategory.toLowerCase()
        );
      }
    }

    if (selectedCategory) {
      baseArticles = baseArticles.filter(
        (article) => article.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by Search Query
    if (!searchQuery) return baseArticles;

    const query = searchQuery.toLowerCase();
    return baseArticles.filter(
      (art) =>
        art.title.toLowerCase().includes(query) ||
        art.summary.toLowerCase().includes(query) ||
        art.category?.toLowerCase().includes(query) ||
        art.tags?.some((tag) => tag.toLowerCase().includes(query))
    );
  }, [initialArticles, searchQuery, selectedCategory, feedTab, user, isAutoFilterActive, userCategory]);

  const changeCategory = (category: string) => {
    setDismissAutoFilter(false);
    const params = new URLSearchParams(searchParams.toString());
    if (category) params.set("category", category);
    else params.delete("category");
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  return (
    <div className="flex-1 min-w-0 lg:max-w-[720px]">
      <div className="mb-5 flex items-center justify-between gap-3">
        <label htmlFor="article-category-filter" className="text-sm font-semibold text-foreground">
          Browse by category
        </label>
        <select
          id="article-category-filter"
          value={selectedCategory}
          onChange={(event) => changeCategory(event.target.value)}
          className="h-10 max-w-[65%] rounded-xl border border-border bg-card px-3 text-sm text-foreground outline-none focus:border-primary"
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-border mb-8 overflow-x-auto scrollbar-hide">
        <button
          onClick={() => {
            setFeedTab("for-you");
            setDismissAutoFilter(false);
          }}
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

      {/* Auto-Filter Notice Banner */}
      {isAutoFilterActive && (
        <div className="mb-6 flex items-center justify-between gap-3 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-xs text-foreground shadow-sm">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-primary" />
            <span>
              Curated for your interest in <strong className="font-semibold text-primary">{userCategory}</strong> ({matchingCategoryCount} stories)
            </span>
          </div>
          <button
            onClick={() => setDismissAutoFilter(true)}
            className="shrink-0 font-semibold text-primary underline underline-offset-2 hover:opacity-80 transition"
          >
            Show all topics
          </button>
        </div>
      )}

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
                : isAutoFilterActive
                ? `No stories found matching "${userCategory}".`
                : "Try adjusting your search or check back later."}
            </p>
            {isAutoFilterActive ? (
              <button
                onClick={() => setDismissAutoFilter(true)}
                className="mt-6 text-primary font-bold text-sm hover:underline"
              >
                Show all articles
              </button>
            ) : feedTab === "following" ? (
              <button
                onClick={() => setFeedTab("for-you")}
                className="mt-6 text-primary font-bold text-sm hover:underline"
              >
                Explore popular articles
              </button>
            ) : null}
          </div>
        ) : (
          filteredArticles.map((article, index) => (
            <ArticleCard
              key={article._id}
              article={article}
              currentUserId={user?._id}
              index={index}
            />
          ))
        )}
      </div>
    </div>
  );
}
