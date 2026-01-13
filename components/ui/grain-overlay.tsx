'use client';

import { useState, useEffect } from 'react';

export function GrainOverlay() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    // Check if user prefers reduced motion or has grain disabled in localStorage
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const grainDisabled = localStorage.getItem('grain-disabled') === 'true';

    if (prefersReducedMotion || grainDisabled) {
      setEnabled(false);
    }
  }, []);

  if (!enabled) return null;

  return (
    <div className="grain-overlay" aria-hidden="true" />
  );
}
