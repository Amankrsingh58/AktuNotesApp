"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Article } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import Icon from "./Icons";
import toast from "react-hot-toast";

interface AuthorBannerProps {
  article: Article;
}

export default function AuthorBanner({ article }: AuthorBannerProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [status, setStatus] = useState<"draft" | "published">(article.status);
  const [loading, setLoading] = useState(false);

  // If not the author, do not render
  if (!user || user._id !== article.author?._id) return null;

  const handlePublishToggle = async () => {
    const newStatus = status === "draft" ? "published" : "draft";
    if (
      newStatus === "draft" &&
      !window.confirm("Move this article back to drafts? It will no longer be public.")
    ) {
      return;
    }

    setLoading(true);
    try {
      await api.put(`/articles/${article._id}`, { status: newStatus });
      setStatus(newStatus);
      toast.success(newStatus === "published" ? "Article published!" : "Moved to drafts!");
      router.refresh();
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this article? This action cannot be undone."
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      await api.delete(`/articles/${article._id}`);
      toast.success("Article deleted successfully");
      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete article");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`sticky top-14 z-40 border-y py-3 ${
        status === "draft"
          ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/50"
          : "bg-muted/30 border-border"
      }`}
    >
      <div className="max-w-[720px] mx-auto px-4 md:px-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div
          className={`flex items-center gap-2 text-sm font-medium ${
            status === "draft"
              ? "text-amber-800 dark:text-amber-200"
              : "text-muted-foreground"
          }`}
        >
          <Icon name={status === "draft" ? "FileText" : "ShieldCheck"} size={16} />
          <span>
            {status === "draft"
              ? "This is a draft. Only you can see it."
              : "You are the author of this article."}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push(`/write?edit=${article.slug}`)}
            className="text-xs font-bold hover:underline"
            disabled={loading}
          >
            Edit
          </button>
          <button
            onClick={handlePublishToggle}
            className="text-xs font-bold text-amber-600 hover:underline flex items-center gap-1"
            disabled={loading}
          >
            <Icon name="FileText" size={14} />
            {status === "published" ? "Unpublish" : "Publish"}
          </button>
          <button
            onClick={handleDelete}
            className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1"
            disabled={loading}
          >
            <Icon name="Trash2" size={14} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
