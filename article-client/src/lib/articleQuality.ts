type ArticleContent = {
  title?: string;
  summary?: string;
  content?: string;
};

export const MIN_ARTICLE_WORDS = 300;
export const MIN_ARTICLE_TITLE_LENGTH = 12;
export const MIN_ARTICLE_SUMMARY_LENGTH = 60;

export function getArticleWordCount(content = ""): number {
  const text = content
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&[a-z0-9#]+;/gi, " ")
    .trim();

  return text ? text.split(/\s+/).filter(Boolean).length : 0;
}

export function getArticleQualityIssue(article: ArticleContent): string | null {
  if ((article.title || "").trim().length < MIN_ARTICLE_TITLE_LENGTH) {
    return `Use a descriptive title of at least ${MIN_ARTICLE_TITLE_LENGTH} characters.`;
  }
  if ((article.summary || "").trim().length < MIN_ARTICLE_SUMMARY_LENGTH) {
    return `Write an informative summary of at least ${MIN_ARTICLE_SUMMARY_LENGTH} characters.`;
  }
  if (getArticleWordCount(article.content) < MIN_ARTICLE_WORDS) {
    return `Develop the article to at least ${MIN_ARTICLE_WORDS} meaningful words before publishing.`;
  }
  return null;
}

export function isArticleIndexable(article: ArticleContent): boolean {
  return getArticleQualityIssue(article) === null;
}
