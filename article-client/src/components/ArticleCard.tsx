"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Article } from "@/lib/types";
import Icon from "./Icons";
import toast from "react-hot-toast";
import { deleteArticle } from "@/lib/api";

interface ArticleCardProps {
  article: Article;
  currentUserId?: string;
  index?: number;
}

export default function ArticleCard({ article, currentUserId, index = 0 }: ArticleCardProps) {
  const isPriority = index < 2;
  const loadingType = isPriority ? "eager" : "lazy";
  const [bookmarked, setBookmarked] = useState<boolean>(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("bookmarked_articles") || "[]");
    if (saved.includes(article.slug)) {
      setBookmarked(true);
    }
  }, [article.slug]);

  const toggleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const saved = JSON.parse(localStorage.getItem("bookmarked_articles") || "[]");
    let newSaved = [...saved];

    if (bookmarked) {
      newSaved = newSaved.filter((id) => id !== article.slug);
      toast.success("Removed from bookmarks");
    } else {
      newSaved.push(article.slug);
      toast.success("Article bookmarked!");
    }

    localStorage.setItem("bookmarked_articles", JSON.stringify(newSaved));
    setBookmarked(!bookmarked);
  };

  const authorPic =
    article.author?.profilePic ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      article.author?.name || "Author"
    )}&background=random`;

  const dateObj = new Date(article.createdAt);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const formattedDate = `${months[dateObj.getUTCMonth()]} ${dateObj.getUTCDate()}`;

  const likedByMe = currentUserId ? article.likes?.includes(currentUserId) : false;

  return (
    <article className="group border-b border-border/50 pb-12 last:border-0">
      <div className="flex gap-4 md:gap-12 items-start">
        <div className="flex-1 min-w-0">
          {/* Author Meta */}
          <div className="flex items-center gap-2 mb-3">
            <img
              src={authorPic}
              alt={article.author?.name || "Author"}
              width={20}
              height={20}
              className="w-5 h-5 rounded-full object-cover"
              loading={loadingType}
              decoding="async"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = "/mainlogo2.png";
              }}
            />
            <span className="text-[13px] font-medium text-foreground">
              {article.author?.name}
            </span>
            <span className="text-[13px] text-muted-foreground">·</span>
            <time dateTime={article.createdAt} className="text-[13px] text-muted-foreground">{formattedDate}</time>
          </div>

          {/* Title Link */}
          <Link href={`/articles/${article.slug}`}>
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors leading-tight tracking-tight">
              {article.title}
            </h2>
          </Link>

          {/* Summary */}
          <p className="text-muted-foreground line-clamp-2 mb-6 text-base font-normal leading-relaxed">
            {article.summary}
          </p>

          {/* Actions & Metrics */}
          <div className="flex flex-wrap items-center justify-between gap-y-2 mt-4">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
              <span className="flex items-center gap-1 text-[13px] text-muted-foreground">
                <Icon name="Star" size={14} className="text-amber-500 fill-amber-500" />
              </span>
              <span className="text-[13px] text-muted-foreground">
                {article.readTime || 1} min read
              </span>
              {article.tags && article.tags.length > 0 && (
                <span className="hidden sm:inline-block px-2 py-1 bg-muted rounded-full text-[12px] text-foreground">
                  {article.tags[0]}
                </span>
              )}
              <span className="flex items-center gap-1 text-[13px] text-muted-foreground">
                <Icon
                  name="Heart"
                  size={14}
                  className={likedByMe ? "text-red-500 fill-current" : ""}
                />
                {article.likes?.length || 0}
              </span>
              <span className="flex items-center gap-1 text-[13px] text-muted-foreground">
                <Icon name="MessageCircle" size={14} />
                {article.comments?.length || 0}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {currentUserId && currentUserId === article.author?._id && (
                <div className="flex items-center gap-2 mr-2">
                  <Link
                    href={`/write?edit=${article.slug}`}
                    className="px-3 py-1 border border-border text-foreground hover:bg-muted rounded-full text-xs font-semibold transition"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={async (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (window.confirm("Are you sure you want to permanently delete this story?")) {
                        try {
                          await deleteArticle(article._id);
                          toast.success("Story deleted");
                          window.location.reload(); // Refresh the page to show latest feed
                        } catch (err) {
                          toast.error("Failed to delete story");
                        }
                      }
                    }}
                    className="px-3 py-1 bg-red-600/10 text-red-600 hover:bg-red-600 hover:text-white rounded-full text-xs font-semibold transition"
                  >
                    Delete
                  </button>
                </div>
              )}

              <button
                onClick={toggleBookmark}
                className={`transition-colors ${
                  bookmarked ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
                title="Bookmark article"
              >
                <Icon
                  name="Bookmark"
                  size={20}
                  className={bookmarked ? "fill-current" : ""}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Cover Image */}
        {article.coverImage && (
          <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-40 md:h-28 shrink-0">
            <img
              src={article.coverImage}
              alt={article.title}
              width={640}
              height={448}
              className="w-full h-full object-cover rounded shadow-sm opacity-90 dark:opacity-80 group-hover:opacity-100 transition-opacity"
              loading={loadingType}
              decoding="async"
            />
          </div>
        )}
      </div>
    </article>
  );
}
