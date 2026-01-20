'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, Github, Play, X } from 'lucide-react'
import ProjectFilter from '@/components/portfolio/ProjectFilterSimple'
import { ContentLoader } from '@/components/ui/loading-states'
import { FALLBACK_PROJECTS } from '@/lib/data/projects-data'

// Project demo components
const ProjectDemo = ({ project }: { project: typeof FALLBACK_PROJECTS[0] }) => {
  const [showDemo, setShowDemo] = useState(false)
  const [demoLoaded, setDemoLoaded] = useState(false)

  const handleDemoClick = () => {
    setShowDemo(true)
    // Simulate demo loading
    setTimeout(() => setDemoLoaded(true), 800)
  }

  const handleCloseDemo = () => {
    setShowDemo(false)
    setDemoLoaded(false)
  }

  return (
    <>
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

          <div className="relative overflow-hidden rounded-lg mb-4">
            <Image
              src={project.image}
              alt={`${project.title} project screenshot`}
              fill
              className="transition-transform duration-300 group-hover:scale-105"
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

          <div className="space-y-2">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Problem:</p>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {project.problemStatement}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Solution:</p>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {project.solution}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap gap-1">
              {project.technologies.slice(0, 4).map((tech: string) => (
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

            <div className="flex flex-wrap gap-2">
              {project.highlights?.slice(0, 3).map((highlight: string, index: number) => (
                <span
                  key={index}
                  className="text-xs bg-terracotta/10 text-terracotta px-2 py-1 rounded-full"
                >
                  {highlight}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleDemoClick}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <Play className="w-3 h-3 mr-1" />
              Live Demo
            </Button>

            {project.liveUrl && (
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
          </div>
        </CardContent>
      </Card>

      {/* Interactive Demo Modal */}
      {showDemo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={handleCloseDemo}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-background rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">{project.title} - Interactive Demo</h3>
              <Button variant="ghost" size="sm" onClick={handleCloseDemo}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-4">
              <ContentLoader isLoading={!demoLoaded} count={1}>
                <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden" style={{ height: '500px' }}>
                  {demoLoaded ? (
                    <div className="p-6">
                      <div className="text-center mb-6">
                        <h4 className="text-xl font-bold mb-2">{project.title} Demo</h4>
                        <p className="text-muted-foreground">Interactive demonstration of {project.title}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow">
                            <h5 className="font-semibold mb-2">Tech Stack</h5>
                            <div className="flex flex-wrap gap-2">
                              {project.technologies.map((tech: string) => (
                                <Badge key={tech} variant="secondary">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow">
                            <h5 className="font-semibold mb-2">Key Features</h5>
                            <ul className="space-y-1">
                              {project.highlights?.map((highlight: string, index: number) => (
                                <li key={index} className="text-sm flex items-center">
                                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2" />
                                  {highlight}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow">
                            <h5 className="font-semibold mb-2">Problem Statement</h5>
                            <p className="text-sm text-muted-foreground">{project.problemStatement}</p>
                          </div>

                          <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow">
                            <h5 className="font-semibold mb-2">Solution</h5>
                            <p className="text-sm text-muted-foreground">{project.solution}</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 text-center">
                        <Button asChild className="bg-terracotta hover:bg-terracotta/90">
                          <a href={project.liveUrl || '#'} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View Live Project
                          </a>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="animate-spin w-8 h-8 border-4 border-terracotta border-t-transparent rounded-full mx-auto mb-2" />
                        <p className="text-muted-foreground">Loading demo...</p>
                      </div>
                    </div>
                  )}
                </div>
              </ContentLoader>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  )
}

export default function ProjectsPage() {
  const [filteredProjects, setFilteredProjects] = useState(FALLBACK_PROJECTS)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isLoading, setIsLoading] = useState(false)

  const categories = ['all', ...Array.from(new Set(FALLBACK_PROJECTS.map(p => p.category)))]

  const handleFilter = (category: string) => {
    setIsLoading(true)
    setSelectedCategory(category)

    // Simulate filtering delay
    setTimeout(() => {
      if (category === 'all') {
        setFilteredProjects(FALLBACK_PROJECTS)
      } else {
        setFilteredProjects(FALLBACK_PROJECTS.filter(p => p.category === category))
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
              Explore my latest projects and interactive demonstrations. Click on any project to see a detailed demo.
            </motion.p>
          </div>

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
            <ContentLoader isLoading={isLoading} count={filteredProjects.length}>
              {filteredProjects.map((project) => (
                <motion.div key={project.id} variants={itemVariants}>
                  <ProjectDemo project={project} />
                </motion.div>
              ))}
            </ContentLoader>
          </motion.div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No projects found in this category.</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}