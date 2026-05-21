import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  useCreateArticleMutation, 
  useUpdateArticleMutation, 
  useGetArticleBySlugQuery 
} from "../../features/articles/articleApi";
import ArticleHeader from "../../components/ui/ArticleHeader";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import toast from "react-hot-toast";
import RichTextEditor from "../../components/ui/RichTextEditor";
import axios from "axios";

const WriteArticle = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);
  const editSlug = new URLSearchParams(location.search).get("edit");

  const { data: existingArticle, isSuccess: isFetchSuccess } = useGetArticleBySlugQuery(editSlug, {
    skip: !editSlug
  });

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [summary, setSummary] = useState("");
  const [tags, setTags] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [createArticle] = useCreateArticleMutation();
  const [updateArticle] = useUpdateArticleMutation();

  useEffect(() => {
    if (isFetchSuccess && existingArticle) {
      setTitle(existingArticle.title);
      setContent(existingArticle.content);
      setSummary(existingArticle.summary);
      setTags(existingArticle.tags?.join(", ") || "");
      setCoverImage(existingArticle.coverImage || "");
    }
  }, [isFetchSuccess, existingArticle]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    setIsUploading(true);
    try {
      const response = await axios.post("/api/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true
      });
      
      const imageUrl = response.data.url;
      setCoverImage(imageUrl);
      toast.success("Image uploaded successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handlePublish = async (status = "published") => {
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
        tags: tags.split(",").map(tag => tag.trim()).filter(tag => tag !== ""),
        status
      };

      let result;
      if (editSlug && existingArticle) {
        result = await updateArticle({ id: existingArticle._id, ...articleData }).unwrap();
      } else {
        result = await createArticle(articleData).unwrap();
      }

      toast.success(status === "published" ? "Article published!" : "Draft saved!");
      if (status === "published") {
        navigate(`/articles/${result.slug}`);
      } else if (!editSlug) {
        navigate(`/write?edit=${result.slug}`, { replace: true });
      }
    } catch (err) {
      toast.error(err.data?.message || "Operation failed");
    } finally {
      setIsPublishing(false);
    }
  };

  if (isPreview) {
    return (
      <div className="pt-20 pb-20 max-w-[720px] mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Preview Mode</h2>
          <Button variant="outline" size="sm" onClick={() => setIsPreview(false)}>Edit</Button>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-6">{title || "Untitled"}</h1>
        <p className="text-xl text-muted-foreground mb-8 italic">{summary || "No summary provided."}</p>
        <div className="prose prose-lg dark:prose-invert font-serif" dangerouslySetInnerHTML={{ __html: content }} />
        <div className="mt-10 flex gap-2">
          {tags.split(",").map(t => t.trim()).filter(t => t).map(tag => (
            <span key={tag} className="px-3 py-1 bg-muted rounded-full text-xs">{tag}</span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="pt-16 pb-20 max-w-[800px] mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 border-b border-border pb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-muted rounded-full transition-colors">
              <Icon name="ArrowLeft" size={20} />
            </button>
            <h2 className="text-xl font-bold">{editSlug ? "Edit Article" : "Write Article"}</h2>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setIsPreview(true)} disabled={!content}>
              Preview
            </Button>
            <Button 
              onClick={() => handlePublish("draft")}
              loading={isPublishing}
              variant="outline"
              size="sm"
              className="rounded-full px-6"
            >
              Save Draft
            </Button>
            <Button 
              onClick={() => handlePublish("published")}
              loading={isPublishing}
              variant="default"
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white rounded-full px-6"
            >
              Publish
            </Button>
          </div>
        </div>

        <textarea
          placeholder="Title..."
          className="w-full text-4xl md:text-5xl font-bold bg-transparent border-none outline-none resize-none placeholder:text-muted-foreground/30 mb-4 h-auto"
          rows={1}
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            e.target.style.height = 'inherit';
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
        />

        <textarea
          placeholder="Short summary (for the feed)..."
          className="w-full text-xl md:text-2xl font-light bg-transparent border-none outline-none resize-none placeholder:text-muted-foreground/30 mb-10 text-muted-foreground"
          rows={1}
          value={summary}
          onChange={(e) => {
            setSummary(e.target.value);
            e.target.style.height = 'inherit';
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
        />

        <div className="space-y-4 mb-12 p-6 bg-muted/30 rounded-2xl border border-border">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Cover Image</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Image URL..."
                  className="flex-1 bg-background border border-border rounded-lg px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                />
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => fileInputRef.current.click()}
                  loading={isUploading}
                >
                  <Icon name="Upload" size={16} />
                </Button>
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
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Tags (comma separated)</label>
              <input 
                type="text" 
                placeholder="Exams, Tips, B.Tech"
                className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>
          </div>
        </div>

        <RichTextEditor 
          value={content} 
          onChange={setContent} 
          placeholder="Tell your story..." 
        />
      </div>

      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-card border border-border shadow-2xl rounded-full px-6 py-3 flex items-center gap-6">
        <button onClick={() => document.execCommand('formatBlock', false, 'h2')} className="text-muted-foreground hover:text-foreground transition-colors"><Icon name="Heading2" size={20} /></button>
        <button onClick={() => document.execCommand('bold')} className="text-muted-foreground hover:text-foreground transition-colors"><Icon name="Bold" size={20} /></button>
        <button onClick={() => document.execCommand('italic')} className="text-muted-foreground hover:text-foreground transition-colors"><Icon name="Italic" size={20} /></button>
        <button onClick={() => fileInputRef.current.click()} className="text-muted-foreground hover:text-foreground transition-colors"><Icon name="Image" size={20} /></button>
        <div className="w-px h-6 bg-border mx-2"></div>
        <button onClick={() => document.execCommand('insertOrderedList')} className="text-muted-foreground hover:text-foreground transition-colors"><Icon name="ListOrdered" size={20} /></button>
      </div>
    </>
  );
};

export default WriteArticle;
