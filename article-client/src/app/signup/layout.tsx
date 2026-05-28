import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | Cognora",
  description: "Create a Cognora account to start writing and sharing your tech insights.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
