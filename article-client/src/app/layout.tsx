import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "react-hot-toast";
import SiteFooter from "@/components/SiteFooter";
import { getSiteUrl } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  display: "swap",
});


export const metadata: Metadata = {
  title: {
    default: "Cognora | Articles, Technologies, AI & Tech Insights",
    template: "%s | Cognora",
  },
  description:
    "Explore Cognora for the latest articles on AI, emerging technologies, software engineering, and tech trends. Dive into expert tutorials, coding guides, and modern developer insights.",
  keywords: [
    "articles", "technologies", "AI", "tech articles", "software engineering", 
    "coding tutorials", "developer insights", "artificial intelligence", 
    "tech trends", "programming", "software development", "Cognora"
  ],
  authors: [{ name: "Cognora Team" }],
  creator: "Cognora",
  publisher: "Cognora",
  metadataBase: new URL(getSiteUrl()),
  icons: {
    icon: "/mainlogo2.png",
    apple: "/mainlogo2.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Cognora | Articles, Technologies, AI & Tech Insights",
    description:
      "Dive into the world of AI, software engineering, and modern technology with Cognora's expert-led articles and tutorials.",
    url: "/",
    siteName: "Cognora",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/mainlogo2.png",
        width: 1200,
        height: 630,
        alt: "Cognora - AI & Tech Articles",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cognora | AI, Tech & Software Engineering Articles",
    description:
      "Read the latest AI, software development, and technology articles with modern insights and tutorials on Cognora.",
    images: ["/mainlogo2.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
  category: "technology",
  verification: {
    google: "OxoLwKSyxs_o64stusfp8NZ-QDixLLoYXRWlMSdz3WE",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${sourceSerif.variable}`} suppressHydrationWarning>
      <body className="antialiased min-h-screen">
        <ThemeProvider>
          <AuthProvider>
            <Toaster position="top-center" />
            {children}
            <SiteFooter />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
