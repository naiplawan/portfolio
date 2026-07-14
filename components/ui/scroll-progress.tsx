'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // set initial value
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 z-50 origin-left"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div
        className="h-full bg-gradient-to-r from-terracotta via-sage-beige to-terracotta"
        style={{
          transform: `scaleX(${scrollProgress / 100})`,
          transformOrigin: 'left',
          backgroundSize: '200% 100%',
          backgroundPosition: `${scrollProgress}% 0%`,
        }}
      />
    </motion.div>
  )
}

export function ScrollProgressComponents() {
  return <ScrollProgress />
}
