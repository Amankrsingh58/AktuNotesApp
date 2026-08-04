import type { Metadata } from "next";
import Link from "next/link";
import ContentPage from "@/components/ContentPage";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Learn how Cognora uses cookies and similar storage for sign-in, preferences, analytics, and potential advertising services.",
  alternates: { canonical: "/cookie-policy" },
  openGraph: { title: "Cognora Cookie Policy", description: "How Cognora uses cookies and how you can manage them.", url: "/cookie-policy", type: "website" },
};

export default function CookiePolicyPage() {
  return <ContentPage title="Cookie Policy" description="This policy explains how Cognora uses cookies and similar browser technologies, and how you can control them." path="/cookie-policy" updated="August 4, 2026">
    <section><h2>What these technologies are</h2><p>Cookies are small text files stored by your browser. Similar technologies include local storage, which lets a website remember information on a device. They can keep a session secure, remember a preference, measure how a service is used, or support relevant advertising.</p></section>
    <section><h2>How Cognora uses them</h2><ul><li><strong>Essential:</strong> authentication, session security, fraud prevention, and core service operation.</li><li><strong>Preferences:</strong> theme selection, bookmarks, and choices you ask the browser to remember.</li><li><strong>Measurement:</strong> aggregate performance and usage information if analytics tools are enabled.</li><li><strong>Advertising:</strong> ad delivery, frequency control, and measurement if advertising is introduced.</li></ul></section>
    <section><h2>Google AdSense and third parties</h2><p>If Cognora introduces Google AdSense, Google and participating partners may place or read cookies and use related signals to deliver and measure ads. Depending on your region, non-essential advertising cookies will be used only after required notice or consent. You can manage Google ad personalization through Google’s advertising settings. Other providers may use cookies when you open embedded or linked third-party services, subject to their own policies.</p></section>
    <section><h2>Your controls</h2><p>You can block or delete cookies in your browser settings. Blocking essential cookies may prevent sign-in or other account features from working. You can also clear Cognora’s local storage through browser site-data controls; doing so may reset your theme and saved bookmarks. Where a consent control is shown, you can use it to change non-essential choices.</p></section>
    <section><h2>More information</h2><p>See our <Link href="/privacy">Privacy Policy</Link> for broader information about personal data. Questions can be sent through the <Link href="/contact">contact page</Link>.</p></section>
  </ContentPage>;
}
