'use client'

import { motion, useScroll, useTransform, useMotionValue } from 'framer-motion'
import { useRef, useEffect } from 'react'
import { MagneticButton } from '@/components/ui/magnetic-button'
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa'

export default function PremiumHero() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 500], [0, 200])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])
  const scale = useTransform(scrollY, [0, 300], [1, 0.9])

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const x = (clientX / window.innerWidth - 0.5) * 20
      const y = (clientY / window.innerHeight - 0.5) * 20
      mouseX.set(x)
      mouseY.set(y)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
      },
    } as const,
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 15,
      },
    },
  }

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-cream via-amber-50/50 to-sage/20 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800"
    >
      {/* Background Image with Parallax */}
      <motion.div
        className="absolute inset-0 opacity-20 dark:opacity-10"
        style={{ y: y1 }}
      >
        <img
          src="https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=80"
          alt="Mountain landscape at sunset"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Organic Blobs */}
      <motion.div
        className="absolute top-20 -left-32 w-96 h-96 bg-gradient-to-br from-terracotta/30 to-transparent rounded-full blur-3xl bio-blob"
        animate={{
          x: [0, 30, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-20 -right-32 w-96 h-96 bg-gradient-to-tl from-sage/30 to-transparent rounded-full blur-3xl bio-blob"
        style={{
          animationDelay: '2s',
        }}
        animate={{
          x: [0, -30, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Main Content */}
      <motion.div
        className="relative z-10 container-premium"
        style={{ opacity, scale }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column - Text Content */}
          <motion.div
            className="space-y-8"
            style={{
              x: useTransform(scrollY, [0, 300], [0, -50]),
            }}
          >
            {/* Status Badge */}
            <motion.div variants={itemVariants} className="inline-flex">
              <div className="bio-glass-card px-5 py-2.5 rounded-full flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <span className="text-sm font-semibold tracking-tight">
                  Available for new opportunities
                </span>
              </div>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              variants={itemVariants}
              className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-display font-bold leading-[0.95] tracking-tight"
            >
              <span className="block text-foreground">Creative</span>
              <span className="block bio-gradient-text">Developer</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-xl sm:text-2xl text-muted-foreground max-w-lg font-light leading-relaxed"
            >
              Crafting exceptional digital experiences with{' '}
              <span className="text-foreground font-medium">precision</span> and{' '}
              <span className="text-foreground font-medium">passion</span>.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4 pt-4">
              <MagneticButton>
                <button className="bio-button px-8 py-4 text-base">
                  <span className="flex items-center gap-2">
                    <FaEnvelope className="w-5 h-5" />
                    Get in Touch
                  </span>
                </button>
              </MagneticButton>

              <MagneticButton>
                <button
                  className="bio-button-ghost px-8 py-4 text-base flex items-center gap-2"
                  onClick={() => window.open('https://github.com/naiplawan', '_blank')}
                >
                  <FaGithub className="w-5 h-5" />
                  <span>GitHub</span>
                </button>
              </MagneticButton>

              <MagneticButton>
                <button
                  className="bio-button-ghost px-8 py-4 text-base flex items-center gap-2"
                  onClick={() =>
                    window.open(
                      'https://linkedin.com/in/rachaphol-plookaom',
                      '_blank'
                    )
                  }
                >
                  <FaLinkedin className="w-5 h-5" />
                  <span>LinkedIn</span>
                </button>
              </MagneticButton>
            </motion.div>
          </motion.div>

          {/* Right Column - Visual Element */}
          <motion.div
            className="relative hidden lg:block"
            style={{
              rotate: useTransform(mouseX, [-10, 10], [-3, 3]),
            }}
          >
            {/* Floating Profile Card */}
            <motion.div
              className="relative"
              animate={{
                y: [0, -15, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <div className="bio-glass-card p-2 rounded-3xl">
                <div className="relative overflow-hidden rounded-2xl aspect-[4/5]">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80"
                    alt="Professional developer portrait"
                    className="w-full h-full object-cover"
                  />

                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Info Card */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20">
                      <div className="text-white">
                        <div className="text-sm font-medium opacity-80 mb-1">
                          Based in
                        </div>
                        <div className="text-xl font-bold">Bangkok, Thailand</div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold">
                            React
                          </span>
                          <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold">
                            Next.js
                          </span>
                          <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold">
                            TypeScript
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <motion.div
                className="absolute -top-4 -right-4 bio-glass-card p-4 rounded-2xl"
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 0.5,
                }}
              >
                <div className="text-4xl font-bold bio-gradient-text">2+</div>
                <div className="text-xs text-muted-foreground font-medium">
                  Years Exp.
                </div>
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -left-4 bio-glass-card p-4 rounded-2xl"
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 1,
                }}
              >
                <div className="text-4xl font-bold bio-gradient-text">50+</div>
                <div className="text-xs text-muted-foreground font-medium">
                  Projects
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <span className="text-xs font-medium tracking-widest uppercase">
            Scroll to explore
          </span>
          <div className="w-6 h-10 rounded-full border-2 border-current flex items-start justify-center p-2">
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-current"
              animate={{
                y: [0, 12, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>
        </div>
      </motion.div>

      {/* Floating Elements */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-primary/30"
          style={{
            left: `${20 + i * 15}%`,
            top: `${20 + (i % 3) * 30}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.3,
          }}
        />
      ))}
    </section>
  )
}
