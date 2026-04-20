'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ExternalLink, Github, Loader2, AlertCircle, ArrowUpRight } from 'lucide-react'
import { Project } from '@/lib/types/types'

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.06,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="project-card group border border-[hsl(var(--border))] bg-card overflow-hidden"
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[16/10] bg-muted">
        <Image
          src={project.image}
          alt={`${project.title} project screenshot`}
          fill
          className="project-image object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {project.featured && (
            <span className="rounded-full bg-foreground/80 px-2.5 py-1 text-[10px] font-medium text-background backdrop-blur-sm uppercase tracking-wider">
              Featured
            </span>
          )}
          {project.status === 'live' && (
            <span className="rounded-full bg-green-600/80 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-sm uppercase tracking-wider">
              Live
            </span>
          )}
        </div>

        {/* Hover links */}
        <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-foreground backdrop-blur-sm transition-transform hover:scale-105"
              aria-label={`View ${project.title} on GitHub`}
            >
              <Github className="h-4 w-4" />
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-foreground backdrop-blur-sm transition-transform hover:scale-105"
              aria-label={`View ${project.title} live demo`}
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-display text-lg leading-tight group-hover:text-[hsl(var(--accent))] transition-colors">
            {project.title}
          </h3>
          <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {project.technologies.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-mono text-muted-foreground"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-mono text-muted-foreground">
              +{project.technologies.length - 4}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default function ProjectsPage() {
  const [allProjects, setAllProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadProjects() {
      try {
        const response = await fetch('/api/github/projects')
        if (!response.ok) throw new Error('Failed to fetch projects')
        const data = await response.json()
        const projects = data.projects || []
        setAllProjects(projects)
        setFilteredProjects(projects)
        setError(null)
      } catch (err) {
        setError('Failed to load projects. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }
    loadProjects()
  }, [])

  const categories = ['all', ...Array.from(new Set(allProjects.map(p => p.category)))]

  const handleFilter = (category: string) => {
    setSelectedCategory(category)
    if (category === 'all') {
      setFilteredProjects(allProjects)
    } else {
      setFilteredProjects(allProjects.filter(p => p.category === category))
    }
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="container-premium section-padding">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="section-label mb-3">Work</p>
          <h1 className="font-display text-4xl sm:text-5xl tracking-tight">
            All Projects
          </h1>
          <p className="mt-4 max-w-lg text-muted-foreground">
            A showcase of my open source work, synced from GitHub.
          </p>
        </motion.div>

        {/* Category Filters */}
        {!error && !isLoading && categories.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="mb-10 flex flex-wrap gap-2"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleFilter(category)}
                className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                  selectedCategory === category
                    ? 'bg-foreground text-background'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </motion.div>
        )}

        {/* Error */}
        {error && (
          <div className="flex flex-col items-center py-20 text-center">
            <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="text-lg font-display mb-2">Unable to load projects</h3>
            <p className="text-sm text-muted-foreground mb-6">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline" size="sm">
              Try Again
            </Button>
          </div>
        )}

        {/* Loading */}
        {!error && isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* Grid */}
        {!error && !isLoading && filteredProjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        )}

        {/* Empty */}
        {!error && !isLoading && filteredProjects.length === 0 && (
          <div className="flex flex-col items-center py-20 text-center">
            <p className="text-muted-foreground">No projects found in this category.</p>
          </div>
        )}
      </div>
    </div>
  )
}
