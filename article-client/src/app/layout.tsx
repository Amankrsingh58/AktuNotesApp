import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "react-hot-toast";

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
    default: "Cognora",
    template: "%s | Cognora",
  },
  description:
    "Discover insightful AI, technology, software development, and engineering articles on Cognora. Read expert guides, coding tutorials, tech trends, productivity tips, and modern developer insights.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://cognora.in"
  ),
  openGraph: {
    title: "Cognora | AI, Tech & Software Engineering Articles",
    description:
      "Explore AI, software engineering, coding tutorials, developer resources, and modern technology insights on Cognora.",
    url: "/",
    siteName: "Cognora",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cognora | AI, Tech & Software Engineering Articles",
    description:
      "Read AI, software development, coding, and technology articles with modern insights, tutorials, and developer resources on Cognora.",
  },
  robots: {
    index: true,
    follow: true,
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
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
