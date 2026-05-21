import React, { useMemo } from "react";
import { Link, useNavigate, useLocation, useOutletContext } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Icon from "../../components/AppIcon";
import { useGetArticlesQuery, useGetUserArticlesQuery } from "../../features/articles/articleApi";
import { clearUserAuth, openAuthModal } from "../../store/slices/userSlice";
import SEO from "../../components/SEO";
import toast from "react-hot-toast";

const Articles = () => {
  const { activeView, setActiveView } = useOutletContext();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("q") || "";

  const isUserAuthenticated = useSelector((state) => state.userAuth.isUserAuthenticated);
  const userInfo = useSelector((state) => state.userAuth.userInfo);

  const { data: apiArticles, isLoading } = useGetArticlesQuery();
  const { data: userArticles, isLoading: isUserArticlesLoading } = useGetUserArticlesQuery(undefined, {
    skip: activeView !== "profile" && !isUserAuthenticated
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [bookmarkedArticles, setBookmarkedArticles] = React.useState(() => {
    return JSON.parse(localStorage.getItem('bookmarked_articles') || '[]');
  });

  const toggleBookmark = (slug) => {
    let saved = [...bookmarkedArticles];
    if (saved.includes(slug)) {
      saved = saved.filter(id => id !== slug);
      toast.success("Removed from bookmarks");
    } else {
      saved.push(slug);
      toast.success("Article bookmarked!");
    }
    localStorage.setItem('bookmarked_articles', JSON.stringify(saved));
    setBookmarkedArticles(saved);
  };

  const [feedTab, setFeedTab] = React.useState("for-you");

  const articles = useMemo(() => {
    let baseArticles = [...(apiArticles || [])].filter(a => a.status !== "draft");

    // Filter by Tab
    if (feedTab === "following") {
      baseArticles = baseArticles.filter(art => 
        userInfo?.following?.includes(art.author?._id)
      );
    } else if (feedTab === "top") {
      baseArticles = baseArticles.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
    }

    // Filter by Search Query
    if (!searchQuery) return baseArticles;
    
    const query = searchQuery.toLowerCase();
    return baseArticles.filter(art => 
      art.title.toLowerCase().includes(query) || 
      art.summary.toLowerCase().includes(query) ||
      art.tags?.some(tag => tag.toLowerCase().includes(query))
    );
  }, [apiArticles, searchQuery, feedTab, userInfo]);

  // ─── Content Views ─────────────────────────────────────────

  const renderFeed = () => (
    <div className="flex-1 min-w-0 lg:max-w-[720px]">
      <div className="flex items-center gap-8 border-b border-border mb-8 overflow-x-auto scrollbar-hide">
        <button 
          onClick={() => setFeedTab("for-you")}
          className={`pb-4 text-sm font-medium whitespace-nowrap transition-all border-b-2 ${feedTab === "for-you" ? "text-foreground border-primary" : "text-muted-foreground border-transparent hover:text-foreground"}`}
        >
          For you
        </button>
        <button 
          onClick={() => setFeedTab("following")}
          className={`pb-4 text-sm font-medium whitespace-nowrap transition-all border-b-2 ${feedTab === "following" ? "text-foreground border-primary" : "text-muted-foreground border-transparent hover:text-foreground"}`}
        >
          Following
        </button>
        <button 
          onClick={() => setFeedTab("top")}
          className={`pb-4 text-sm font-medium whitespace-nowrap transition-all border-b-2 ${feedTab === "top" ? "text-foreground border-primary" : "text-muted-foreground border-transparent hover:text-foreground"}`}
        >
          Top Articles
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-12">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse flex gap-6">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-muted rounded-full"></div>
                  <div className="h-4 bg-muted rounded w-24"></div>
                </div>
                <div className="h-8 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
              </div>
              <div className="w-28 md:w-40 h-28 md:h-28 bg-muted rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-12">
          {articles?.length === 0 ? (
            <div className="py-20 text-center">
              <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Search" size={24} className="text-muted-foreground" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1">No articles found</h3>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                {feedTab === "following" ? "Follow some authors to see their latest stories here." : "Try adjusting your search or check back later."}
              </p>
              {feedTab === "following" && (
                <button 
                  onClick={() => setFeedTab("for-you")}
                  className="mt-6 text-primary font-bold text-sm hover:underline"
                >
                  Explore popular articles
                </button>
              )}
            </div>
          ) : (
            articles?.map((article) => (
            <article key={article._id} className="group border-b border-border/50 pb-12 last:border-0">
              <div className="flex gap-4 md:gap-12 items-start">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-3">
                    <img 
                      src={article.author?.profilePic || `https://ui-avatars.com/api/?name=${article.author?.name}&background=random`} 
                      alt={article.author?.name}
                      className="w-5 h-5 rounded-full"
                    />
                    <span className="text-[13px] font-medium text-foreground">{article.author?.name}</span>
                    {/* <span className="text-[13px] text-muted-foreground">in</span>
                    <span className="text-[13px] font-medium text-foreground">AKTU Notes</span> */}
                    <span className="text-[13px] text-muted-foreground">·</span>
                    <span className="text-[13px] text-muted-foreground">
                      {new Date(article.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  
                  <Link to={`/articles/${article.slug}`}>
                    <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors leading-tight tracking-tight">
                      {article.title}
                    </h2>
                  </Link>
                  
                  <p className="text-muted-foreground line-clamp-2 mb-6 text-base font-normal leading-relaxed">
                    {article.summary}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-y-2 mt-4">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
                      <span className="flex items-center gap-1 text-[13px] text-muted-foreground">
                        <Icon name="Star" size={14} className="text-amber-500 fill-amber-500" />
                      </span>
                      <span className="text-[13px] text-muted-foreground">{article.readTime || 1} min read</span>
                      <span className="hidden sm:inline-block px-2 py-1 bg-muted rounded-full text-[12px] text-foreground">
                        {article.tags?.[0] || 'Education'}
                      </span>
                      <span className="flex items-center gap-1 text-[13px] text-muted-foreground">
                        <Icon name="Heart" size={14} className={article.likes?.includes(userInfo?.id) ? "text-red-500 fill-current" : ""} />
                        {article.likes?.length || 0}
                      </span>
                      <span className="flex items-center gap-1 text-[13px] text-muted-foreground">
                        <Icon name="MessageCircle" size={14} />
                        {article.comments?.length || 0}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => toggleBookmark(article.slug)}
                        className={`transition-colors ${bookmarkedArticles.includes(article.slug) ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                      >
                        <Icon name="Bookmark" size={20} className={bookmarkedArticles.includes(article.slug) ? 'fill-current' : ''} />
                      </button>
                    </div>
                  </div>
                </div>

                {article.coverImage && (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-40 md:h-28 shrink-0">
                    <img 
                      src={article.coverImage} 
                      alt={article.title}
                      className="w-full h-full object-cover rounded shadow-sm opacity-90 dark:opacity-80"
                    />
                  </div>
                )}
              </div>
            </article>
          )))}
        </div>
      )}
    </div>
  );

  const renderProfile = () => (
    <div className="flex-1 min-w-0 lg:max-w-[720px]">
      <div className="flex flex-col items-center text-center py-8 mb-8 border-b border-border">
        <img
          src={userInfo?.profilePic || `https://ui-avatars.com/api/?name=${userInfo?.name || "User"}&background=random&size=96`}
          alt={userInfo?.name || "User"}
          className="w-20 h-20 rounded-full mb-4 ring-2 ring-primary/20"
        />
        <h2 className="text-2xl font-bold text-foreground mb-1">
          {userInfo?.name || "Anonymous User"}
        </h2>
        <p className="text-muted-foreground text-sm mb-4">
          {userInfo?.email || "No email set"}
        </p>
        {isUserAuthenticated ? (
          <Link
            to="/write"
            className="inline-flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-colors no-underline"
          >
            <Icon name="Edit3" size={16} />
            Write your first article
          </Link>
        ) : (
          <button
            onClick={() => dispatch(openAuthModal('signup'))}
            className="inline-flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-colors border-none cursor-pointer"
          >
            <Icon name="Edit3" size={16} />
            Write your first article
          </button>
        )}
      </div>

      <div>
        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-6">
          Your Articles
        </h3>
        
        {isUserArticlesLoading ? (
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="animate-pulse h-24 bg-muted rounded-xl"></div>
            ))}
          </div>
        ) : userArticles?.length > 0 ? (
          <div className="space-y-4">
            {userArticles.map(article => (
              <Link
                key={article._id}
                to={`/articles/${article.slug}`}
                className="group flex gap-4 p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-muted/30 transition-all no-underline"
              >
                {article.coverImage && (
                  <img src={article.coverImage} className="w-20 h-20 object-cover rounded-lg" alt="" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">{article.title}</h4>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(`/write?edit=${article.slug}`);
                      }}
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{article.summary}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                    <span>·</span>
                    <span className="capitalize">{article.status}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Icon name="FileText" size={28} className="text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm mb-2">You haven't published any articles yet.</p>
            <p className="text-muted-foreground/60 text-xs">Start writing and share your knowledge with everyone!</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderArticles = () => (
    <div className="flex-1 min-w-0 lg:max-w-[720px]">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-foreground tracking-tight">Explore Articles</h2>
        {isUserAuthenticated ? (
          <Link
            to="/write"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors no-underline"
          >
            <Icon name="PlusCircle" size={18} />
            New Article
          </Link>
        ) : (
          <button
            onClick={() => dispatch(openAuthModal('signup'))}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors border-none bg-transparent cursor-pointer"
          >
            <Icon name="PlusCircle" size={18} />
            New Article
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="animate-pulse flex gap-4">
              <div className="w-20 h-20 bg-muted rounded-lg shrink-0"></div>
              <div className="flex-1 space-y-3">
                <div className="h-5 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-3 bg-muted rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {articles?.map((article) => (
            <Link
              key={article._id}
              to={`/articles/${article.slug}`}
              className="group flex gap-5 p-4 -mx-4 rounded-xl hover:bg-muted/50 transition-all no-underline"
            >
              {article.coverImage && (
                <div className="w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-lg overflow-hidden">
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-base md:text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-1 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                  {article.summary}
                </p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="font-medium">{article.author?.name}</span>
                  <span>·</span>
                  <span>{new Date(article.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  <span className="px-2 py-0.5 bg-muted rounded-full">{article.tags?.[0] || 'Education'}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );

  const renderMainContent = () => {
    switch (activeView) {
      case "profile":
        return renderProfile();
      case "articles":
        return renderArticles();
      case "home":
      default:
        return renderFeed();
    }
  };

  return (
    <>
      <SEO 
        title="Articles - AKTU Notes" 
        description="Read the latest articles on AKTU exams, engineering tips, and student life."
        path="/articles"
      />
      
      <div className="pb-20 max-w-[1300px] mx-auto px-4 md:px-8 pt-8">
        <div className="flex flex-col justify-center lg:flex-row gap-12">
          {renderMainContent()}

          <aside className="hidden lg:block lg:w-[360px] border-l border-border pl-12 h-fit sticky top-24">
             <div className="space-y-10">
                <div>
                  <h3 className="text-sm font-bold text-foreground mb-4">Staff Picks</h3>
                  <div className="space-y-6">
                     {(apiArticles || []).slice(0, 3).map(art => (
                       <div key={art._id} className="group cursor-pointer">
                         <div className="flex items-center gap-2 mb-1">
                           <img 
                             src={art.author?.profilePic || `https://ui-avatars.com/api/?name=${art.author?.name}&background=random`} 
                             className="w-5 h-5 rounded-full" 
                             alt="" 
                           />
                           <span className="text-xs font-medium text-foreground">{art.author?.name}</span>
                         </div>
                         <Link to={`/articles/${art.slug}`}>
                           <h4 className="text-sm font-bold text-foreground group-hover:underline">
                             {art.title}
                           </h4>
                         </Link>
                       </div>
                     ))}
                  </div>
                </div>



               <div className="p-6 bg-primary/10 rounded-xl border border-primary/20">
                 <h4 className="font-bold text-foreground mb-2">Writing on AKTU Notes</h4>
                 <p className="text-sm text-muted-foreground mb-4">Share your student journey or exam tips with everyone.</p>
                 {isUserAuthenticated ? (
                   <Link 
                     to="/write" 
                     className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:opacity-90 transition-all no-underline"
                   >
                     Start writing
                   </Link>
                 ) : (
                   <button 
                     onClick={() => dispatch(openAuthModal('signup'))}
                     className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:opacity-90 transition-all border-none cursor-pointer"
                   >
                     Start writing
                   </button>
                 )}
               </div>
             </div>
          </aside>
        </div>
      </div>
    </>
  );
};

export default Articles;
