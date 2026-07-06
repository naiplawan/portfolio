'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (scrollTop / docHeight) * 100
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="h-full bg-gradient-to-r from-terracotta via-sage-beige to-terracotta"
        style={{
          width: `${scrollProgress}%`,
          backgroundSize: `${200}% 100%`,
          backgroundPosition: `${scrollProgress}% 0%`,
        }}
        initial={{ width: '0%' }}
        animate={{ width: `${scrollProgress}%` }}
        transition={{ duration: 0.1 }}
      />
    </motion.div>
  )
}

export function ScrollProgressComponents() {
  return <ScrollProgress />
}
