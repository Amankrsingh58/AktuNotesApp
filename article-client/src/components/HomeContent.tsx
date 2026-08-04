import Link from "next/link";
import { Article } from "@/lib/types";

export default function HomeContent({ articles }: { articles: Article[] }) {
  const published = articles.filter((article) => article.status === "published");
  const featured = [...published]
    .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
    .slice(0, 3);
  const latest = [...published]
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 4);
  const categories = Array.from(new Set(published.flatMap((article) => article.tags || []))).slice(0, 8);

  return (
    <div className="mt-20 space-y-20 border-t border-border/60 pt-16">
      <section aria-labelledby="about-cognora" className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-center">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">Knowledge for builders</p>
          <h2 id="about-cognora" className="text-3xl font-bold tracking-tight md:text-4xl">Understand technology, then put it to work</h2>
        </div>
        <p className="text-base leading-8 text-muted-foreground">
          Cognora is an open publishing community for useful perspectives on AI, software engineering, and emerging technology. Readers gain clear explanations, practical techniques, and informed viewpoints; authors gain a place to share tested ideas with curious professionals and learners.
        </p>
      </section>

      {featured.length > 0 && (
        <section aria-labelledby="featured-articles">
          <div className="mb-7 flex items-end justify-between gap-4">
            <div><p className="text-sm font-semibold text-primary">Editor’s picks</p><h2 id="featured-articles" className="mt-1 text-3xl font-bold">Featured articles</h2></div>
            <Link href="/?view=home" className="text-sm font-semibold text-primary hover:underline">Browse all</Link>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {featured.map((article) => (
              <article key={article._id} className="rounded-2xl border border-border/60 bg-card p-6">
                <p className="text-xs text-muted-foreground">{article.readTime || 1} min read</p>
                <h3 className="mt-3 text-xl font-bold leading-snug"><Link href={`/articles/${article.slug}`} className="hover:text-primary">{article.title}</Link></h3>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{article.summary}</p>
                <p className="mt-5 text-xs font-medium text-foreground">By {article.author?.name || "Cognora contributor"}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {categories.length > 0 && (
        <section aria-labelledby="categories">
          <h2 id="categories" className="text-3xl font-bold">Explore topics</h2>
          <p className="mt-2 text-muted-foreground">Find focused writing in the areas that matter to you.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {categories.map((category) => <Link key={category} href={`/?q=${encodeURIComponent(category)}`} className="rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium hover:border-primary hover:text-primary">{category}</Link>)}
          </div>
        </section>
      )}

      {latest.length > 0 && (
        <section aria-labelledby="latest-articles">
          <h2 id="latest-articles" className="text-3xl font-bold">Latest articles</h2>
          <div className="mt-6 divide-y divide-border/60 border-y border-border/60">
            {latest.map((article) => <article key={article._id} className="grid gap-2 py-5 sm:grid-cols-[1fr_auto] sm:items-center"><div><h3 className="text-lg font-semibold"><Link href={`/articles/${article.slug}`} className="hover:text-primary">{article.title}</Link></h3><p className="mt-1 text-sm text-muted-foreground">{article.author?.name || "Cognora contributor"} · <time dateTime={article.createdAt}>{new Date(article.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</time></p></div><span className="text-sm text-muted-foreground">{article.readTime || 1} min read</span></article>)}
          </div>
        </section>
      )}

      <section aria-labelledby="why-trust" className="rounded-3xl bg-muted/50 p-8 md:p-12">
        <h2 id="why-trust" className="text-3xl font-bold">Why readers trust Cognora</h2>
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          <div><h3 className="font-semibold">Real authors</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Every story shows its author, publication date, and reading time so you can assess its context.</p></div>
          <div><h3 className="font-semibold">Useful over noisy</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">We prioritize original explanations and practical experience over repetitive, search-first publishing.</p></div>
          <div><h3 className="font-semibold">Transparent platform</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Our <Link href="/about" className="text-primary hover:underline">mission</Link>, policies, and contact details are easy to find and understand.</p></div>
        </div>
      </section>

      <section className="rounded-3xl border border-primary/20 bg-primary/5 px-6 py-12 text-center md:px-12">
        <h2 className="text-3xl font-bold">Have something worth sharing?</h2>
        <p className="mx-auto mt-3 max-w-xl leading-7 text-muted-foreground">Turn your experience into a clear, useful article for the Cognora community.</p>
        <Link href="/write" className="mt-7 inline-flex rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90">Start writing</Link>
      </section>
    </div>
  );
}
