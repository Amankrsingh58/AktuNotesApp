"use client";

import React, { useState } from "react";
import { Comment } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import Icon from "./Icons";
import toast from "react-hot-toast";

interface CommentSectionProps {
  articleId: string;
  authorId: string;
  initialComments: Comment[];
}

export default function CommentSection({
  articleId,
  authorId,
  initialComments,
}: CommentSectionProps) {
  const { user, isAuthenticated, setAuthModalOpen, setAuthModalView } = useAuth();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    try {
      const res = await api.post(`/articles/${articleId}/comments`, { text });
      setComments((prev) => [...prev, res.data]);
      setText("");
      toast.success("Comment added!");
    } catch (error) {
      toast.error("Failed to add comment");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    try {
      await api.delete(`/articles/${articleId}/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      toast.success("Comment deleted");
    } catch (error) {
      toast.error("Failed to delete comment");
    }
  };

  return (
    <div id="responses-section" className="mt-12 py-10 border-t border-border">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-bold text-foreground">
          Responses ({comments.length})
        </h3>
      </div>

      {/* Form */}
      {isAuthenticated ? (
        <div className="mb-8 p-4 bg-card border border-border shadow-sm rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <img
              src={
                user?.profilePic ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user?.name || "User"
                )}&background=random`
              }
              className="w-7 h-7 rounded-full object-cover"
              alt=""
            />
            <span className="text-xs font-medium">{user?.name}</span>
          </div>
          <form onSubmit={handleSubmit}>
            <textarea
              placeholder="What are your thoughts?"
              className="w-full min-h-[60px] bg-transparent border-none outline-none resize-none text-sm placeholder:text-muted-foreground mb-2 text-foreground"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="flex justify-end pt-3 border-t border-border">
              <button
                type="submit"
                disabled={loading || !text.trim()}
                className="px-4 py-1.5 bg-primary text-primary-foreground rounded-full text-xs font-medium hover:opacity-90 transition-all disabled:opacity-50"
              >
                {loading ? "Responding..." : "Respond"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="mb-12 p-10 bg-muted/30 rounded-xl border border-dashed border-border text-center">
          <p className="text-muted-foreground mb-4">Log in to join the conversation</p>
          <button
            onClick={() => {
              setAuthModalView("login");
              setAuthModalOpen(true);
            }}
            className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium border-none cursor-pointer"
          >
            Log In
          </button>
        </div>
      )}

      {/* Comment List */}
      <div className="space-y-10">
        {comments.length > 0 ? (
          [...comments].reverse().map((comment) => {
            const authorPic =
              comment.user?.profilePic ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                comment.user?.name || "User"
              )}&background=random`;

            const commentDateObj = new Date(comment.createdAt);
            const commentMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const commentDate = `${commentMonths[commentDateObj.getUTCMonth()]} ${commentDateObj.getUTCDate()}`;

            // Can delete if logged in user is either author of the article or comment writer
            const canDelete =
              user &&
              (user._id === comment.user?._id || user._id === authorId);

            return (
              <div key={comment._id} className="group">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={authorPic}
                      alt=""
                      className="w-8 h-8 rounded-full shadow-sm object-cover"
                    />
                    <div>
                      <p className="text-sm font-bold text-foreground">
                        {comment.user?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{commentDate}</p>
                    </div>
                  </div>
                  {canDelete && (
                    <button
                      onClick={() => handleDelete(comment._id)}
                      className="text-muted-foreground hover:text-red-500 transition-colors p-1"
                      title="Delete comment"
                    >
                      <Icon name="Trash2" size={16} />
                    </button>
                  )}
                </div>
                <p className="text-foreground leading-relaxed text-base mb-4 pl-11">
                  {comment.text}
                </p>
              </div>
            );
          })
        ) : (
          <div className="py-12 text-center border-t border-border mt-10">
            <p className="text-muted-foreground">
              No responses yet. Be the first to share your thoughts.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
