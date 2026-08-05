import type { Metadata } from "next";
import Link from "next/link";
import ContentPage from "@/components/ContentPage";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Cognora's mission to make practical knowledge about AI, software engineering, and emerging technology easier to share and understand.",
  alternates: { canonical: "/about" },
  openGraph: { title: "About Cognora", description: "A publishing community for clear, practical technology insight.", url: "/about", type: "website" },
};

export default function AboutPage() {
  return <ContentPage title="About Cognora" description="A publishing community built to make complex technology clearer, more useful, and more human." path="/about" schemaType="AboutPage">
    <section><h2>Why Cognora exists</h2><p>Technology changes quickly, but useful understanding takes time. Cognora gives practitioners, researchers, students, and thoughtful observers a place to explain what they have learned without reducing every idea to a headline. We publish writing about artificial intelligence, software engineering, digital products, and emerging technologies.</p></section>
    <section><h2>What readers can expect</h2><p>Our goal is to help readers make better decisions, build stronger skills, and understand the forces shaping modern technology. Articles include visible authorship, publication information, and topic labels. We encourage contributors to distinguish experience from opinion and to explain ideas in language that informed readers can use.</p></section>
    <section><h2>Topics we cover</h2><p>Cognora focuses on artificial intelligence and AI agents, developer tools, programming practices, software architecture, engineering careers, digital products, and emerging technology. We favor articles that teach a useful concept, document practical experience, evaluate tools fairly, or help readers understand an important technical change.</p></section>
    <section><h2>Editorial standards</h2><p>We expect published work to be original, useful, and written for people rather than search engines. Authors should use clear titles and summaries, distinguish fact from opinion, credit external sources, disclose relevant interests, and avoid deceptive or copied material. Content may be reviewed, corrected, limited, or removed when it conflicts with these standards or our <Link href="/terms">Terms of Service</Link>.</p></section>
    <section><h2>An open community</h2><p>Cognora is strengthened by people who share lessons from real work. Authors retain responsibility for their views, while the platform provides the tools to publish and discover useful perspectives. If you have practical knowledge to contribute, <Link href="/write">start writing</Link>. If you want to ask about the platform, visit our <Link href="/contact">contact page</Link>.</p></section>
    <section><h2>Our commitments</h2><ul><li>Favor useful, original insight over repetitive content.</li><li>Make authorship and publication context clear.</li><li>Correct meaningful errors when they are identified.</li><li>Respect reader privacy and explain our data practices plainly.</li><li>Keep essential information and platform policies easy to find.</li></ul></section>
  </ContentPage>;
}
