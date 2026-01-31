'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import {
  Github,
  ExternalLink,
  ChevronRight,
  Code2,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  githubUrl: string;
  liveUrl?: string;
  featured: boolean;
  category: string;
  status: string;
  metrics?: {
    users?: string;
    performance?: string;
    responseTime?: string;
  };
}

function useGitHubProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/github/projects');
        if (!response.ok) throw new Error('Failed to fetch projects');
        const data = await response.json();
        setProjects(data.projects || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load projects');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return { projects, isLoading, error };
}

function ProjectCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-[16/10] w-full" />
      <CardContent className="p-6 space-y-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [isHovered, setIsHovered] = useState(false);

  // Generate gradient color based on category
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      web: 'from-blue-500 to-cyan-500',
      mobile: 'from-purple-500 to-pink-500',
      backend: 'from-green-500 to-emerald-500',
      ai: 'from-orange-500 to-red-500',
      tools: 'from-yellow-500 to-amber-500',
      other: 'from-gray-500 to-slate-500',
    };
    return colors[category] || colors.other;
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{
        delay: index * 0.1,
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className="group relative"
    >
      <Card
        className="overflow-hidden h-full transition-all duration-500 hover:shadow-xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative overflow-hidden aspect-[16/10]">
          <motion.img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.7 }}
            onError={(e) => {
              // Fallback to gradient if image fails
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.classList.add('bg-gradient-to-br', getCategoryColor(project.category));
            }}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60" />

          {/* Featured Badge */}
          {project.featured && (
            <div className="absolute top-4 left-4">
              <Badge variant="secondary" className="backdrop-blur-md bg-white/20 text-white border-white/20">
                Featured
              </Badge>
            </div>
          )}

          {/* Status Badge */}
          <div className="absolute top-4 right-4">
            <Badge
              variant="outline"
              className={cn(
                'backdrop-blur-md border-white/20 text-white',
                project.status === 'live' && 'bg-green-500/20',
                project.status === 'development' && 'bg-yellow-500/20',
                project.status === 'archived' && 'bg-gray-500/20',
              )}
            >
              {project.status}
            </Badge>
          </div>

          {/* Hover Actions */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {project.githubUrl && (
              <Button
                variant="secondary"
                size="icon"
                className="backdrop-blur-md bg-white/20 hover:bg-white/30 border-white/20"
                asChild
              >
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${project.title} on GitHub`}
                >
                  <Github className="w-5 h-5" />
                </a>
              </Button>
            )}
            {project.liveUrl && (
              <Button
                variant="secondary"
                size="icon"
                className="backdrop-blur-md bg-white/20 hover:bg-white/30 border-white/20"
                asChild
              >
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${project.title} live demo`}
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              </Button>
            )}
          </motion.div>

          {/* Color Accent */}
          <div
            className={cn(
              'absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r',
              getCategoryColor(project.category),
            )}
          />
        </div>

        {/* Content */}
        <CardContent className="p-6">
          <h3 className="text-xl font-display font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">
            {project.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {project.description}
          </p>

          {/* Technologies */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.slice(0, 4).map((tech) => (
              <Badge key={tech} variant="outline" className="text-xs">
                {tech}
              </Badge>
            ))}
            {project.technologies.length > 4 && (
              <Badge variant="secondary" className="text-xs">
                +{project.technologies.length - 4}
              </Badge>
            )}
          </div>

          {/* Metrics */}
          {project.metrics && (
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              {project.metrics.performance && (
                <span>⭐ {project.metrics.performance}</span>
              )}
              {project.metrics.users && (
                <span>🍴 {project.metrics.users}</span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function ProjectsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const { projects, isLoading, error } = useGitHubProjects();

  // Show only featured or top 6 projects
  const displayedProjects = projects
    .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    .slice(0, 6);

  return (
    <section ref={ref} className="relative py-20 lg:py-32">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.01]"
        style={{
          backgroundImage: `
          linear-gradient(to right, currentColor 1px, transparent 1px),
          linear-gradient(to bottom, currentColor 1px, transparent 1px)
        `,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="container-premium relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge variant="secondary" className="mb-4">
            <Code2 className="w-3 h-3 mr-1" />
            GitHub Projects
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-4">
            Selected <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Projects</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A showcase of my open source work, automatically synced from GitHub.
            Each project represents real-world solutions built with modern technologies.
          </p>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        )}

        {/* Projects Grid */}
        {!isLoading && !error && displayedProjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && displayedProjects.length === 0 && (
          <div className="text-center py-12">
            <Code2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No projects found</p>
          </div>
        )}

        {/* View More Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-center mt-12"
        >
          <Button asChild size="lg">
            <a
              href="https://github.com/naiplawan"
              target="_blank"
              rel="noopener noreferrer"
            >
              View All Projects on GitHub
              <Github className="w-4 h-4 ml-2" />
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
