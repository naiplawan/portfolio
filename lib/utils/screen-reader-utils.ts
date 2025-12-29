function createAnnouncer(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const announcer = document.createElement('div');
  announcer.setAttribute('aria-live', priority);
  announcer.setAttribute('aria-atomic', 'true');
  announcer.setAttribute('role', 'status');
  announcer.className = 'sr-only';
  announcer.textContent = message;
  
  document.body.appendChild(announcer);
  
  // Remove after announcement
  setTimeout(() => {
    if (document.body.contains(announcer)) {
      document.body.removeChild(announcer);
    }
  }, 1000);
}

export function useScreenReaderAnnouncer() {
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    createAnnouncer(message, priority);
  };

  return { announce };
}

export function announceNavigation(pageName: string) {
  createAnnouncer(`Navigated to ${pageName} page`);
}

export function announceFormError(error: string) {
  createAnnouncer(`Error: ${error}`, 'assertive');
}

export function announceSuccess(message: string) {
  createAnnouncer(`Success: ${message}`, 'polite');
}