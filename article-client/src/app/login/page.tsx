import type { Metadata } from "next";
import React, { Suspense } from "react";
import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your Cognora account to write stories and manage your author profile.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary"></div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

