import { getApiBaseUrl } from "./api";

export const ANALYTICS_CONSENT_KEY = "cognora_analytics_consent";
const SESSION_KEY = "cognora_analytics_session";

export const hasAnalyticsConsent = () =>
  typeof window !== "undefined" && localStorage.getItem(ANALYTICS_CONSENT_KEY) === "accepted";

export const getAnalyticsSession = () => {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
};

export type AnalyticsEventType = "view" | "heartbeat" | "scroll" | "share" | "recommendation_impression" | "recommendation_click";

export const trackArticleEvent = async (
  type: AnalyticsEventType,
  articleId: string,
  slug: string,
  options: { value?: number; targetSlug?: string; stableKey?: string } = {}
) => {
  if (!hasAnalyticsConsent()) return;
  const sessionId = getAnalyticsSession();
  const suffix = options.stableKey || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  try {
    await fetch(`${getApiBaseUrl()}/cognora-analytics/events`, {
      method: "POST",
      credentials: "include",
      keepalive: true,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventId: `${sessionId}:${type}:${suffix}`.slice(0, 160),
        sessionId,
        type,
        articleId,
        slug,
        targetSlug: options.targetSlug,
        value: options.value || 0,
        referrer: document.referrer,
      }),
    });
  } catch {
    // Analytics must never interrupt reading.
  }
};
