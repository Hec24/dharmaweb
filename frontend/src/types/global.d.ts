// src/types/global.d.ts
export {};

declare global {
  interface Window {
    /**
     * GA4 gtag()
     * https://developers.google.com/tag-platform/gtagjs/reference
     */
    gtag?: (
      command: "js" | "config" | "event" | "consent",
      targetOrEventName?: string,
      params?: Record<string, unknown>
    ) => void;

    /**
     * Meta Pixel fbq()
     * https://developers.facebook.com/docs/meta-pixel/api-reference/
     */
    fbq?: (
      command: "init" | "track" | "trackCustom" | "consent" | "set",
      eventNameOrParam?: string,
      params?: Record<string, unknown>
    ) => void;
  }
}
