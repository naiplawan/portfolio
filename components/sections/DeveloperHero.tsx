'use client'

import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { MagneticButton } from '@/components/ui/magnetic-button'
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa'
import { Terminal as TerminalIcon } from 'lucide-react'

const roles = [
  'Software Developer',
  'Frontend Developer',
  'Full-stack Developer',
  'Mobile Developer',
  'Go & React Enthusiast',
]

const codeSnippets = [
  `const dev = {
  name: "Rachaphol",
  skills: ["React", "Go", "Flutter"],
  passion: "Building amazing apps"
};`,
  `function createMagic() {
  return [
    "Clean Code",
    "Great UX",
    "Happy Users"
  ];
}`,
  `// TypeScript ftw
interface Developer {
  experience: number;
  coffee: "unlimited";
}`,
  `export default function Impact() {
  return "10k+ users served";
}`,
]

export default function DeveloperHero() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 500], [0, 200])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])
  const scale = useTransform(scrollY, [0, 300], [1, 0.95])

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 300, damping: 30 })

  const [currentRole, setCurrentRole] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [currentSnippet, setCurrentSnippet] = useState(0)

  // Typing effect for roles
  useEffect(() => {
    const role = roles[currentRole]
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < role.length) {
          setDisplayText(role.slice(0, displayText.length + 1))
        } else {
          setTimeout(() => setIsDeleting(true), 2000)
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(role.slice(0, displayText.length - 1))
        } else {
          setIsDeleting(false)
          setCurrentRole((prev) => (prev + 1) % roles.length)
        }
      }
    }, isDeleting ? 50 : 100)

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, currentRole])

  // Code snippet rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSnippet((prev) => (prev + 1) % codeSnippets.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  // Mouse parallax
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
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    } as const,
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
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

  // Floating tech icons
  const techIcons = [
    { name: 'React', x: -100, y: -50, delay: 0 },
    { name: 'Next.js', x: 100, y: -80, delay: 0.2 },
    { name: 'TypeScript', x: -80, y: 80, delay: 0.4 },
    { name: 'Go', x: 120, y: 60, delay: 0.6 },
    { name: 'Flutter', x: 0, y: -100, delay: 0.8 },
  ]

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background"
    >
      {/* Animated Grid Background */}
      <motion.div
        className="absolute inset-0 opacity-[0.03]"
        style={{ y: y1 }}
      >
        <div style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }} className="w-full h-full" />
      </motion.div>

      {/* Gradient Orbs */}
      <motion.div
        className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-[120px]"
        style={{ x: useTransform(springX, [-10, 10], [-30, 30]) }}
      />
      <motion.div
        className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]"
        style={{ x: useTransform(springX, [-10, 10], [30, -30]) }}
      />

      {/* Floating Tech Icons */}
      {techIcons.map((tech) => (
        <motion.div
          key={tech.name}
          className="absolute hidden lg:flex items-center gap-2 px-4 py-2 bg-muted/50 backdrop-blur-sm rounded-full border border-border/50 text-sm font-medium"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0.4, 0.8, 0.4],
            y: [tech.y, tech.y - 20, tech.y],
          }}
          transition={{
            opacity: { duration: 3, delay: tech.delay, repeat: Infinity },
            y: { duration: 4 + tech.delay, delay: tech.delay, repeat: Infinity, ease: 'easeInOut' },
          }}
          style={{
            left: '50%',
            top: '50%',
            x: tech.x,
          }}
        >
          {tech.name}
        </motion.div>
      ))}

      {/* Main Content */}
      <motion.div
        className="relative z-10 container-premium"
        style={{ opacity, scale }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column - Hero Text */}
          <motion.div className="space-y-8">
            {/* Status Badge */}
            <motion.div variants={itemVariants} className="inline-flex">
              <div className="bio-glass-card px-5 py-2.5 rounded-full flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <span className="text-sm font-semibold">Available for opportunities</span>
              </div>
            </motion.div>

            {/* Main Heading with Typing Effect */}
            <motion.div variants={itemVariants}>
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold leading-[1.1] tracking-tight">
                <span className="block text-foreground">Hi, I'm</span>
                <span className="block bio-gradient-text">Rachaphol</span>
                <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-muted-foreground mt-2">
                  {displayText}
                  <span className="animate-pulse">|</span>
                </span>
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-muted-foreground max-w-xl font-light leading-relaxed"
            >
              Software Developer at Unixdev Co., Ltd. with expertise in{' '}
              <span className="text-foreground font-medium">React</span>,{' '}
              <span className="text-foreground font-medium">Go</span>, and{' '}
              <span className="text-foreground font-medium">Flutter</span>.
              Passionate about building clean, scalable applications.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
              <MagneticButton variant="default" size="lg">
                <span className="flex items-center gap-2">
                  <FaEnvelope className="w-5 h-5" />
                  Get in Touch
                </span>
              </MagneticButton>

              <MagneticButton
                variant="outline"
                size="lg"
                onClick={() => window.open('https://github.com/naiplawan', '_blank')}
              >
                <FaGithub className="w-5 h-5" />
                <span>GitHub</span>
              </MagneticButton>

              <MagneticButton
                variant="outline"
                size="lg"
                onClick={() => window.open('https://linkedin.com/in/rachaphol-plookaom', '_blank')}
              >
                <FaLinkedin className="w-5 h-5" />
                <span>LinkedIn</span>
              </MagneticButton>
            </motion.div>
          </motion.div>

          {/* Right Column - Terminal/Code Display */}
          <motion.div
            className="relative"
            style={{
              rotate: useTransform(springX, [-10, 10], [-2, 2]),
            }}
          >
            {/* Terminal Window */}
            <motion.div
              className="bio-glass-card rounded-2xl overflow-hidden"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              {/* Terminal Header */}
              <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border/50">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="ml-4 flex items-center gap-2 text-xs text-muted-foreground font-mono">
                  <TerminalIcon className="w-3 h-3" />
                  <span>developer.tsx</span>
                </div>
              </div>

              {/* Terminal Content */}
              <div className="p-6 bg-gray-950/80">
                <motion.pre
                  key={currentSnippet}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm font-mono leading-relaxed"
                >
                  <code className="text-gray-300">
                    <span className="text-purple-400">const</span>{' '}
                    <span className="text-blue-400">developer</span>{' '}
                    <span className="text-white">=</span>{' '}
                    <span className="text-yellow-300">{'{'}</span>
                    <br />
                    <span className="ml-4 text-green-400">name</span>
                    <span className="text-white">:</span>{' '}
                    <span className="text-orange-300">&quot;Rachaphol Plookaom&quot;</span>
                    <span className="text-white">,</span>
                    <br />
                    <span className="ml-4 text-green-400">role</span>
                    <span className="text-white">:</span>{' '}
                    <span className="text-orange-300">&quot;Frontend Developer&quot;</span>
                    <span className="text-white">,</span>
                    <br />
                    <span className="ml-4 text-green-400">skills</span>
                    <span className="text-white">:</span>{' '}
                    <span className="text-blue-300">[</span>
                    <span className="text-orange-300">&quot;React&quot;</span>
                    <span className="text-white">,</span>{' '}
                    <span className="text-orange-300">&quot;Next.js&quot;</span>
                    <span className="text-white">,</span>{' '}
                    <span className="text-orange-300">&quot;Go&quot;</span>
                    <span className="text-blue-300">]</span>
                    <span className="text-white">,</span>
                    <br />
                    <span className="ml-4 text-green-400">available</span>
                    <span className="text-white">:</span>{' '}
                    <span className="text-purple-400">true</span>
                    <br />
                    <span className="text-yellow-300">{'}'}</span>
                    <span className="text-white">;</span>
                    <br />
                    <br />
                    <span className="text-gray-500">// Building the future, one commit at a time</span>
                  </code>
                </motion.pre>

                {/* Terminal Cursor */}
                <motion.div
                  className="inline-block w-2 h-4 bg-cyan-400 ml-1"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </div>
            </motion.div>

            {/* Floating Stats Cards */}
            <motion.div
              className="absolute -top-6 -right-6 bio-glass-card p-4 rounded-xl"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
            >
              <div className="text-3xl font-bold bio-gradient-text">2+</div>
              <div className="text-xs text-muted-foreground">Years Exp.</div>
            </motion.div>

            <motion.div
              className="absolute -bottom-6 -left-6 bio-glass-card p-4 rounded-xl"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, delay: 1 }}
            >
              <div className="text-3xl font-bold bio-gradient-text">50+</div>
              <div className="text-xs text-muted-foreground">Projects</div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
          <div className="w-6 h-10 rounded-full border-2 border-current flex items-start justify-center p-2">
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-current"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </div>
      </motion.div>
    </section>
  )
}
