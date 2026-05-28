import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you are looking for does not exist. Browse the latest AI, technology, and software engineering articles on Cognora.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-4">
      <h1 className="text-7xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-muted-foreground text-center max-w-md mb-8">
        Sorry, the page you&apos;re looking for doesn&apos;t exist or has been moved.
        Explore our latest articles on AI, technology, and software engineering.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-full hover:opacity-90 transition-all"
      >
        Back to Articles
      </Link>
    </div>
  );
}
