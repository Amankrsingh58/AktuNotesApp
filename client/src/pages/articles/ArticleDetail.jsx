import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import ArticleHeader from "../../components/ui/ArticleHeader";
import Icon from "../../components/AppIcon";
import { 
  useGetArticleBySlugQuery, 
  useGetArticlesQuery,
  useLikeArticleMutation, 
  useUpdateArticleMutation,
  useAddCommentMutation, 
  useFollowUserMutation,
  useDeleteArticleMutation
} from "../../features/articles/articleApi";
import SEO from "../../components/SEO";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateFollowing } from "../../store/slices/userSlice";

const ArticleDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { userInfo, isUserAuthenticated } = useSelector(state => state.userAuth);
  const { data: article, isLoading } = useGetArticleBySlugQuery(slug);
  const { data: allArticles } = useGetArticlesQuery();
  
  const [likeArticle] = useLikeArticleMutation();
  const [updateArticle] = useUpdateArticleMutation();
  const [addComment] = useAddCommentMutation();
  const [followUser] = useFollowUserMutation();
  const [deleteArticle] = useDeleteArticleMutation();

  const [commentText, setCommentText] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublishDraft = async () => {
    setIsPublishing(true);
    try {
      await updateArticle({ id: article._id, status: "published" }).unwrap();
      toast.success("Article published!");
    } catch (err) {
      toast.error("Failed to publish article");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this article? This action cannot be undone.")) {
      try {
        await deleteArticle(article._id).unwrap();
        toast.success("Article deleted successfully");
        navigate("/articles");
      } catch (err) {
        toast.error(err.data?.message || "Failed to delete article");
      }
    }
  };

  const handleLike = async () => {
    if (!isUserAuthenticated) return toast.error("Please login to like articles");
    try {
      await likeArticle(article._id).unwrap();
    } catch (err) {
      toast.error("Failed to like article");
    }
  };

  const dispatch = useDispatch();

  const handleFollow = async () => {
    if (!isUserAuthenticated) return toast.error("Please login to follow authors");
    try {
      const result = await followUser(article.author._id).unwrap();
      if (result.following) {
        dispatch(updateFollowing(result.following));
      }
      toast.success(result.message || "Author followed!");
    } catch (err) {
      toast.error("Failed to follow author");
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      await addComment({ id: article._id, text: commentText }).unwrap();
      setCommentText("");
      toast.success("Comment added!");
    } catch (err) {
      toast.error("Failed to add comment");
    }
  };

  const [isBookmarked, setIsBookmarked] = useState(() => {
    const saved = localStorage.getItem('bookmarked_articles');
    if (saved) {
      return JSON.parse(saved).includes(slug);
    }
    return false;
  });

  const handleBookmark = () => {
    let saved = JSON.parse(localStorage.getItem('bookmarked_articles') || '[]');
    if (isBookmarked) {
      saved = saved.filter(id => id !== slug);
      toast.success("Removed from bookmarks");
    } else {
      saved.push(slug);
      toast.success("Article bookmarked!");
    }
    localStorage.setItem('bookmarked_articles', JSON.stringify(saved));
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  if (isLoading && !article) {
    return (
      <div className="pt-20 max-w-3xl mx-auto px-4 animate-pulse">
        <div className="h-12 bg-gray-200 rounded w-3/4 mb-6"></div>
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-12"></div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center pt-32 h-screen">
        <h1 className="text-2xl font-bold">Article Not Found</h1>
        <Link to="/articles" className="mt-4 text-primary underline">Back to Articles</Link>
      </div>
    );
  }

  const isLiked = article.likes?.includes(userInfo?.id);
  const isFollowing = userInfo?.following?.includes(article.author?._id);

  return (
    <>
      <SEO 
        title={`${article.title}`} 
        description={article.summary}
        path={`/articles/${article.slug}`}
      />

      {/* Author Controls Banner (Visible for both draft and published if author) */}
      {article.author?._id === userInfo?.id && (
        <div className={`sticky top-16 z-40 border-y py-3 ${article.status === 'draft' ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/50' : 'bg-muted/30 border-border'}`}>
          <div className="max-w-[720px] mx-auto px-4 md:px-0 flex items-center justify-between">
            <div className={`flex items-center gap-2 text-sm font-medium ${article.status === 'draft' ? 'text-amber-800 dark:text-amber-200' : 'text-muted-foreground'}`}>
              <Icon name={article.status === 'draft' ? "FileText" : "ShieldCheck"} size={16} />
              <span>{article.status === 'draft' ? "This is a draft. Only you can see it." : "You are the author of this article."}</span>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate(`/write?edit=${article.slug}`)}
                className="text-xs font-bold hover:underline"
              >
                Edit
              </button>
              {article.status === "published" && (
                <button 
                  onClick={async () => {
                    if (window.confirm("Move this article back to drafts? It will no longer be public.")) {
                      try {
                        await updateArticle({ id: article._id, status: "draft" }).unwrap();
                        toast.success("Article moved to drafts");
                      } catch (err) {
                        toast.error("Failed to unpublish article");
                      }
                    }
                  }}
                  className="text-xs font-bold text-amber-600 hover:underline flex items-center gap-1"
                >
                  <Icon name="FileText" size={14} />
                  Unpublish
                </button>
              )}
              <button 
                onClick={handleDelete}
                className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1"
              >
                <Icon name="Trash2" size={14} />
                Delete
              </button>
              {article.status === "draft" && (
                <button 
                  onClick={handlePublishDraft}
                  disabled={isPublishing}
                  className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-full transition-all disabled:opacity-50"
                >
                  {isPublishing ? "Publishing..." : "Publish"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      
      <article className="pt-16 pb-20 max-w-[720px] mx-auto px-4 md:px-0">
        {/* Title */}
        <h1 className="text-[32px] md:text-[42px] font-bold text-foreground mb-6 leading-[1.2] tracking-tight">
          {article.title}
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground mb-6 font-light leading-snug">
          {article.summary}
        </p>

        {/* Author & Meta */}
        <div className="flex items-center justify-between mb-6 py-4 border-y border-border">
          <div className="flex items-center gap-4">
            <img 
              src={article.author?.profilePic || `https://ui-avatars.com/api/?name=${article.author?.name}&background=random`} 
              alt={article.author?.name}
              className="w-11 h-11 rounded-full"
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-medium text-foreground">{article.author?.name}</span>
                <span className="text-muted-foreground">·</span>
                {article.author?._id === userInfo?.id ? (
                  <button 
                    onClick={() => navigate(`/write?edit=${article.slug}`)}
                    className="text-[15px] font-medium text-primary hover:text-foreground transition-colors"
                  >
                    Edit
                  </button>
                ) : (
                  <button 
                    onClick={handleFollow}
                    className={`text-[15px] font-medium transition-colors ${isFollowing ? 'text-muted-foreground' : 'text-primary hover:text-foreground'}`}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                <span>{article.readTime || 1} min read</span>
                <span>·</span>
                <span>{new Date(article.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-muted-foreground">
            <button className="hover:text-foreground transition-colors"><Icon name="Linkedin" size={20} /></button>
          </div>
        </div>


        {/* Interaction Bar Top */}
        <div className="flex items-center justify-between mb-10 text-muted-foreground">
           <div className="flex items-center gap-6">
             <button 
               onClick={handleLike}
               className={`flex items-center gap-1 transition-colors ${isLiked ? 'text-red-500' : 'hover:text-foreground'}`}
             >
               <Icon name="Heart" size={20} className={isLiked ? 'fill-current' : ''} />
               <span className="text-sm">{article.likes?.length || 0}</span>
             </button>
             <button 
               onClick={() => document.getElementById('responses-section')?.scrollIntoView({ behavior: 'smooth' })}
               className="flex items-center gap-1 hover:text-foreground transition-colors"
             >
               <Icon name="MessageCircle" size={20} />
               <span className="text-sm">{article.comments?.length || 0}</span>
             </button>
           </div>
           <div className="flex items-center gap-4">
             <button 
               onClick={handleBookmark}
               className={`transition-colors ${isBookmarked ? 'text-primary' : 'hover:text-foreground'}`}
             >
               <Icon name="Bookmark" size={20} className={isBookmarked ? 'fill-current' : ''} />
             </button>
             <button 
               onClick={handleShare}
               className="hover:text-foreground transition-colors"
             >
               <Icon name="Share" size={20} />
             </button>
           </div>
        </div>

        {/* Cover Image */}
        {article.coverImage && (
          <figure className="mb-12 group relative">
            <img 
              src={article.coverImage} 
              alt={article.title}
              className="w-full h-auto rounded-sm shadow-sm opacity-90 dark:opacity-80 transition-opacity group-hover:opacity-100"
            />
            {article.coverImage.startsWith('http') && (
              <figcaption className="text-center text-sm text-muted-foreground mt-3 italic">
                Image source: {(() => {
                  try {
                    const url = new URL(article.coverImage);
                    return url.hostname.replace('www.', '');
                  } catch (e) {
                    return 'External Source';
                  }
                })()}
              </figcaption>
            )}
          </figure>
        )}

        {/* Content */}
        <div 
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: article.content }} 
        />

        {/* Tags */}
        <div className="mt-16 flex flex-wrap gap-2 pb-10 border-b border-border">
          {article.tags?.map(tag => (
            <span key={tag} className="px-4 py-2 bg-muted rounded-full text-sm text-foreground hover:bg-border transition-colors cursor-pointer">
              {tag}
            </span>
          ))}
        </div>

        {/* Author Bio Bottom (Moved up) */}
        <div className="mt-10 p-8 bg-card rounded-2xl border border-border flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
           <img 
              src={article.author?.profilePic || `https://ui-avatars.com/api/?name=${article.author?.name}&background=random`} 
              alt={article.author?.name}
              className="w-20 h-20 rounded-full"
            />
            <div className="flex-1">
              <h3 className="text-xl font-bold text-foreground mb-2">Written by {article.author?.name}</h3>
              <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                {article.author?.articleProfile?.bio || "An engineering student sharing insights on AKTU exams and student life."}
              </p>
              <div className="flex items-center justify-center md:justify-start gap-4">
                <button 
                  onClick={handleFollow}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${isFollowing ? 'bg-muted text-muted-foreground border border-border' : 'bg-primary text-primary-foreground hover:opacity-90'}`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
                <div className="flex gap-3 text-muted-foreground">
                  <Icon name="Twitter" size={18} className="cursor-pointer hover:text-foreground" />
                  <Icon name="Linkedin" size={18} className="cursor-pointer hover:text-foreground" />
                </div>
              </div>
            </div>
        </div>

        {/* In-Page Responses Section (Moved down) */}
        <div id="responses-section" className="mt-12 py-10 border-t border-border">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-foreground">
              Responses ({article.comments?.length || 0})
            </h3>
            <div className="flex gap-4">
               <button className="text-muted-foreground hover:text-foreground"><Icon name="Bell" size={20} /></button>
               <button className="text-muted-foreground hover:text-foreground"><Icon name="MoreHorizontal" size={20} /></button>
            </div>
          </div>

          {/* Comment Form */}
          {isUserAuthenticated ? (
            <div className="mb-8 p-4 bg-card border border-border shadow-sm rounded-xl">
               <div className="flex items-center gap-2 mb-3">
                  <img 
                    src={userInfo?.profilePic || `https://ui-avatars.com/api/?name=${userInfo?.name || "User"}&background=random`} 
                    className="w-7 h-7 rounded-full" 
                    alt="" 
                  />
                  <span className="text-xs font-medium">{userInfo?.name}</span>
               </div>
               <form onSubmit={handleAddComment}>
                 <textarea 
                    placeholder="What are your thoughts?"
                    className="w-full min-h-[60px] bg-transparent border-none outline-none resize-none text-sm placeholder:text-muted-foreground mb-2"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                 />
                 <div className="flex justify-end pt-3 border-t border-border">
                    <button 
                      type="submit"
                      disabled={!commentText.trim()}
                      className="px-4 py-1.5 bg-primary text-primary-foreground rounded-full text-xs font-medium hover:opacity-90 transition-all disabled:opacity-50"
                    >
                      Respond
                    </button>
                 </div>
               </form>
            </div>
          ) : (
            <div className="mb-12 p-10 bg-muted/30 rounded-xl border border-dashed border-border text-center">
              <p className="text-muted-foreground mb-4">Log in to join the conversation</p>
              <Link to="/login" className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium no-underline">Log In</Link>
            </div>
          )}

          {/* Comment List */}
          <div className="space-y-10">
            {article.comments?.length > 0 ? (
              article.comments.slice().reverse().map((comment, idx) => (
                <div key={idx} className="group">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <img 
                        src={comment.user?.profilePic || `https://ui-avatars.com/api/?name=${comment.user?.name}&background=random`} 
                        alt="" 
                        className="w-8 h-8 rounded-full shadow-sm"
                      />
                      <div>
                        <p className="text-sm font-bold text-foreground">{comment.user?.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground">
                      <Icon name="MoreHorizontal" size={18} />
                    </button>
                  </div>
                  <p className="text-foreground leading-relaxed text-base mb-4 pl-11">
                    {comment.text}
                  </p>
                  <div className="flex items-center gap-6 pl-11 text-muted-foreground">
                    <button className="flex items-center gap-1.5 hover:text-foreground transition-colors text-sm">
                      <Icon name="Heart" size={16} />
                      <span>{Math.floor(Math.random() * 50)}</span>
                    </button>
                    <button className="flex items-center gap-1.5 hover:text-foreground transition-colors text-sm">
                      <Icon name="MessageCircle" size={16} />
                      <span>Reply</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center border-t border-border mt-10">
                <p className="text-muted-foreground">No responses yet. Be the first to share your thoughts.</p>
              </div>
            )}
          </div>
        </div>
      </article>

      {/* Footer Sections (Matching Article Width) */}
      <footer className="bg-muted/30 border-t border-border mt-20 py-20">
        <div className="max-w-[720px] mx-auto px-4 md:px-0">
           {/* More from Author */}
           {allArticles?.filter(a => a.author?._id === article.author?._id && a._id !== article._id).length > 0 && (
             <section className="mb-20">
                <h3 className="text-xl font-bold text-foreground mb-8">
                  More from {article.author?.name}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {allArticles.filter(a => a.author?._id === article.author?._id && a._id !== article._id).slice(0, 4).map(art => (
                     <div key={art._id} className="flex flex-col gap-4">
                        <Link to={`/articles/${art.slug}`}>
                          <div className="aspect-[16/9] w-full rounded-sm overflow-hidden bg-muted shadow-sm group">
                             <img 
                               src={art.coverImage || "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1000&auto=format&fit=crop"} 
                               className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                               alt="" 
                             />
                          </div>
                        </Link>
                        <div className="flex items-center gap-2">
                          <img src={art.author?.profilePic || `https://ui-avatars.com/api/?name=${art.author?.name}&background=random`} className="w-5 h-5 rounded-full" alt="" />
                          <span className="text-[13px] font-medium text-foreground">{art.author?.name}</span>
                          <span className="text-[13px] text-muted-foreground">·</span>
                          <span className="text-[13px] text-muted-foreground">
                            {new Date(art.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <Link to={`/articles/${art.slug}`}>
                          <h4 className="text-xl font-bold text-foreground leading-tight line-clamp-2 hover:underline cursor-pointer">
                            {art.title}
                          </h4>
                        </Link>
                        <p className="text-muted-foreground text-sm line-clamp-2">
                          {art.summary}
                        </p>
                        <div className="flex items-center justify-between mt-2 text-muted-foreground">
                          <div className="flex items-center gap-4 text-xs">
                             <span className="text-[13px]">{art.readTime || 1} min read</span>
                             <span className="flex items-center gap-1"><Icon name="Heart" size={14} /> {art.likes?.length || 0}</span>
                             <span className="flex items-center gap-1"><Icon name="MessageCircle" size={14} /> {art.comments?.length || 0}</span>
                          </div>
                        </div>
                     </div>
                   ))}
                </div>
                <hr className="mt-12 mb-8 border-border" />
                <Link to="/articles" className="w-full md:w-fit ml-0 block px-10 py-2.5 border border-primary/20 text-primary text-center text-sm font-medium rounded-full hover:bg-primary/5 transition-all no-underline">
                  Show all from {article.author?.name}
                </Link>
             </section>
           )}

           {/* Recommended */}
           <section>
              <h3 className="text-xl font-bold text-foreground mb-8">
                Recommended
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {(allArticles || []).filter(a => a._id !== article._id).slice(0, 4).map(art => (
                    <div key={art._id} className="flex flex-col gap-4">
                       <Link to={`/articles/${art.slug}`}>
                         <div className="aspect-[16/9] w-full rounded-sm overflow-hidden bg-muted shadow-sm group">
                            <img 
                              src={art.coverImage || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1000&auto=format&fit=crop"} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                              alt="" 
                            />
                         </div>
                       </Link>
                       <div className="flex items-center gap-2">
                         <img src={art.author?.profilePic || `https://ui-avatars.com/api/?name=${art.author?.name}&background=random`} className="w-5 h-5 rounded-full" alt="" />
                         <span className="text-[13px] font-medium text-foreground">{art.author?.name}</span>
                         <span className="text-[13px] text-muted-foreground">·</span>
                         <span className="text-[13px] text-muted-foreground">
                           {new Date(art.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                         </span>
                       </div>
                       <Link to={`/articles/${art.slug}`}>
                         <h4 className="text-xl font-bold text-foreground leading-tight line-clamp-2 hover:underline cursor-pointer">
                           {art.title}
                         </h4>
                       </Link>
                       <p className="text-muted-foreground text-sm line-clamp-2">
                         {art.summary}
                       </p>
                       <div className="flex items-center justify-between mt-2 text-muted-foreground">
                         <div className="flex items-center gap-4 text-xs">
                            <span className="text-[13px]">{art.readTime || 1} min read</span>
                            <span className="flex items-center gap-1"><Icon name="Heart" size={14} /> {art.likes?.length || 0}</span>
                            <span className="flex items-center gap-1"><Icon name="MessageCircle" size={14} /> {art.comments?.length || 0}</span>
                         </div>
                       </div>
                    </div>
                 ))}
              </div>
              <hr className="mt-12 mb-8 border-border" />
              <Link to="/articles" className="w-full md:w-fit ml-0 block px-10 py-2.5 border border-primary/20 text-primary text-center text-sm font-medium rounded-full hover:bg-primary/5 transition-all no-underline">
                Show all recommendations
              </Link>
           </section>
        </div>
      </footer>
    </>
  );
};

export default ArticleDetail;
