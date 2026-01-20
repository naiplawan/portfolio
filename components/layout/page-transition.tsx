'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 0.98,
  },
}

const pageTransition = {
  type: 'tween' as const,
  duration: 0.4,
  ease: [0.4, 0, 0.2, 1] as const,
}

// Alternative transition modes for variety
const transitionVariants = {
  fade: {
    initial: { opacity: 0 },
    in: { opacity: 1 },
    out: { opacity: 0 },
  },
  slideUp: {
    initial: { opacity: 0, y: 40 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -40 },
  },
  slideDown: {
    initial: { opacity: 0, y: -40 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: 40 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    in: { opacity: 1, scale: 1 },
    out: { opacity: 0, scale: 1.05 },
  },
  slideLeft: {
    initial: { opacity: 0, x: 40 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -40 },
  },
  slideRight: {
    initial: { opacity: 0, x: -40 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: 40 },
  },
}

interface PageTransitionProps {
  children: React.ReactNode
  variant?: keyof typeof transitionVariants
}

export default function PageTransition({
  children,
  variant = 'slideUp'
}: PageTransitionProps) {
  const pathname = usePathname()
  const variants = transitionVariants[variant] || pageVariants

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={variants}
        transition={pageTransition}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}