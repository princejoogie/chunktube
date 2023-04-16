export const GA_TRACKING_ID = "G-D18G5DQL6Z";

declare global {
  interface Window {
    gtag: any;
  }
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageView = (url: string) => {
  window.gtag("config", GA_TRACKING_ID, {
    page_path: url,
  });
};

interface EventProps {
  action: "conclude" | "view" | "like" | "share";
  category: string;
  label: string;
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label }: EventProps) => {
  window.gtag("event", action, {
    event_category: category,
    event_label: label,
  });
};
