import { GA_TRACKING_ID } from './constants';

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}

export const pageview = (url: string) => {
  if (!GA_TRACKING_ID || !window.gtag) return;

  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
};

interface EventParams {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

const event = ({ action, category, label, value }: EventParams) => {
  if (!window.gtag) return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

export const trackContactFormSubmit = (success: boolean) => {
  event({
    action: success ? 'submit_success' : 'submit_error',
    category: 'Contact Form',
    label: success ? 'Form submitted successfully' : 'Form submission failed',
  });
};
