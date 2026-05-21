"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import Icon from "./Icons";
import toast from "react-hot-toast";

interface InteractionBarProps {
  articleId: string;
  articleSlug: string;
  initialLikes: string[];
  commentsCount: number;
}

export default function InteractionBar({
  articleId,
  articleSlug,
  initialLikes,
  commentsCount,
}: InteractionBarProps) {
  const { user, isAuthenticated, setAuthModalOpen, setAuthModalView } = useAuth();
  const [likes, setLikes] = useState<string[]>(initialLikes);
  const [loading, setLoading] = useState(false);

  const [bookmarked, setBookmarked] = useState<boolean>(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("bookmarked_articles") || "[]");
    if (saved.includes(articleSlug)) {
      setBookmarked(true);
    }
  }, [articleSlug]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      setAuthModalView("login");
      setAuthModalOpen(true);
      return;
    }

    setLoading(true);
    try {
      const res = await api.post(`/articles/${articleId}/like`);
      if (res.data.isLiked) {
        setLikes((prev) => [...prev, user?._id || ""]);
        toast.success("Liked article!");
      } else {
        setLikes((prev) => prev.filter((id) => id !== user?._id));
        toast.success("Unliked article");
      }
    } catch (error) {
      toast.error("Failed to like article");
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = () => {
    const saved = JSON.parse(localStorage.getItem("bookmarked_articles") || "[]");
    let newSaved = [...saved];

    if (bookmarked) {
      newSaved = newSaved.filter((id) => id !== articleSlug);
      toast.success("Removed from bookmarks");
    } else {
      newSaved.push(articleSlug);
      toast.success("Article bookmarked!");
    }

    localStorage.setItem("bookmarked_articles", JSON.stringify(newSaved));
    setBookmarked(!bookmarked);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const likedByMe = user?._id ? likes.includes(user._id) : false;

  return (
    <div className="flex items-center justify-between mb-10 text-muted-foreground py-3 border-y border-border/50">
      <div className="flex items-center gap-6">
        <button
          onClick={handleLike}
          disabled={loading}
          className={`flex items-center gap-1 transition-colors ${
            likedByMe ? "text-red-500" : "hover:text-foreground"
          }`}
        >
          <Icon name="Heart" size={20} className={likedByMe ? "fill-current" : ""} />
          <span className="text-sm">{likes.length}</span>
        </button>
        <button
          onClick={() => {
            document
              .getElementById("responses-section")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
          className="flex items-center gap-1 hover:text-foreground transition-colors"
        >
          <Icon name="MessageCircle" size={20} />
          <span className="text-sm">{commentsCount}</span>
        </button>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleBookmark}
          className={`transition-colors ${
            bookmarked ? "text-primary" : "hover:text-foreground"
          }`}
          title="Bookmark article"
        >
          <Icon name="Bookmark" size={20} className={bookmarked ? "fill-current" : ""} />
        </button>
        <button
          onClick={handleShare}
          className="hover:text-foreground transition-colors"
          title="Copy link"
        >
          <Icon name="Share" size={20} />
        </button>
      </div>
    </div>
  );
}
