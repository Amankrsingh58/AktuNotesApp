import React from "react";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleBySlug, getArticles } from "@/lib/api";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import AuthModal from "@/components/AuthModal";
import JsonLd from "@/components/JsonLd";
import InteractionBar from "@/components/InteractionBar";
import CommentSection from "@/components/CommentSection";
import AuthorFollow from "@/components/AuthorFollow";
import AuthorBanner from "@/components/AuthorBanner";
import Icon from "@/components/Icons";
import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site";
import { isArticleIndexable } from "@/lib/articleQuality";
import ArticleContent from "@/components/ArticleContent";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate Dynamic Meta Tags for SEO Optimization
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article Not Found",
      description: "The requested article could not be found.",
    };
  }

  const siteUrl = getSiteUrl();
  const ogImage = article.coverImage || `${siteUrl}/mainlogo2.png`;

  return {
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.summary,
    keywords: [
      ...(article.tags || []),
      "Cognora",
      "Tech Articles",
      "Software Engineering",
      "AI Insights",
    ],
    alternates: {
      canonical: `${siteUrl}/articles/${article.slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.summary,
      url: `/articles/${article.slug}`,
      type: "article",
      publishedTime: article.createdAt,
      modifiedTime: article.updatedAt,
      authors: [article.author?.name || "Author"],
      tags: article.tags,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.summary,
      images: [ogImage],
    },
    robots: isArticleIndexable(article)
      ? { index: true, follow: true }
      : { index: false, follow: true },
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  // Retrieve cookie header to forward user authentication context (for optional draft viewing)
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const article = await getArticleBySlug(slug, cookieHeader);

  if (!article) {
    notFound();
  }

  // Get all recommendations
  const allArticles = (await getArticles()).filter(
    (candidate) => candidate.status === "published" && isArticleIndexable(candidate)
  );
  const moreFromAuthor = allArticles
    .filter((a) => a.author?._id === article.author?._id && a._id !== article._id)
    .slice(0, 4);

  const recommendations = allArticles.filter((a) => a._id !== article._id).slice(0, 4);

  const siteUrl = getSiteUrl();

  // Create Article Schema Markup for Google Rich Results
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.title,
    "description": article.summary,
    "image": article.coverImage || `${siteUrl}/mainlogo2.png`,
    "datePublished": article.createdAt,
    "dateModified": article.updatedAt,
    "author": {
      "@type": "Person",
      "name": article.author?.name || "Author",
      "image": article.author?.profilePic,
    },
    "publisher": {
      "@type": "Organization",
      "name": "Cognora",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/mainlogo2.png`,
      },
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${siteUrl}/articles/${article.slug}`,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": siteUrl,
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Articles",
        "item": `${siteUrl}/`,
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": article.title,
        "item": `${siteUrl}/articles/${article.slug}`,
      },
    ],
  };

  const authorPic =
    article.author?.profilePic ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      article.author?.name || "Author"
    )}&background=random`;

  const formattedDate = new Date(article.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <AuthModal />
        <Header />
        <div className="flex pt-14">
          <Sidebar />
          <main className="flex-1 min-w-0">
            {/* Banner for Author edits/actions */}
            <AuthorBanner article={article} />

            <article className="pt-16 pb-20 max-w-[720px] mx-auto px-5 md:px-0">
              {/* Visible Breadcrumb Navigation */}
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                <span>/</span>
                <Link href="/" className="hover:text-foreground transition-colors">Articles</Link>
                <span>/</span>
                <span className="text-foreground truncate max-w-[200px]" title={article.title}>{article.title}</span>
              </nav>

              {/* Title */}
              <h1 className="text-[32px] md:text-[42px] font-bold text-foreground mb-6 leading-[1.2] tracking-tight">
                {article.title}
              </h1>

              {/* Summary */}
              <p className="text-xl md:text-2xl text-muted-foreground mb-6 font-light leading-snug">
                {article.summary}
              </p>

              {/* Author Info */}
              <div className="flex items-center justify-between mb-6 py-4 border-y border-border/50">
                <div className="flex items-center gap-4">
                  <img
                    src={authorPic}
                    alt={article.author?.name}
                    width={44}
                    height={44}
                    decoding="async"
                    className="w-11 h-11 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-[15px] font-medium text-foreground">
                        {article.author?.name}
                      </span>
                      <span className="text-muted-foreground">·</span>
                      <AuthorFollow
                        authorId={article.author?._id}
                        authorName={article.author?.name}
                      />
                    </div>
                    <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                      <span>{article.readTime || 1} min read</span>
                      <span>·</span>
                      <time dateTime={article.createdAt}>{formattedDate}</time>
                    </div>
                  </div>
                </div>

                {/* Dynamic Top Socials */}
                <div className="flex items-center gap-3 text-muted-foreground">
                  {article.author?.articleProfile?.socialLinks?.linkedin && (
                    <a
                      href={article.author.articleProfile.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-foreground transition-colors"
                      title="LinkedIn"
                    >
                      <Icon name="Linkedin" size={18} />
                    </a>
                  )}
                  {article.author?.articleProfile?.socialLinks?.twitter && (
                    <a
                      href={`https://twitter.com/${article.author.articleProfile.socialLinks.twitter.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-foreground transition-colors"
                      title="Twitter"
                    >
                      <Icon name="Twitter" size={18} />
                    </a>
                  )}
                  {article.author?.articleProfile?.socialLinks?.website && (
                    <a
                      href={article.author.articleProfile.socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-foreground transition-colors"
                      title="Website"
                    >
                      <Icon name="Globe" size={18} />
                    </a>
                  )}
                </div>
              </div>

              {/* Interaction Bar Top */}
              <InteractionBar
                articleId={article._id}
                articleSlug={article.slug}
                initialLikes={article.likes || []}
                commentsCount={article.comments?.length || 0}
              />

              {/* Cover Image */}
              {article.coverImage && (
                <figure className="mb-12 group relative">
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    width={1200}
                    height={630}
                    fetchPriority="high"
                    decoding="async"
                    className="w-full h-auto rounded-sm shadow-sm opacity-90 dark:opacity-80 transition-opacity group-hover:opacity-100"
                  />
                  {article.coverImage.startsWith("http") && (
                    <figcaption className="text-center text-sm text-muted-foreground mt-3 italic">
                      Image source:{" "}
                      {(() => {
                        try {
                          const url = new URL(article.coverImage);
                          return url.hostname.replace("www.", "");
                        } catch (e) {
                          return "External Source";
                        }
                      })()}
                    </figcaption>
                  )}
                </figure>
              )}

              {/* Main Content */}
              <ArticleContent html={article.content} />

              {/* Tags */}
              <div className="mt-16 flex flex-wrap gap-2 pb-10 border-b border-border/50">
                {article.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 bg-muted rounded-full text-sm text-foreground hover:bg-border transition-colors cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
                <a href={`mailto:amankrsingh58@gmail.com?subject=${encodeURIComponent(`Report article: ${article.title}`)}`} className="ml-auto px-3 py-2 text-xs font-medium text-muted-foreground hover:text-primary">Report this article</a>
              </div>

              {/* Author Bio Bottom */}
              <div className="mt-10 p-8 bg-card rounded-2xl border border-border/50 flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
                <img
                  src={authorPic}
                  alt={article.author?.name}
                  width={80}
                  height={80}
                  loading="lazy"
                  decoding="async"
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    Written by {article.author?.name}
                  </h3>
                  <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                    {article.author?.articleProfile?.bio ||
                      "An user sharing insights on Latest Technology."}
                  </p>
                  <div className="flex items-center justify-center md:justify-start gap-6 mt-4 flex-wrap">
                    <AuthorFollow
                      authorId={article.author?._id}
                      authorName={article.author?.name}
                      variant="button"
                    />
                    <div className="flex items-center gap-4 text-muted-foreground">
                      {article.author?.articleProfile?.socialLinks?.website && (
                        <a
                          href={article.author.articleProfile.socialLinks.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-foreground transition-colors"
                          title="Website"
                        >
                          <Icon name="Globe" size={18} />
                        </a>
                      )}
                      {article.author?.articleProfile?.socialLinks?.twitter && (
                        <a
                          href={`https://twitter.com/${article.author.articleProfile.socialLinks.twitter.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-foreground transition-colors"
                          title="Twitter"
                        >
                          <Icon name="Twitter" size={18} />
                        </a>
                      )}
                      {article.author?.articleProfile?.socialLinks?.linkedin && (
                        <a
                          href={article.author.articleProfile.socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-foreground transition-colors"
                          title="LinkedIn"
                        >
                          <Icon name="Linkedin" size={18} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Comments Section */}
              <CommentSection
                articleId={article._id}
                authorId={article.author?._id}
                initialComments={article.comments || []}
              />
            </article>

            {/* Recommendations Footer */}
            <footer className="bg-muted/30 border-t border-border/50 mt-20 py-20">
              <div className="max-w-[720px] mx-auto px-4 md:px-0">
                {/* More from Author */}
                {moreFromAuthor.length > 0 && (
                  <section className="mb-20">
                    <h3 className="text-xl font-bold text-foreground mb-8">
                      More from {article.author?.name}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {moreFromAuthor.map((art) => {
                        const recAuthorPic =
                          art.author?.profilePic ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            art.author?.name || "Author"
                          )}&background=random`;

                        return (
                          <div key={art._id} className="flex flex-col gap-4">
                            <Link href={`/articles/${art.slug}`}>
                              <div className="aspect-[16/9] w-full rounded-sm overflow-hidden bg-muted shadow-sm group relative">
                                <img
                                  src={art.coverImage || "/mainlogo2.png"}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                  alt={art.title}
                                  width={640}
                                  height={360}
                                  loading="lazy"
                                  decoding="async"
                                />
                              </div>
                            </Link>
                            <div className="flex items-center gap-2">
                              <img
                                src={recAuthorPic}
                                className="w-5 h-5 rounded-full object-cover"
                                alt={art.author?.name || "Author"}
                                width={20}
                                height={20}
                                loading="lazy"
                                decoding="async"
                              />
                              <span className="text-[13px] font-medium text-foreground">
                                {art.author?.name}
                              </span>
                            </div>
                            <Link href={`/articles/${art.slug}`}>
                              <h4 className="text-xl font-bold text-foreground leading-tight line-clamp-2 hover:underline cursor-pointer">
                                {art.title}
                              </h4>
                            </Link>
                            <p className="text-muted-foreground text-sm line-clamp-2">
                              {art.summary}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                )}

                {/* Recommended Section */}
                {recommendations.length > 0 && (
                  <section>
                    <h3 className="text-xl font-bold text-foreground mb-8">
                      Recommended
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {recommendations.map((art) => {
                        const recAuthorPic =
                          art.author?.profilePic ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            art.author?.name || "Author"
                          )}&background=random`;

                        return (
                          <div key={art._id} className="flex flex-col gap-4">
                            <Link href={`/articles/${art.slug}`}>
                              <div className="aspect-[16/9] w-full rounded-sm overflow-hidden bg-muted shadow-sm group relative">
                                <img
                                  src={art.coverImage || "/mainlogo2.png"}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                  alt={art.title}
                                  width={640}
                                  height={360}
                                  loading="lazy"
                                  decoding="async"
                                />
                              </div>
                            </Link>
                            <div className="flex items-center gap-2">
                              <img
                                src={recAuthorPic}
                                className="w-5 h-5 rounded-full object-cover"
                                alt={art.author?.name || "Author"}
                                width={20}
                                height={20}
                                loading="lazy"
                                decoding="async"
                              />
                              <span className="text-[13px] font-medium text-foreground">
                                {art.author?.name}
                              </span>
                            </div>
                            <Link href={`/articles/${art.slug}`}>
                              <h4 className="text-xl font-bold text-foreground leading-tight line-clamp-2 hover:underline cursor-pointer">
                                {art.title}
                              </h4>
                            </Link>
                            <p className="text-muted-foreground text-sm line-clamp-2">
                              {art.summary}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                )}
              </div>
            </footer>
          </main>
        </div>
      </div>
    </>
  );
}
