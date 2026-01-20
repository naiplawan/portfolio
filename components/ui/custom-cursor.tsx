'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [visible, setVisible] = useState(false);
  const [cursorText, setCursorText] = useState('');

  useEffect(() => {
    // Check if user prefers reduced motion or is on mobile
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;
    if (prefersReducedMotion || isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const cursorData = target.getAttribute('data-cursor');
      const cursorTextData = target.getAttribute('data-cursor-text');

      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('[data-cursor="hover"]') ||
        target.closest('button') ||
        target.closest('a')
      ) {
        setHovered(true);
        setCursorText(cursorTextData || '');
      } else {
        setHovered(false);
        setCursorText('');
      }

      // Handle special cursor states
      if (cursorData === 'view') {
        setCursorText('View');
      } else if (cursorData === 'link') {
        setCursorText('Link');
      }
    };

    const handleMouseDown = () => setClicked(true);
    const handleMouseUp = () => setClicked(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  if (!visible) return null;

  return (
    <>
      {/* Trailing effect */}
      <motion.div
        className="fixed w-6 h-6 rounded-full bg-terracotta/10 dark:bg-terracotta/20 pointer-events-none z-[9998] hidden md:block"
        animate={{
          x: position.x - 12,
          y: position.y - 12,
          scale: hovered ? 1.2 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 150,
          damping: 20,
          mass: 1.5,
        }}
      />

      {/* Outer cursor */}
      <motion.div
        className="fixed rounded-full border-2 border-terracotta dark:border-terracotta/80 pointer-events-none z-[9999] mix-blend-difference hidden md:block flex items-center justify-center"
        animate={{
          x: position.x - (hovered ? 24 : 16),
          y: position.y - (hovered ? 24 : 16),
          scale: clicked ? 0.9 : hovered ? 1.5 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 28,
        }}
        style={{
          width: hovered ? '48px' : '32px',
          height: hovered ? '48px' : '32px',
        }}
      >
        {/* Cursor text label */}
        <AnimatePresence>
          {cursorText && (
            <motion.span
              className="text-xs font-semibold text-terracotta dark:text-terracotta/90 whitespace-nowrap"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
            >
              {cursorText}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Inner cursor */}
      <motion.div
        className="fixed w-2 h-2 rounded-full bg-terracotta dark:bg-terracotta/90 pointer-events-none z-[9999] mix-blend-difference hidden md:block"
        animate={{
          x: position.x - 4,
          y: position.y - 4,
          scale: clicked ? 0.5 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 1000,
          damping: 50,
        }}
      />

      {/* Click ripple effect */}
      <AnimatePresence>
        {clicked && (
          <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[9997] hidden md:block"
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 3, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              left: position.x,
              top: position.y,
            }}
          >
            <div className="absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 border-terracotta dark:border-terracotta/80" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
