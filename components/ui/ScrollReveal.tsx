'use client';

import { ReactNode, Children } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface ScrollRevealProps {
  children: ReactNode;
  animation?: 'fade' | 'slideLeft' | 'slideRight' | 'slideUp' | 'scale';
  delay?: number;
  duration?: number;
  threshold?: number;
  triggerOnce?: boolean;
  className?: string;
}

export default function ScrollReveal({
  children,
  animation = 'fade',
  delay = 0,
  duration = 0.6,
  threshold = 0.1,
  triggerOnce = true,
  className = '',
}: ScrollRevealProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold, triggerOnce });

  const getAnimationStyle = () => {
    const baseStyle = {
      transition: `all ${duration}s ease-out ${delay}s`,
    };

    if (!isVisible) {
      switch (animation) {
        case 'slideLeft':
          return {
            ...baseStyle,
            opacity: 0,
            transform: 'translateX(-50px)',
          };
        case 'slideRight':
          return {
            ...baseStyle,
            opacity: 0,
            transform: 'translateX(50px)',
          };
        case 'slideUp':
          return {
            ...baseStyle,
            opacity: 0,
            transform: 'translateY(30px)',
          };
        case 'scale':
          return {
            ...baseStyle,
            opacity: 0,
            transform: 'scale(0.9)',
          };
        case 'fade':
        default:
          return {
            ...baseStyle,
            opacity: 0,
          };
      }
    }

    return {
      ...baseStyle,
      opacity: 1,
      transform: 'none',
    };
  };

  return (
    <div ref={ref as any} style={getAnimationStyle()} className={className}>
      {children}
    </div>
  );
}

// Stagger container for animating children in sequence
interface StaggerContainerProps {
  children: ReactNode[];
  staggerDelay?: number;
  className?: string;
}

export function StaggerContainer({
  children,
  staggerDelay = 0.1,
  className = '',
}: StaggerContainerProps) {
  return (
    <div className={className}>
      {Children.map(children, (child, index) => (
        <ScrollReveal animation="slideUp" delay={index * staggerDelay}>
          {child}
        </ScrollReveal>
      ))}
    </div>
  );
}
