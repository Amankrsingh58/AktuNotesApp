"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Article } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";
import {
  getUserArticles,
  deleteArticle,
  updateProfile,
} from "@/lib/api";
import Sidebar from "./Sidebar";
import ArticleFeed from "./ArticleFeed";
import PickedSidebar from "./PickedSidebar";
import Icon from "./Icons";
import CircleDotsPreloader from "./CircleDotsPreloader";
import toast from "react-hot-toast";

interface MainLayoutProps {
  initialArticles: Article[];
}

export default function MainLayout({ initialArticles }: MainLayoutProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeView = searchParams.get("view") || "home";

  const { user, isAuthenticated, login, setAuthModalOpen, setAuthModalView } =
    useAuth();

  // ✅ Cache user articles — don't re-fetch on every tab switch
  const [userArticles, setUserArticles] = useState<Article[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(false);
  const hasFetchedArticles = useRef(false); // ✅ Persists across re-renders

  const [profileForm, setProfileForm] = useState({
    bio: "",
    website: "",
    twitter: "",
    linkedin: "",
  });
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Sync profile form when user updates
  useEffect(() => {
    if (user?.articleProfile) {
      setProfileForm({
        bio: user.articleProfile.bio || "",
        website: user.articleProfile.socialLinks?.website || "",
        twitter: user.articleProfile.socialLinks?.twitter || "",
        linkedin: user.articleProfile.socialLinks?.linkedin || "",
      });
    }
  }, [user]);

  // ✅ Only fetch once — skip if already fetched
  useEffect(() => {
    if (activeView !== "articles" || !isAuthenticated) return;
    if (hasFetchedArticles.current) return; // ✅ Skip re-fetch on tab switch

    const fetchMyArticles = async () => {
      setLoadingArticles(true);
      try {
        const data = await getUserArticles();
        setUserArticles(data);
        hasFetchedArticles.current = true; // ✅ Mark as fetched
      } catch (error) {
        toast.error("Failed to load your stories");
      } finally {
        setLoadingArticles(false);
      }
    };

    fetchMyArticles();
  }, [activeView, isAuthenticated]);

  // ✅ Reset cache if user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      hasFetchedArticles.current = false;
      setUserArticles([]);
    }
  }, [isAuthenticated]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingProfile(true);
    try {
      const updatedUser = await updateProfile({
        bio: profileForm.bio,
        socialLinks: {
          website: profileForm.website,
          twitter: profileForm.twitter,
          linkedin: profileForm.linkedin,
        },
      });
      if (updatedUser?.user) login(updatedUser.user);
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this story?"
      )
    )
      return;
    try {
      await deleteArticle(id);
      setUserArticles((prev) => prev.filter((art) => art._id !== id));
      toast.success("Story deleted");
    } catch (error) {
      toast.error("Failed to delete story");
    }
  };

  const handleLoginRedirect = () => {
    setAuthModalView("login");
    setAuthModalOpen(true);
  };

  return (
    <div className="flex pt-14">
      <Sidebar activeView={activeView} />

      <main className="flex-1 min-w-0">
        <div className="pb-20 max-w-[1300px] mx-auto px-4 md:px-8 pt-8">

          {/* HOME VIEW */}
          {activeView === "home" && (
            <div className="flex flex-col justify-center lg:flex-row gap-12">
              <ArticleFeed initialArticles={initialArticles} />
              <PickedSidebar articles={initialArticles} />
            </div>
          )}

          {/* PROFILE VIEW */}
          {activeView === "profile" && (
            <div className="max-w-[700px] mx-auto">
              {!isAuthenticated ? (
                <div className="text-center py-20 bg-card border border-border rounded-3xl p-8 shadow-xl">
                  <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon name="User" size={32} />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Access Your Profile</h2>
                  <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
                    Please log in to complete your author profile, add your bio,
                    and link your social accounts.
                  </p>
                  <button
                    onClick={handleLoginRedirect}
                    className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-full hover:opacity-90 transition-all shadow-lg"
                  >
                    Log In / Sign Up
                  </button>
                </div>
              ) : (
                <div className="bg-card border border-border rounded-3xl p-8 shadow-xl">
                  <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border">
                    <img
                      src={
                        user?.profilePic ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          user?.name || "User"
                        )}&background=random`
                      }
                      alt=""
                      className="w-16 h-16 rounded-full object-cover border border-border"
                    />
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">
                        {user?.name}
                      </h2>
                      <p className="text-muted-foreground text-sm">
                        {user?.email}
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleProfileSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Bio / About You
                      </label>
                      <textarea
                        placeholder="Write a short bio about yourself..."
                        rows={4}
                        className="w-full bg-background border border-input rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground resize-none"
                        value={profileForm.bio}
                        onChange={(e) =>
                          setProfileForm({ ...profileForm, bio: e.target.value })
                        }
                      />
                      <p className="text-xs text-muted-foreground mt-1.5">
                        This bio will be shown to other students next to your
                        published stories.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Website URL
                        </label>
                        <input
                          type="url"
                          placeholder="https://yourwebsite.com"
                          className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground"
                          value={profileForm.website}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              website: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Twitter Username
                        </label>
                        <input
                          type="text"
                          placeholder="johndoe"
                          className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground"
                          value={profileForm.twitter}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              twitter: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          LinkedIn Profile URL
                        </label>
                        <input
                          type="url"
                          placeholder="https://linkedin.com/in/..."
                          className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground"
                          value={profileForm.linkedin}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              linkedin: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={updatingProfile}
                      className="w-full md:w-auto px-8 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-all disabled:opacity-50"
                    >
                      {updatingProfile ? "Updating..." : "Save Profile Details"}
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* ARTICLES VIEW */}
          {activeView === "articles" && (
            <div className="max-w-[1000px] mx-auto">
              {!isAuthenticated ? (
                <div className="text-center py-20 bg-card border border-border rounded-3xl p-8 shadow-xl">
                  <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon name="Layout" size={32} />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Manage Your Stories</h2>
                  <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
                    Please log in to view, edit, or delete your articles and
                    drafts.
                  </p>
                  <button
                    onClick={handleLoginRedirect}
                    className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-full hover:opacity-90 transition-all shadow-lg"
                  >
                    Log In / Sign Up
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                      <h2 className="text-3xl font-bold text-foreground">
                        Your Stories
                      </h2>
                      <p className="text-muted-foreground text-sm mt-1">
                        Manage all draft and published articles you have written
                      </p>
                    </div>
                    <button
                      onClick={() => router.push("/write")}
                      className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-full text-sm font-semibold transition-all flex items-center gap-2"
                    >
                      <Icon name="Plus" size={16} />
                      Write a Story
                    </button>
                  </div>

                  {loadingArticles ? (
                    <div className="py-20 flex justify-center">
                      <CircleDotsPreloader />
                    </div>
                  ) : userArticles.length === 0 ? (
                    <div className="text-center py-20 bg-card border border-border rounded-3xl p-8 shadow-xl">
                      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon
                          name="FileText"
                          size={24}
                          className="text-muted-foreground"
                        />
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-1">
                        No stories yet
                      </h3>
                      <p className="text-muted-foreground text-sm max-w-xs mx-auto mb-6">
                        You haven't written any articles or drafts yet. Start
                        sharing your knowledge now!
                      </p>
                      <button
                        onClick={() => router.push("/write")}
                        className="px-6 py-2 bg-primary text-primary-foreground font-semibold rounded-full hover:opacity-90 transition"
                      >
                        Write your first article
                      </button>
                    </div>
                  ) : (
                    <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-xl">
                      <div className="divide-y divide-border">
                        {userArticles.map((art) => (
                          <div
                            key={art._id}
                            className="p-6 flex flex-col md:flex-row justify-between gap-6 hover:bg-muted/10 transition-colors"
                          >
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-3">
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                    art.status === "published"
                                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                      : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                                  }`}
                                >
                                  {art.status === "published"
                                    ? "Published"
                                    : "Draft"}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(art.createdAt).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    }
                                  )}
                                </span>
                              </div>
                              <h3
                                className="text-xl font-bold text-foreground hover:text-primary transition-colors cursor-pointer"
                                onClick={() =>
                                  router.push(`/write?edit=${art.slug}`)
                                }
                              >
                                {art.title || "Untitled"}
                              </h3>
                              <p className="text-muted-foreground text-sm line-clamp-2">
                                {art.summary || "No description provided."}
                              </p>
                            </div>

                            <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-4 shrink-0 border-t md:border-t-0 border-border pt-4 md:pt-0">
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Icon name="Heart" size={14} />
                                  {art.likes?.length || 0}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Icon name="MessageCircle" size={14} />
                                  {art.comments?.length || 0}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() =>
                                    router.push(`/write?edit=${art.slug}`)
                                  }
                                  className="px-4 py-1.5 border border-border text-foreground hover:bg-muted rounded-full text-xs font-semibold transition"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteArticle(art._id)}
                                  className="px-4 py-1.5 bg-red-600/10 text-red-600 hover:bg-red-600 hover:text-white rounded-full text-xs font-semibold transition"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}