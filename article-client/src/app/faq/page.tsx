import type { Metadata } from "next";
import Link from "next/link";
import ContentPage from "@/components/ContentPage";

const faqs = [
  { q: "What is Cognora?", a: "Cognora is a publishing community for practical articles about artificial intelligence, software engineering, emerging technology, and digital products." },
  { q: "Do I need an account to read articles?", a: "No. Published articles and public content pages can be read without an account. An account is required for publishing and social features such as following or commenting." },
  { q: "Who can publish on Cognora?", a: "People with useful experience or a well-supported perspective can create an account and write. Authors are responsible for having the rights to their work and following the Terms of Service." },
  { q: "How do I write or edit an article?", a: "Sign in, choose Write, and use the editor to create a draft. Your Stories provides access to drafts and published work for later editing or deletion." },
  { q: "How are featured articles selected?", a: "Featured areas may consider reader interest, clarity, usefulness, originality, and relevance. Engagement can inform discovery, but it is not a guarantee of endorsement." },
  { q: "Can I report an article or request a correction?", a: "Yes. Email team@cognora.in with the article URL and a concise explanation. Rights or privacy requests should include enough information for us to investigate." },
  { q: "Does Cognora use cookies?", a: "Cognora uses essential browser storage for features such as authentication, security, theme preferences, and bookmarks. The Cookie Policy explains current and potential analytics or advertising uses." },
  { q: "How can I delete or correct personal information?", a: "Update available profile information in your account or contact team@cognora.in for an access, correction, or deletion request. Identity verification may be required." },
];

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Answers about reading, publishing, accounts, article reports, privacy, and cookies on Cognora.",
  alternates: { canonical: "/faq" },
  openGraph: { title: "Cognora FAQ", description: "Answers to common questions about Cognora.", url: "/faq", type: "website" },
};

export default function FAQPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cognora.in";
  const schema = { "@context": "https://schema.org", "@type": "FAQPage", url: `${siteUrl}/faq`, mainEntity: faqs.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) };
  return <ContentPage title="Frequently asked questions" description="Quick answers about reading, publishing, accounts, privacy, and how Cognora works." path="/faq" schemaType="FAQPage" schema={schema}>
    <div className="space-y-4">{faqs.map(({ q, a }) => <details key={q} className="group rounded-xl border border-border/60 bg-card p-5"><summary className="cursor-pointer list-none pr-8 text-lg font-semibold">{q}</summary><p className="mt-3 text-muted-foreground">{a}</p></details>)}</div>
    <section><h2>Still need help?</h2><p>Visit the <Link href="/contact">contact page</Link> to reach the Cognora team.</p></section>
  </ContentPage>;
}
