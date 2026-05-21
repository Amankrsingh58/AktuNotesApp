import React, { Suspense } from "react";
import LoginForm from "@/components/LoginForm";

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

