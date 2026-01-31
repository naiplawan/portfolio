'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'

export function DarkModeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="relative h-12 w-12 rounded-full overflow-hidden"
        aria-hidden="true"
        tabIndex={-1}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50 animate-pulse" />
      </Button>
    )
  }

  const isDark = theme === 'dark'

  return (
    <motion.button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {/* Glassmorphism container */}
      <motion.div
        className="relative h-12 w-12 rounded-2xl overflow-hidden"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        {/* Animated gradient background */}
        <motion.div
          className="absolute inset-0 opacity-80"
          animate={{
            background: isHovered
              ? isDark
                ? 'linear-gradient(135deg, rgba(196, 136, 92, 0.3), rgba(90, 99, 85, 0.3))'
                : 'linear-gradient(135deg, rgba(184, 124, 76, 0.25), rgba(168, 187, 163, 0.25))'
              : isDark
              ? 'linear-gradient(135deg, rgba(196, 136, 92, 0.15), rgba(90, 99, 85, 0.15))'
              : 'linear-gradient(135deg, rgba(184, 124, 76, 0.1), rgba(168, 187, 163, 0.1))',
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        />

        {/* Glassmorphism blur effect */}
        <div className="absolute inset-0 backdrop-blur-md bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/5" />

        {/* Animated glow ring */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className={`absolute inset-0 rounded-2xl ${
                isDark
                  ? 'shadow-[0_0_20px_rgba(196,136,92,0.4),0_0_40px_rgba(196,136,92,0.2)]'
                  : 'shadow-[0_0_20px_rgba(184,124,76,0.3),0_0_40px_rgba(184,124,76,0.15)]'
              }`}
            />
          )}
        </AnimatePresence>

        {/* Icon container with animation */}
        <div className="absolute inset-0 flex items-center justify-center">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={theme}
              initial={{ y: -20, opacity: 0, rotate: -180, scale: 0.5 }}
              animate={{ y: 0, opacity: 1, rotate: 0, scale: 1 }}
              exit={{ y: 20, opacity: 0, rotate: 180, scale: 0.5 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 20,
              }}
              className="relative"
            >
              {isDark ? (
                <>
                  {/* Sun icon */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                    className="relative"
                  >
                    <Sun className="h-5 w-5 text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
                  </motion.div>
                  {/* Sun rays glow */}
                  <motion.div
                    className="absolute inset-0 blur-xl bg-amber-400/30 rounded-full"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                </>
              ) : (
                <>
                  {/* Moon icon */}
                  <Moon className="h-5 w-5 text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.6)]" />
                  {/* Moon glow */}
                  <motion.div
                    className="absolute inset-0 blur-xl bg-indigo-400/20 rounded-full"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Shine effect on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent"
          animate={{
            x: isHovered ? ['0%', '200%'] : '0%',
          }}
          transition={{
            duration: 0.6,
            ease: 'easeInOut',
          }}
          style={{
            transform: 'skewX(-20deg)',
          }}
        />
      </motion.div>

      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg whitespace-nowrap"
            style={{
              background: isDark
                ? 'linear-gradient(135deg, rgba(26,22,18,0.95), rgba(61,47,36,0.95))'
                : 'linear-gradient(135deg, rgba(247,241,222,0.95), rgba(196,164,132,0.9))',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(184,124,76,0.2)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            }}
          >
            <span className={`text-xs font-medium ${
              isDark ? 'text-amber-100' : 'text-amber-900'
            }`}>
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </span>
            {/* Tooltip arrow */}
            <div
              className="absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent"
              style={{
                borderBottomColor: isDark
                  ? 'rgba(26,22,18,0.95)'
                  : 'rgba(247,241,222,0.95)',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
