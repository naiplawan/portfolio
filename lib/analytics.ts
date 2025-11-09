// Google Analytics event tracking utilities

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Track page views
export const pageview = (url: string) => {
  if (!GA_TRACKING_ID || !window.gtag) return;

  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
};

// Track custom events
interface EventParams {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

export const event = ({ action, category, label, value }: EventParams) => {
  if (!window.gtag) return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// Predefined event trackers
export const trackDownload = (fileName: string) => {
  event({
    action: 'download',
    category: 'File',
    label: fileName,
  });
};

export const trackProjectClick = (projectName: string, type: 'github' | 'live') => {
  event({
    action: 'click',
    category: 'Project',
    label: `${projectName} - ${type}`,
  });
};

export const trackContactFormSubmit = (success: boolean) => {
  event({
    action: success ? 'submit_success' : 'submit_error',
    category: 'Contact Form',
    label: success ? 'Form submitted successfully' : 'Form submission failed',
  });
};

export const trackSocialClick = (platform: string) => {
  event({
    action: 'click',
    category: 'Social',
    label: platform,
  });
};

export const trackEmailClick = () => {
  event({
    action: 'click',
    category: 'Contact',
    label: 'Email',
  });
};

export const trackProjectFilter = (filterType: string, filterValue: string) => {
  event({
    action: 'filter',
    category: 'Projects',
    label: `${filterType}: ${filterValue}`,
  });
};

export const trackThemeChange = (theme: 'light' | 'dark') => {
  event({
    action: 'change',
    category: 'Theme',
    label: theme,
  });
};

export const trackNavigation = (destination: string) => {
  event({
    action: 'navigate',
    category: 'Navigation',
    label: destination,
  });
};
