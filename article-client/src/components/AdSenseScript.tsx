"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

const excludedRoutes = ["/login", "/signup", "/write", "/linksin"];

export default function AdSenseScript() {
  const pathname = usePathname();
  const isContentRoute = !excludedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (!isContentRoute) return null;

  return (
    <Script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5710259143928036"
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
