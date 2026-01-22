'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Github, ExternalLink, ChevronRight, MapPin, Database, Smartphone } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface Project {
  title: string
  description: string
  longDescription: string
  image: string
  tags: string[]
  github?: string
  demo?: string
  featured: boolean
  color: string
  icon?: React.ReactNode
}

const projects: Project[] = [
  {
    title: 'Yod-Tok (Beta)',
    description: 'Real-time location tracking mobile application',
    longDescription: 'Cross-platform mobile application built with Flutter and Dart. Integrated Google Maps API and Firebase services for real-time location tracking and geofencing capabilities. Features include live location sharing, location history, and customizable geofence zones with push notifications.',
    image: 'https://images.unsplash.com/photo-1526488901034-2a3276361a09?w=800&q=80',
    tags: ['Flutter', 'Dart', 'Firebase', 'Google Maps API', 'RESTful API'],
    github: 'https://github.com/naiplawan',
    demo: 'https://yod-tok.com',
    featured: true,
    color: 'from-emerald-500 to-teal-600',
    icon: <MapPin className="w-5 h-5" />,
  },
  {
    title: 'Inventory Management System',
    description: 'Web-based inventory tracking solution',
    longDescription: 'Full-stack inventory management system developed with Go Fiber backend, PostgreSQL database, and React frontend. Features include barcode scanning, low stock alerts, analytics dashboard, and JWT authentication. Implements RESTful API architecture with role-based access control.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    tags: ['Go', 'Fiber', 'PostgreSQL', 'React', 'JWT'],
    github: 'https://github.com/naiplawan',
    featured: true,
    color: 'from-cyan-500 to-blue-600',
    icon: <Database className="w-5 h-5" />,
  },
  {
    title: 'Portfolio Website',
    description: 'Personal portfolio with 3D elements',
    longDescription: 'Modern portfolio website built with Next.js, TypeScript, and Tailwind CSS. Features advanced animations, 3D elements with Three.js, dark mode support, and optimized performance. Fully responsive and SEO-friendly with Lighthouse scores of 95+ across all metrics.',
    image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Three.js'],
    github: 'https://github.com/naiplawan',
    demo: 'https://rachaphol-portfolio.vercel.app',
    featured: true,
    color: 'from-violet-500 to-purple-600',
    icon: <Smartphone className="w-5 h-5" />,
  },
]

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ delay: index * 0.15, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn(
        'group relative',
        project.featured ? 'md:col-span-2 lg:col-span-1' : ''
      )}
    >
      <div
        className="bio-glass-card rounded-2xl overflow-hidden h-full transition-all duration-500"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative overflow-hidden aspect-[16/10]">
          <motion.img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700"
            animate={{ scale: isHovered ? 1.1 : 1 }}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60" />

          {/* Featured Badge */}
          {project.featured && (
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold text-white border border-white/20">
                Featured
              </span>
            </div>
          )}

          {/* Icon Badge */}
          {project.icon && (
            <div className="absolute top-4 right-4">
              <div className={cn('w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-white', project.color)}>
                {project.icon}
              </div>
            </div>
          )}

          {/* Hover Actions */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white/20 backdrop-blur-md rounded-xl hover:bg-white/30 transition-colors border border-white/20"
                aria-label={`View ${project.title} on GitHub`}
              >
                <Github className="w-5 h-5 text-white" />
              </a>
            )}
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white/20 backdrop-blur-md rounded-xl hover:bg-white/30 transition-colors border border-white/20"
                aria-label={`View ${project.title} demo`}
              >
                <ExternalLink className="w-5 h-5 text-white" />
              </a>
            )}
          </motion.div>

          {/* Color Accent */}
          <div className={cn('absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r', project.color)} />
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-display font-bold mb-2 group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium"
              >
                {tag}
              </span>
            ))}
            {project.tags.length > 4 && (
              <span className="px-2.5 py-1 bg-muted text-muted-foreground rounded-md text-xs font-medium">
                +{project.tags.length - 4}
              </span>
            )}
          </div>

          {/* Learn More Link */}
          <motion.button
            className="flex items-center gap-2 text-sm font-semibold text-primary group/btn"
            whileHover={{ x: 4 }}
          >
            <span>View Details</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default function ProjectsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <section ref={ref} className="relative py-20 lg:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.01]" style={{
        backgroundImage: `
          linear-gradient(to right, currentColor 1px, transparent 1px),
          linear-gradient(to bottom, currentColor 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
      }} />

      <div className="container-premium relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="bio-badge text-sm mb-4">Featured Work</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-4">
            Selected <span className="bio-gradient-text">Projects</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A showcase of my recent work, from mobile applications to web platforms.
            Each project is built with modern technologies and best practices.
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>

        {/* View More Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-center mt-12"
        >
          <a
            href="https://github.com/naiplawan"
            target="_blank"
            rel="noopener noreferrer"
            className="bio-button px-8 py-4 inline-flex items-center gap-2"
          >
            <span>View All Projects on GitHub</span>
            <Github className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
