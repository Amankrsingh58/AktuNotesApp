"use client";

import { useEffect } from "react";
import { getAnalyticsSession, hasAnalyticsConsent, trackArticleEvent } from "@/lib/analytics";

export default function ArticleAnalytics({ articleId, slug }: { articleId: string; slug: string }) {
  useEffect(() => {
    let heartbeat: ReturnType<typeof setInterval> | undefined;
    const scrollLevels = new Set<number>();
    const impressed = new Set<string>();

    const start = () => {
      if (!hasAnalyticsConsent()) return;
      getAnalyticsSession();
      void trackArticleEvent("view", articleId, slug, { stableKey: `view:${articleId}` });

      heartbeat = setInterval(() => {
        if (document.visibilityState === "visible" && document.hasFocus()) {
          void trackArticleEvent("heartbeat", articleId, slug, { value: 15, stableKey: `heartbeat:${Date.now()}` });
        }
      }, 15_000);

      const onScroll = () => {
        const available = document.documentElement.scrollHeight - window.innerHeight;
        const percent = available > 0 ? Math.round(window.scrollY / available * 100) : 100;
        [25, 50, 75, 100].forEach(level => {
          if (percent >= level && !scrollLevels.has(level)) {
            scrollLevels.add(level);
            void trackArticleEvent("scroll", articleId, slug, { value: level, stableKey: `scroll:${level}` });
          }
        });
      };
      window.addEventListener("scroll", onScroll, { passive: true });

      const links = Array.from(document.querySelectorAll<HTMLAnchorElement>(`a[href^="/articles/"]`)).filter(link => !link.href.endsWith(`/articles/${slug}`));
      const observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const link = entry.target as HTMLAnchorElement;
        const target = link.pathname.split("/").filter(Boolean).pop() || "";
        if (target && !impressed.has(target)) {
          impressed.add(target);
          void trackArticleEvent("recommendation_impression", articleId, slug, { targetSlug: target, stableKey: `impression:${target}` });
        }
      }), { threshold: 0.5 });
      links.forEach(link => {
        observer.observe(link);
        link.addEventListener("click", () => {
          const target = link.pathname.split("/").filter(Boolean).pop() || "";
          void trackArticleEvent("recommendation_click", articleId, slug, { targetSlug: target });
        });
      });

      return () => { window.removeEventListener("scroll", onScroll); observer.disconnect(); if (heartbeat) clearInterval(heartbeat); };
    };

    let cleanup = start();
    const onConsent = () => { cleanup?.(); cleanup = start(); };
    window.addEventListener("cognora:analytics-consent", onConsent);
    return () => { cleanup?.(); window.removeEventListener("cognora:analytics-consent", onConsent); };
  }, [articleId, slug]);

  return null;
}
