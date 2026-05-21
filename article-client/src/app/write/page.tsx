"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import Icon from "@/components/Icons";
import RichTextEditor from "@/components/RichTextEditor";
import toast from "react-hot-toast";

function WritePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editSlug = searchParams.get("edit");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const summaryRef = useRef<HTMLTextAreaElement>(null);

  const { isAuthenticated, isLoading } = useAuth();

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast.error("Please login to access the editor");
      router.replace("/login?from=/write");
    }
  }, [isAuthenticated, isLoading, router]);

  const [articleId, setArticleId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [summary, setSummary] = useState("");
  const [tags, setTags] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  // Auto-resize textareas when values change (essential for edit mode and mounting)
  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = "auto";
      titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
    }
  }, [title]);

  useEffect(() => {
    if (summaryRef.current) {
      summaryRef.current.style.height = "auto";
      summaryRef.current.style.height = `${summaryRef.current.scrollHeight}px`;
    }
  }, [summary]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary"></div>
      </div>
    );
  }

  // Fetch article if we are in edit mode
  useEffect(() => {
    if (!editSlug) return;

    const fetchArticle = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/articles/${editSlug}`);
        const art = res.data;
        setArticleId(art._id);
        setTitle(art.title);
        setContent(art.content);
        setSummary(art.summary);
        setTags(art.tags?.join(", ") || "");
        setCoverImage(art.coverImage || "");
      } catch (err) {
        toast.error("Failed to load article for editing");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [editSlug]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    setIsUploading(true);
    try {
      // Upload using Express endpoint
      const response = await api.post("/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const imageUrl = response.data.url;
      setCoverImage(imageUrl);
      toast.success("Image uploaded successfully!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handlePublish = async (status: "draft" | "published" = "published") => {
    if (status === "published" && (!title || !content || !summary)) {
      toast.error("Please fill in the title, summary, and content before publishing.");
      return;
    }

    if (status === "draft" && !title) {
      toast.error("Please at least add a title to save a draft.");
      return;
    }

    setIsPublishing(true);
    try {
      const articleData = {
        title,
        content,
        summary,
        coverImage,
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag !== ""),
        status,
      };

      let result;
      if (editSlug && articleId) {
        const res = await api.put(`/articles/${articleId}`, articleData);
        result = res.data;
      } else {
        const res = await api.post("/articles", articleData);
        result = res.data;
      }

      toast.success(status === "published" ? "Article published!" : "Draft saved!");
      if (status === "published") {
        router.push(`/articles/${result.slug}`);
      } else if (!editSlug) {
        router.replace(`/write?edit=${result.slug}`);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setIsPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary"></div>
      </div>
    );
  }

  if (isPreview) {
    return (
      <div className="pt-20 pb-20 max-w-[720px] mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
            Preview Mode
          </h2>
          <button
            onClick={() => setIsPreview(false)}
            className="px-4 py-2 border border-border text-foreground rounded-full text-xs font-semibold hover:bg-muted transition"
          >
            Edit
          </button>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-6">{title || "Untitled"}</h1>
        <p className="text-xl text-muted-foreground mb-8 italic">
          {summary || "No summary provided."}
        </p>
        {coverImage && (
          <img
            src={coverImage}
            alt=""
            className="w-full h-auto object-cover rounded-lg mb-10 shadow"
          />
        )}
        <div
          className="prose prose-lg dark:prose-invert font-serif"
          dangerouslySetInnerHTML={{ __html: content }}
        />
        <div className="mt-10 flex gap-2">
          {tags
            .split(",")
            .map((t) => t.trim())
            .filter((t) => t)
            .map((tag) => (
              <span key={tag} className="px-3 py-1 bg-muted rounded-full text-xs">
                {tag}
              </span>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 pb-20 max-w-[800px] mx-auto px-4 bg-background">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 border-b border-border pb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-muted rounded-full transition-colors text-foreground"
          >
            <Icon name="ArrowLeft" size={20} />
          </button>
          <h2 className="text-xl font-bold text-foreground">
            {editSlug ? "Edit Article" : "Write Article"}
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPreview(true)}
            disabled={!content}
            className="px-4 py-2 border border-transparent text-foreground rounded-full text-xs font-semibold hover:bg-muted transition disabled:opacity-50"
          >
            Preview
          </button>
          <button
            onClick={() => handlePublish("draft")}
            disabled={isPublishing}
            className="px-6 py-2 border border-border text-foreground rounded-full text-xs font-semibold hover:bg-muted transition disabled:opacity-50"
          >
            {isPublishing ? "Saving..." : "Save Draft"}
          </button>
          <button
            onClick={() => handlePublish("published")}
            disabled={isPublishing}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full text-xs font-semibold transition disabled:opacity-50"
          >
            {isPublishing ? "Publishing..." : "Publish"}
          </button>
        </div>
      </div>

      <textarea
        ref={titleRef}
        placeholder="Title..."
        className="w-full text-4xl md:text-5xl font-bold bg-transparent border-none outline-none resize-none placeholder:text-muted-foreground/35 mb-4 text-foreground overflow-hidden"
        rows={1}
        style={{ minHeight: "68px" }}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        ref={summaryRef}
        placeholder="Short summary (for the feed)..."
        className="w-full text-xl md:text-2xl font-light bg-transparent border-none outline-none resize-none placeholder:text-muted-foreground/35 mb-10 text-muted-foreground overflow-hidden"
        rows={1}
        style={{ minHeight: "44px" }}
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
      />

      <div className="space-y-4 mb-12 p-6 bg-muted/30 rounded-2xl border border-border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Cover Image
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Image URL..."
                className="flex-1 bg-background border border-border rounded-lg px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-primary text-foreground"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="px-3 border border-border rounded-lg hover:bg-muted transition text-foreground"
              >
                <Icon name="Upload" size={16} />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Tags (comma separated)
            </label>
            <input
              type="text"
              placeholder="Exams, Tips, B.Tech"
              className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-primary text-foreground"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
        </div>
      </div>

      <RichTextEditor value={content} onChange={setContent} />
    </div>
  );
}

export default function WritePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary"></div>
      </div>
    }>
      <WritePageContent />
    </Suspense>
  );
}
