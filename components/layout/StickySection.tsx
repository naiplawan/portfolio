'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'

interface StickySectionProps {
  children: React.ReactNode
  className?: string
  offset?: number
}

export function StickySection({
  children,
  className = '',
  offset = 80
}: StickySectionProps) {
  const ref = useRef<HTMLElement>(null)
  const { isVisible } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: false,
  })

  return (
    <motion.div
      ref={ref as any}
      className={`sticky top-${offset} ${className}`}
      initial={{ opacity: 0, y: 50 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        top: `${offset}px`,
        transform: isVisible ? 'none' : 'translateY(50px)',
        opacity: isVisible ? 1 : 0,
      }}
    >
      {children}
    </motion.div>
  )
}

// Parallax sticky section
export function ParallaxStickySection({
  children,
  className = '',
  speed = 0.5,
}: StickySectionProps & { speed?: number }) {
  const ref = useRef<HTMLElement>(null)
  const { entry } = useIntersectionObserver({
    threshold: [0, 0.1, 0.5, 1],
    triggerOnce: false,
  })

  return (
    <motion.div
      ref={ref as any}
      className={`relative ${className}`}
      style={{
        transform: entry
          ? `translateY(${(entry.intersectionRatio - 1) * 100 * speed}px)`
          : 'translateY(0)',
      }}
    >
      {children}
    </motion.div>
  )
}

// Multi-layer sticky reveal
export function MultiLayerStickySection({
  children,
  className = '',
  layers = 3,
}: StickySectionProps & { layers?: number }) {
  const ref = useRef<HTMLElement>(null)
  const { isVisible } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: false,
  })

  return (
    <div ref={ref as any} className={`relative overflow-hidden ${className}`}>
      {Array.from({ length: layers }).map((_, index) => (
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{
            opacity: 0,
            y: 50 * (index + 1),
            filter: `blur(${index * 2}px)`
          }}
          animate={isVisible ? {
            opacity: 1 - (index * 0.2),
            y: 0,
            filter: 'blur(0px)'
          } : {
            opacity: 0,
            y: 50 * (index + 1),
            filter: `blur(${index * 2}px)`
          }}
          transition={{
            duration: 0.8 + (index * 0.2),
            delay: index * 0.1,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
          style={{
            zIndex: layers - index,
          }}
        >
          {children}
        </motion.div>
      ))}
    </div>
  )
}

// Scroll-triggered sticky animations
export function TriggeredStickySection({
  children,
  triggerPoint = 0.5,
  className = '',
}: StickySectionProps & { triggerPoint?: number }) {
  const ref = useRef<HTMLElement>(null)
  const { entry } = useIntersectionObserver({
    threshold: [0, triggerPoint],
    triggerOnce: false,
  })

  const shouldAnimate = entry && entry.intersectionRatio >= triggerPoint

  return (
    <motion.div
      ref={ref as any}
      className={`sticky ${className}`}
      initial={{
        opacity: 0,
        scale: 0.9,
        rotateX: -10,
      }}
      animate={shouldAnimate ? {
        opacity: 1,
        scale: 1,
        rotateX: 0,
      } : {
        opacity: 0,
        scale: 0.9,
        rotateX: -10,
      }}
      transition={{
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
        type: 'spring',
        stiffness: 300,
        damping: 30
      }}
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </motion.div>
  )
}