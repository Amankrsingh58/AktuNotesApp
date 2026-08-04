import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Write and Manage Your Story",
  description: "Create, edit, and manage your Cognora technology articles.",
  robots: { index: false, follow: false },
};

export default function WriteLayout({ children }: { children: React.ReactNode }) {
  return children;
}
