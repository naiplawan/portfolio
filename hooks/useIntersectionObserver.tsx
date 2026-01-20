'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface UseIntersectionObserverProps {
  threshold?: number | number[]
  rootMargin?: string
  triggerOnce?: boolean
  root?: HTMLDivElement | null
}

export function useIntersectionObserver({
  threshold = 0.1,
  rootMargin = '0px',
  triggerOnce = true,
  root = null,
}: UseIntersectionObserverProps = {}) {
  const [entry, setEntry] = useState<IntersectionObserverEntry>()
  const [isVisible, setIsVisible] = useState(false)
  const [hasBeenVisible, setHasBeenVisible] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setEntry(entry)
        const newIsVisible = entry.isIntersecting

        if (newIsVisible) {
          setIsVisible(true)
          setHasBeenVisible(true)

          if (triggerOnce) {
            observer.unobserve(element)
          }
        } else if (!triggerOnce) {
          setIsVisible(newIsVisible)
        }
      },
      {
        threshold,
        rootMargin,
        root,
      }
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [threshold, rootMargin, triggerOnce, root])

  return {
    ref: elementRef,
    entry,
    isVisible,
    hasBeenVisible,
  }
}

// Reusable scroll animation variants
export const scrollAnimationVariants = {
  // Fade from bottom
  fadeInUp: {
    hidden: {
      opacity: 0,
      y: 60,
      rotateX: 15,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  },

  // Fade from top
  fadeInDown: {
    hidden: {
      opacity: 0,
      y: -60,
      rotateX: -15,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  },

  // Fade from left
  fadeInLeft: {
    hidden: {
      opacity: 0,
      x: -60,
      rotateY: -15,
    },
    visible: {
      opacity: 1,
      x: 0,
      rotateY: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  },

  // Fade from right
  fadeInRight: {
    hidden: {
      opacity: 0,
      x: 60,
      rotateY: 15,
    },
    visible: {
      opacity: 1,
      x: 0,
      rotateY: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  },

  // Scale up
  scaleIn: {
    hidden: {
      opacity: 0,
      scale: 0.8,
      rotateX: 10,
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  },

  // Slide from bottom with rotation
  slideRotateIn: {
    hidden: {
      opacity: 0,
      y: 100,
      rotate: 10,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotate: 0,
      transition: {
        duration: 1,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  },

  // Parallax effect
  parallax: {
    hidden: {
      opacity: 0,
      y: 100,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.2,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  },
}

// Utility component for scroll animations
export const ScrollAnimation = ({
  children,
  variant = 'fadeInUp',
  threshold = 0.1,
  delay = 0,
  once = true,
  className = '',
}: {
  children: React.ReactNode
  variant?: string
  threshold?: number | number[]
  delay?: number
  once?: boolean
  className?: string
}) => {
  const { ref, isVisible } = useIntersectionObserver({
    threshold,
    triggerOnce: once,
  })

  const getAnimation = () => {
    switch (variant) {
      case 'fadeInDown':
        return {
          initial: { opacity: 0, y: -60 },
          animate: isVisible
            ? { opacity: 1, y: 0, transition: { duration: 0.8, delay } }
            : { opacity: 0, y: -60 }
        }
      case 'fadeInLeft':
        return {
          initial: { opacity: 0, x: -60 },
          animate: isVisible
            ? { opacity: 1, x: 0, transition: { duration: 0.8, delay } }
            : { opacity: 0, x: -60 }
        }
      case 'fadeInRight':
        return {
          initial: { opacity: 0, x: 60 },
          animate: isVisible
            ? { opacity: 1, x: 0, transition: { duration: 0.8, delay } }
            : { opacity: 0, x: 60 }
        }
      case 'scaleIn':
        return {
          initial: { opacity: 0, scale: 0.8 },
          animate: isVisible
            ? { opacity: 1, scale: 1, transition: { duration: 0.8, delay } }
            : { opacity: 0, scale: 0.8 }
        }
      case 'parallax':
        return {
          initial: { opacity: 0, y: 100 },
          animate: isVisible
            ? { opacity: 1, y: 0, transition: { duration: 1.2, delay } }
            : { opacity: 0, y: 100 }
        }
      default: // fadeInUp
        return {
          initial: { opacity: 0, y: 60 },
          animate: isVisible
            ? { opacity: 1, y: 0, transition: { duration: 0.8, delay } }
            : { opacity: 0, y: 60 }
        }
    }
  }

  const animation = getAnimation()

  return (
    <motion.div
      ref={ref}
      className={className}
      {...animation}
    >
      {children}
    </motion.div>
  )
}

// Stagger animation for lists
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

// Sticky reveal animation
export const StickyReveal = ({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) => {
  const { ref, isVisible } = useIntersectionObserver({
    threshold: 0.5,
    triggerOnce: false,
  })

  return (
    <motion.div
      ref={ref}
      className={`sticky top-20 ${className}`}
      initial={{ opacity: 0, y: 50 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  )
}

// Progress indicator hook
export const useScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (scrollTop / docHeight) * 100
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return scrollProgress
}