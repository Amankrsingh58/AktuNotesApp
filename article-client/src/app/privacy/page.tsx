import type { Metadata } from "next";
import Link from "next/link";
import ContentPage from "@/components/ContentPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Read how Cognora collects, uses, protects, and shares personal information, including information related to cookies and advertising services.",
  alternates: { canonical: "/privacy" },
  openGraph: { title: "Cognora Privacy Policy", description: "How Cognora handles personal information and privacy choices.", url: "/privacy", type: "website" },
};

export default function PrivacyPage() {
  return <ContentPage title="Privacy Policy" description="This policy explains what information Cognora collects, why we use it, and the choices available to you." path="/privacy" updated="August 4, 2026">
    <section><h2>Information we collect</h2><p>We collect information you provide when you create or update an account, such as your name, email address, profile details, biography, and social links. We also store content and interactions you submit, including articles, comments, likes, and follows. When you use Cognora, our systems may receive technical information such as IP address, browser and device type, referring pages, pages viewed, and approximate timestamps.</p></section>
    <section><h2>How we use information</h2><p>We use this information to provide and secure the service, authenticate users, display author profiles and published content, personalize relevant features, diagnose errors, prevent abuse, understand aggregate usage, respond to support requests, and meet legal obligations. We do not sell personal information.</p></section>
    <section><h2>Cookies and local storage</h2><p>Cognora uses essential cookies or similar storage for authentication, security, theme preferences, and saved features such as bookmarks. With appropriate notice or consent where required, we may use analytics or advertising technologies. Details and choices are described in our <Link href="/cookie-policy">Cookie Policy</Link>.</p></section>
    <section><h2>Google services and advertising</h2><p>Cognora may in the future use Google AdSense or related Google advertising services. Google and its partners may use cookies to serve or measure ads based on visits to this and other websites, subject to applicable consent requirements. Users can learn about Google’s advertising data practices and manage personalized advertising through Google’s advertising settings. No AdSense publisher script is currently required by this policy, and introducing advertising will not change our commitment to provide appropriate notice and controls.</p></section>
    <section><h2>Sharing and processors</h2><p>We may share information with service providers that host the website, database, and infrastructure or help us operate and secure Cognora. They may process information only for the services they provide to us. We may also disclose information when required by law, to protect users or the platform, or as part of a business transaction with appropriate safeguards.</p></section>
    <section><h2>Retention and security</h2><p>We retain information while it is needed to provide the service, comply with law, resolve disputes, or protect legitimate interests. Published content may remain visible until removed. We use reasonable technical and organizational safeguards, but no internet service can guarantee absolute security.</p></section>
    <section><h2>Your choices and rights</h2><p>You can update available profile details through your account. Depending on where you live, you may have rights to access, correct, delete, restrict, or object to processing of personal information. You may also withdraw consent where processing relies on consent. Contact us at <a href="mailto:team@cognora.in">team@cognora.in</a>; we may verify your identity before completing a request.</p></section>
    <section><h2>Children and international use</h2><p>Cognora is not directed to children under 13, and we do not knowingly collect their personal information. Information may be processed in countries other than your own; where required, we use appropriate protections for those transfers.</p></section>
    <section><h2>Changes and contact</h2><p>We may update this policy as the service or law changes. The date above identifies the latest revision. Material changes will be communicated where required. Questions may be sent through our <Link href="/contact">contact page</Link>.</p></section>
  </ContentPage>;
}
