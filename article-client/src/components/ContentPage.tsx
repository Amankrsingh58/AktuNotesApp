import Link from "next/link";
import Header from "./Header";
import SiteFooter from "./SiteFooter";
import JsonLd from "./JsonLd";

interface ContentPageProps {
  title: string;
  description: string;
  path: string;
  updated?: string;
  children: React.ReactNode;
  schemaType?: "AboutPage" | "ContactPage" | "FAQPage" | "WebPage";
  schema?: Record<string, unknown>;
}

const contentNavigation = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/cookie-policy", label: "Cookies" },
];

export default function ContentPage({
  title,
  description,
  path,
  updated,
  children,
  schemaType = "WebPage",
  schema,
}: ContentPageProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cognora.in";
  const pageSchema = schema || {
    "@context": "https://schema.org",
    "@type": schemaType,
    name: title,
    description,
    url: `${siteUrl}${path}`,
    isPartOf: { "@type": "WebSite", name: "Cognora", url: siteUrl },
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <JsonLd data={pageSchema} />
      <Header />
      <main className="pb-24 pt-14">
        <section className="relative overflow-hidden border-b border-border/60 bg-card/60">
          <div aria-hidden="true" className="absolute -right-24 -top-28 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div aria-hidden="true" className="absolute -bottom-32 left-1/4 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
          <div className="relative mx-auto max-w-[1200px] px-5 py-12 md:px-8 md:py-16">
            <nav aria-label="Breadcrumb" className="mb-7 flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/" className="rounded-md transition-colors hover:text-primary">Home</Link>
              <span aria-hidden="true" className="text-border">/</span>
              <span aria-current="page" className="font-medium text-foreground">{title}</span>
            </nav>
            <div className="max-w-[820px]">
              <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                Cognora information
              </span>
              <h1 className="mt-5 text-4xl font-bold tracking-[-0.035em] text-foreground md:text-6xl">{title}</h1>
              <p className="mt-5 max-w-[720px] text-lg leading-8 text-muted-foreground md:text-xl">{description}</p>
              {updated && <p className="mt-5 inline-flex items-center gap-2 rounded-lg bg-background/70 px-3 py-2 text-xs font-medium text-muted-foreground"><span className="h-1.5 w-1.5 rounded-full bg-primary" />Last updated {updated}</p>}
            </div>
          </div>
        </section>

        <div className="mx-auto grid max-w-[1200px] gap-10 px-5 pt-10 md:px-8 lg:grid-cols-[220px_minmax(0,820px)] lg:gap-14 lg:pt-14">
          <aside aria-label="Information pages" className="lg:sticky lg:top-24 lg:self-start">
            <p className="mb-3 hidden px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground lg:block">Information</p>
            <nav className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2 scrollbar-hide lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0">
              {contentNavigation.map((item) => {
                const isActive = item.href === path;
                return <Link key={item.href} href={item.href} aria-current={isActive ? "page" : undefined} className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${isActive ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>{item.label}</Link>;
              })}
            </nav>
            <div className="mt-8 hidden rounded-2xl border border-border/60 bg-card p-5 lg:block">
              <p className="text-sm font-semibold text-foreground">Need more help?</p>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">Find quick answers or contact the Cognora team directly.</p>
              <Link href="/contact" className="mt-4 inline-flex text-xs font-semibold text-primary hover:underline">Contact support →</Link>
            </div>
          </aside>

          <article className="min-w-0">
            <div className="content-page text-[16px] leading-8 text-foreground/90">{children}</div>
            <div className="mt-12 flex flex-col gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div><h2 className="text-base font-semibold text-foreground">Explore more from Cognora</h2><p className="mt-1 text-sm text-muted-foreground">Read practical ideas or share your own experience.</p></div>
              <div className="flex gap-3"><Link href="/" className="rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold hover:border-primary hover:text-primary">Read articles</Link><Link href="/write" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">Start writing</Link></div>
            </div>
          </article>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
