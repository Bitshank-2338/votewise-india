/**
 * Google Analytics 4 event helpers.
 * Wrap window.gtag with a typed surface — no-ops when GA isn't loaded.
 */

type GtagEventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (
      command: "event" | "config" | "set",
      target: string,
      params?: GtagEventParams
    ) => void;
  }
}

/** Track a custom GA4 event. Safe to call from any environment. */
export function trackEvent(name: string, params: GtagEventParams = {}): void {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}

/** Track a page view (Next.js client-side navigation). */
export function trackPageView(path: string): void {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!gaId) return;
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }
  window.gtag("config", gaId, { page_path: path });
}

/** Track an outbound link click — useful for ECI / NVSP referrals. */
export function trackOutboundLink(url: string): void {
  trackEvent("click_outbound", { destination: url });
}
