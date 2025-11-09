'use client';

import { useEffect, useRef, useState } from 'react';

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useScrollAnimation(options: UseScrollAnimationOptions = {}) {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = true,
  } = options;

  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isVisible };
}

// Fade in animation
export function useFadeIn(options?: UseScrollAnimationOptions) {
  const { ref, isVisible } = useScrollAnimation(options);

  return {
    ref,
    style: {
      opacity: isVisible ? 1 : 0,
      transform: `translateY(${isVisible ? 0 : '30px'})`,
      transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
    },
  };
}

// Slide in from left
export function useSlideInLeft(options?: UseScrollAnimationOptions) {
  const { ref, isVisible } = useScrollAnimation(options);

  return {
    ref,
    style: {
      opacity: isVisible ? 1 : 0,
      transform: `translateX(${isVisible ? 0 : '-50px'})`,
      transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
    },
  };
}

// Slide in from right
export function useSlideInRight(options?: UseScrollAnimationOptions) {
  const { ref, isVisible } = useScrollAnimation(options);

  return {
    ref,
    style: {
      opacity: isVisible ? 1 : 0,
      transform: `translateX(${isVisible ? 0 : '50px'})`,
      transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
    },
  };
}

// Scale up animation
export function useScaleIn(options?: UseScrollAnimationOptions) {
  const { ref, isVisible } = useScrollAnimation(options);

  return {
    ref,
    style: {
      opacity: isVisible ? 1 : 0,
      transform: `scale(${isVisible ? 1 : 0.9})`,
      transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
    },
  };
}

// Stagger children animation helper
export function useStaggerAnimation(itemCount: number, delay = 100) {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const { ref, isVisible } = useScrollAnimation();

  useEffect(() => {
    if (isVisible && visibleItems.size === 0) {
      for (let i = 0; i < itemCount; i++) {
        setTimeout(() => {
          setVisibleItems(prev => new Set(prev).add(i));
        }, i * delay);
      }
    }
  }, [isVisible, itemCount, delay, visibleItems.size]);

  const getItemStyle = (index: number) => ({
    opacity: visibleItems.has(index) ? 1 : 0,
    transform: `translateY(${visibleItems.has(index) ? 0 : '20px'})`,
    transition: 'opacity 0.4s ease-out, transform 0.4s ease-out',
  });

  return { ref, getItemStyle, isVisible };
}
