'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, Github, Loader2 } from 'lucide-react'
import ProjectFilter from '@/components/portfolio/ProjectFilterSimple'
import { Project } from '@/lib/types/types'

// Project demo components
const ProjectDemo = ({ project }: { project: Project }) => {
  // Use GitHub Open Graph image if available, otherwise use the image from project data
  const projectImage = project.image

  return (
    <Card className="h-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between mb-3">
            <div className="flex gap-2 flex-wrap">
              <Badge variant="secondary" className="text-xs">
                {project.category}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {project.completedYear}
              </Badge>
              {project.status === 'live' && (
                <Badge className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                  Live
                </Badge>
              )}
            </div>
            {project.featured && (
              <Badge className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">
                Featured
              </Badge>
            )}
          </div>

          <div className="relative overflow-hidden rounded-lg mb-4 aspect-video">
            <Image
              src={projectImage}
              alt={`${project.title} project screenshot`}
              fill
              className="transition-transform duration-300 group-hover:scale-105 object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          <CardTitle className="text-lg group-hover:text-terracotta transition-colors">
            {project.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {project.description}
          </p>

          {project.problemStatement && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Problem:</p>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {project.problemStatement}
              </p>
            </div>
          )}

          {project.solution && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Solution:</p>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {project.solution}
              </p>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex flex-wrap gap-1">
              {project.technologies.slice(0, 4).map((tech) => (
                <Badge key={tech} variant="outline" className="text-xs">
                  {tech}
                </Badge>
              ))}
              {project.technologies.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{project.technologies.length - 4} more
                </Badge>
              )}
            </div>

            {project.highlights && project.highlights.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {project.highlights.slice(0, 3).map((highlight, index) => (
                  <span
                    key={index}
                    className="text-xs bg-terracotta/10 text-terracotta px-2 py-1 rounded-full"
                  >
                    {highlight}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            {project.liveUrl && (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  Live Demo
                </a>
              </Button>
            )}

            {project.githubUrl && (
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4" />
                </a>
              </Button>
            )}

            {project.liveUrl && project.liveUrl !== project.githubUrl && (
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            )}
          </div>

          {project.metrics?.performance && (
            <div className="text-xs text-muted-foreground text-center pt-2 border-t">
              ⭐ {project.metrics.performance}
            </div>
          )}
        </CardContent>
      </Card>
    )
}

export default function ProjectsPage() {
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadProjects() {
      try {
        const response = await fetch('/api/github/projects')
        const data = await response.json()
        setFilteredProjects(data.projects || [])
      } catch (error) {
        console.error('Failed to load projects:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadProjects()
  }, [])

  const categories = ['all', ...Array.from(new Set(filteredProjects.map(p => p.category)))]

  const handleFilter = (category: string) => {
    setIsLoading(true)
    setSelectedCategory(category)

    setTimeout(async () => {
      if (category === 'all') {
        // Re-fetch from GitHub when showing all
        try {
          const response = await fetch('/api/github/projects')
          const data = await response.json()
          setFilteredProjects(data.projects || [])
        } catch (error) {
          console.error('Failed to reload projects:', error)
        }
      } else {
        setFilteredProjects(filteredProjects.filter(p => p.category === category))
      }
      setIsLoading(false)
    }, 300)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 24
      }
    }
  }

  return (
    <div className="min-h-screen pt-14">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="px-6 lg:px-8 py-16"
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 space-y-4">
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-terracotta to-sage-beige bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Project Showcase
            </motion.h1>
            <motion.p
              className="text-lg text-muted-foreground max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Explore my latest projects from GitHub. These repositories showcase my work in web development, tools, and more.
            </motion.p>
          </div>

          {/* Initial loading state */}
          {isLoading && filteredProjects.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-terracotta mx-auto mb-4" />
                <p className="text-muted-foreground">Loading projects from GitHub...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Project Filter */}
              <motion.div
                className="flex flex-wrap justify-center gap-2 mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <ProjectFilter
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onFilter={handleFilter}
                />
              </motion.div>

              {/* Projects Grid */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredProjects.map((project) => (
                  <motion.div key={project.id} variants={itemVariants}>
                    <ProjectDemo project={project} />
                  </motion.div>
                ))}
              </motion.div>
            </>
          )}

          {!isLoading && filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No projects found in this category.</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
