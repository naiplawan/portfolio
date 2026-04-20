'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import {
  Github,
  ExternalLink,
  Code2,
  AlertCircle,
  RefreshCw,
  ArrowUpRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useParallelData } from '@/lib/hooks/use-parallel-data';

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
  const [retryCount, setRetryCount] = useState(0)

  const fetchProjects = async (): Promise<Project[]> => {
    const response = await fetch('/api/github/projects');
    if (!response.ok) {
      throw new Error(`Failed to fetch projects (${response.status})`);
    }
    const data = await response.json();
    return data.projects || [];
  };

  const { data: projects, isLoading, error } = useParallelData(fetchProjects, [retryCount], []);

  const retry = () => {
    setRetryCount(prev => prev + 1)
  }

  return { projects: projects ?? [], isLoading, error, retry };
}

function ProjectCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[var(--radius)] border border-[hsl(var(--border))]">
      <Skeleton className="aspect-[16/10] w-full" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{
        delay: index * 0.08,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="project-card group border border-[hsl(var(--border))] bg-card overflow-hidden"
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[16/10] bg-muted">
        <img
          src={project.image}
          alt={project.title}
          className="project-image w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {project.featured && (
            <span className="rounded-full bg-foreground/80 px-2.5 py-1 text-[10px] font-medium text-background backdrop-blur-sm uppercase tracking-wider">
              Featured
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
          {project.technologies.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-mono text-muted-foreground"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-mono text-muted-foreground">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function ProjectsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const { projects, isLoading, error, retry } = useGitHubProjects();

  const displayedProjects = projects
    .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    .slice(0, 6);

  return (
    <section ref={ref} className="section-padding">
      <div className="container-premium">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="section-label mb-3">Selected Work</p>
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-3xl sm:text-4xl tracking-tight">
              Projects
            </h2>
            <a
              href="https://github.com/naiplawan"
              target="_blank"
              rel="noopener noreferrer"
              className="link-animated text-sm text-muted-foreground"
            >
              View all on GitHub
            </a>
          </div>
        </motion.div>

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center py-20 text-center"
          >
            <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="text-lg font-display mb-2">Unable to load projects</h3>
            <p className="text-sm text-muted-foreground mb-6">{error}</p>
            <Button onClick={retry} variant="outline" size="sm" className="gap-2">
              <RefreshCw className="h-3.5 w-3.5" />
              Try Again
            </Button>
          </motion.div>
        )}

        {/* Grid */}
        {!isLoading && !error && displayedProjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayedProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        )}

        {/* Empty */}
        {!isLoading && !error && displayedProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center py-20 text-center"
          >
            <Code2 className="h-10 w-10 text-muted-foreground opacity-50 mb-4" />
            <h3 className="text-lg font-display mb-2">No projects found</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Check back later or visit GitHub directly.
            </p>
            <Button asChild variant="outline" size="sm">
              <a
                href="https://github.com/naiplawan"
                target="_blank"
                rel="noopener noreferrer"
                className="gap-2"
              >
                <Github className="h-3.5 w-3.5" />
                View GitHub Profile
              </a>
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
