/* export const GA_TRACKING_ID = "G-D18G5DQL6Z"; */
export const GTM_TRACKING_ID = "GTM-WPRQ3X6";

declare global {
  interface Window {
    gtag: any;
  }
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageView = (url: string) => {
  window.gtag("config", GTM_TRACKING_ID, {
    page_path: url,
  });
};

interface EventProps {
  action: "conclude" | "like" | "share";
  label: string;
  category?: string;
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category = "general", label }: EventProps) => {
  window.gtag("event", action, {
    event_category: category,
    event_label: label,
  });
};
