import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cognora Links",
  description: "Explore selected Cognora resources and featured technology reading.",
  alternates: { canonical: "/linksin" },
  openGraph: {
    title: "Cognora Links",
    description: "Selected resources and featured technology reading from Cognora.",
    url: "/linksin",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cognora Links",
    description: "Selected resources and featured technology reading from Cognora.",
    images: ["/mainlogo2.png"],
  },
};

export default function LinksLayout({ children }: { children: React.ReactNode }) {
  return children;
}
