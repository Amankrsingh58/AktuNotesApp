import type { Metadata } from "next";
import Link from "next/link";
import ContentPage from "@/components/ContentPage";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact the Cognora team about account support, articles, privacy, partnerships, or platform feedback.",
  alternates: { canonical: "/contact" },
  openGraph: { title: "Contact Cognora", description: "Get support or send feedback to the Cognora team.", url: "/contact", type: "website" },
};

export default function ContactPage() {
  return <ContentPage title="Contact Cognora" description="Questions, feedback, or a concern about content? Send it to the right place and we will review it." path="/contact" schemaType="ContactPage">
    <section><h2>We are here to help</h2><p>Whether you are a reader with feedback, an author managing a story, or someone interested in working with Cognora, you can contact us directly. A clear subject line and relevant page URL will help us respond efficiently.</p></section>
    <section><h2>General and account support</h2><p>Email <a href="mailto:amankrsingh58@gmail.com">amankrsingh58@gmail.com</a> for platform questions, sign-in issues, author profiles, feedback, or partnership enquiries. Include the email address connected to your account when the request concerns an account, but never send your password.</p></section>
    <section><h2>Article and rights concerns</h2><p>If you are reporting an article, include its URL and a clear explanation of the issue. For copyright or other rights concerns, identify the work, explain your relationship to it, and provide a reliable way to contact you. We may ask for more information before taking action.</p></section>
    <section><h2>Privacy requests</h2><p>For access, correction, or deletion requests involving personal information, use the subject line “Privacy request.” We may need to verify your identity before acting. See our <Link href="/privacy">Privacy Policy</Link> for details.</p></section>
    <section><h2>Frequently asked before contacting us</h2><h3>Can I read without an account?</h3><p>Yes. All published articles are publicly readable. An account is only needed for writing and community features.</p><h3>How do I report an article?</h3><p>Email the article URL and explain the issue clearly. Copyright or privacy reports should also explain your relationship to the material.</p><h3>Where can I learn about personal data?</h3><p>Our <Link href="/privacy">Privacy Policy</Link> explains what Cognora collects and the choices available to you.</p></section>
    <section><h2>Response times</h2><p>We aim to review messages within five business days. Safety, security, and credible rights reports are prioritized. You may also find an immediate answer in our complete <Link href="/faq">FAQ</Link>.</p></section>
  </ContentPage>;
}
