import type { Metadata } from "next";
import Link from "next/link";
import ContentPage from "@/components/ContentPage";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms governing accounts, publishing, acceptable use, intellectual property, and use of Cognora.",
  alternates: { canonical: "/terms" },
  openGraph: { title: "Cognora Terms of Service", description: "Terms for using and publishing on Cognora.", url: "/terms", type: "website" },
};

export default function TermsPage() {
  return <ContentPage title="Terms of Service" description="These terms set the ground rules for reading, creating an account, and publishing on Cognora." path="/terms" updated="August 4, 2026">
    <section><h2>Agreement and eligibility</h2><p>By accessing or using Cognora, you agree to these Terms and our <Link href="/privacy">Privacy Policy</Link>. If you do not agree, do not use the service. You must be legally able to enter this agreement and provide accurate account information. If you use Cognora for an organization, you represent that you can bind that organization.</p></section>
    <section><h2>Your account</h2><p>You are responsible for activity under your account and for keeping sign-in credentials secure. Tell us promptly if you believe your account has been compromised. We may restrict or suspend access where reasonably necessary to protect users, comply with law, investigate abuse, or enforce these Terms.</p></section>
    <section><h2>Your content</h2><p>You retain ownership of content you create. By submitting content, you grant Cognora a worldwide, non-exclusive, royalty-free license to host, reproduce, format, display, distribute, and promote it for operating and improving the service. This license ends when content is deleted, except for reasonable backups, legal retention, and copies others made while it was available.</p><p>You represent that you have the rights needed to publish your content and that it does not infringe intellectual property, privacy, publicity, or other rights. Views expressed by contributors are their own.</p></section>
    <section><h2>Acceptable use</h2><p>Do not use Cognora to publish unlawful, deceptive, abusive, harassing, hateful, privacy-invasive, malicious, or infringing material. Do not attempt unauthorized access, distribute malware, manipulate engagement, scrape the service in a way that harms it, impersonate others, or interfere with platform operation. We may remove content or limit accounts that violate these rules.</p></section>
    <section><h2>Platform materials</h2><p>Cognora’s software, branding, design, and other platform materials are protected by applicable laws. Except for rights expressly granted in these Terms, we retain all rights in the service. Links to third-party websites do not imply that we control or endorse them.</p></section>
    <section><h2>Service changes and availability</h2><p>We may update, add, or discontinue features and may perform maintenance. We work to provide a reliable service but do not guarantee uninterrupted or error-free availability. Cognora is provided “as is” and “as available” to the extent permitted by law.</p></section>
    <section><h2>Limitation of liability</h2><p>To the fullest extent permitted by law, Cognora and its operators will not be liable for indirect, incidental, special, consequential, or punitive damages, or for loss of data, profits, goodwill, or business opportunity arising from use of the service. Nothing here excludes liability that cannot legally be excluded.</p></section>
    <section><h2>Ending use and changes</h2><p>You may stop using Cognora at any time. Provisions that by their nature should survive termination will survive. We may revise these Terms and will update the date above; material changes will be communicated where required. Continued use after an effective update means you accept the revised Terms.</p></section>
    <section><h2>Contact</h2><p>Questions about these Terms can be sent to <a href="mailto:team@cognora.in">team@cognora.in</a> or through our <Link href="/contact">contact page</Link>.</p></section>
  </ContentPage>;
}
