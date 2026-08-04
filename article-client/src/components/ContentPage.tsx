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
      <main className="mx-auto max-w-[820px] px-5 pb-20 pt-28 md:px-8">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span aria-hidden="true" className="mx-2">/</span>
          <span aria-current="page">{title}</span>
        </nav>
        <header className="mb-10 border-b border-border/60 pb-8">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">{title}</h1>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">{description}</p>
          {updated && <p className="mt-4 text-sm text-muted-foreground">Last updated: {updated}</p>}
        </header>
        <div className="content-page space-y-8 text-[16px] leading-8 text-foreground/90">{children}</div>
      </main>
      <SiteFooter />
    </div>
  );
}
