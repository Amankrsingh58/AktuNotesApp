"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ANALYTICS_CONSENT_KEY } from "@/lib/analytics";

export default function AnalyticsConsent() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(!localStorage.getItem(ANALYTICS_CONSENT_KEY));
    const show = () => setOpen(true);
    window.addEventListener("cognora:privacy-choices", show);
    return () => window.removeEventListener("cognora:privacy-choices", show);
  }, []);

  const choose = (value: "accepted" | "declined") => {
    localStorage.setItem(ANALYTICS_CONSENT_KEY, value);
    setOpen(false);
    window.dispatchEvent(new CustomEvent("cognora:analytics-consent", { detail: value }));
  };

  if (!open || pathname.startsWith("/admin")) return null;
  return (
    <div className="fixed inset-x-3 bottom-3 z-[1500] mx-auto max-w-3xl rounded-2xl border border-border bg-card p-5 shadow-2xl sm:flex sm:items-center sm:gap-6" role="dialog" aria-label="Analytics privacy choices">
      <div className="flex-1">
        <p className="font-semibold text-foreground">Help improve Cognora</p>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">With your permission, Cognora records privacy-conscious reading analytics. We do not store raw IP addresses or collect age or gender. Read the <Link href="/cookie-policy" className="text-primary underline">Cookie Policy</Link>.</p>
      </div>
      <div className="mt-4 flex gap-2 sm:mt-0 sm:shrink-0">
        <button onClick={() => choose("declined")} className="rounded-xl border border-border px-4 py-2 text-sm font-semibold hover:bg-muted">Decline</button>
        <button onClick={() => choose("accepted")} className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Allow analytics</button>
      </div>
    </div>
  );
}
