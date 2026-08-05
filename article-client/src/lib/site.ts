const DEFAULT_SITE_URL = "https://www.cognora.in";

export function getSiteUrl(): string {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL;

  try {
    const url = new URL(configuredUrl);
    if (url.hostname === "cognora.in") url.hostname = "www.cognora.in";
    return url.origin;
  } catch {
    return DEFAULT_SITE_URL;
  }
}
