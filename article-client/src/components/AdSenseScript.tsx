"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const excludedRoutes = ["/login", "/signup", "/write", "/linksin"];

export default function AdSenseScript() {
  const pathname = usePathname();
  const isContentRoute = !excludedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  useEffect(() => {
    const scriptId = "cognora-adsense-script";
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]'
    );

    if (!isContentRoute) {
      existingScript?.remove();
      return;
    }

    if (existingScript) {
      existingScript.id = scriptId;
      existingScript.removeAttribute("data-nscript");
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.async = true;
    script.src =
      "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5710259143928036";
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);
  }, [isContentRoute]);

  return null;
}
