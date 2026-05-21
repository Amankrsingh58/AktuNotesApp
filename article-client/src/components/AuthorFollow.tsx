"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

interface AuthorFollowProps {
  authorId: string;
  authorName: string;
  variant?: "badge" | "button";
}

export default function AuthorFollow({
  authorId,
  authorName,
  variant = "badge",
}: AuthorFollowProps) {
  const { user, isAuthenticated, setAuthModalOpen, setAuthModalView, login } = useAuth();
  const [following, setFollowing] = useState<boolean>(() => {
    return user?.following?.includes(authorId) || false;
  });
  const [loading, setLoading] = useState(false);

  const handleFollow = async () => {
    if (!isAuthenticated) {
      setAuthModalView("login");
      setAuthModalOpen(true);
      return;
    }

    if (user?._id === authorId) {
      toast.error("You cannot follow yourself");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post(`/articles/follow/${authorId}`);
      setFollowing(res.data.isFollowing);

      // Update following list locally in Auth state
      if (user) {
        login({
          ...user,
          following: res.data.following,
        });
      }

      toast.success(res.data.message || "Updated follow state!");
    } catch (error) {
      toast.error("Failed to update follow state");
    } finally {
      setLoading(false);
    }
  };

  if (user?._id === authorId) return null;

  if (variant === "button") {
    return (
      <button
        onClick={handleFollow}
        disabled={loading}
        className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
          following
            ? "bg-muted text-muted-foreground border border-border"
            : "bg-primary text-primary-foreground hover:opacity-90"
        } disabled:opacity-50`}
      >
        {following ? "Following" : "Follow"}
      </button>
    );
  }

  return (
    <button
      onClick={handleFollow}
      disabled={loading}
      className={`text-[15px] font-medium transition-colors ${
        following ? "text-muted-foreground" : "text-primary hover:text-foreground"
      } disabled:opacity-50`}
    >
      {following ? "Following" : "Follow"}
    </button>
  );
}
