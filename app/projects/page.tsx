'use client';

import React, { useMemo, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import NavBar from '@/components/portfolio/NavBar';
import ProjectFilter from '@/components/portfolio/ProjectFilter';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { projects, getFeaturedProjects } from '@/lib/projects-data';
import { Project, ProjectCardProps } from '@/lib/types';
import ExternalLink from '@/components/ui/icons/ExternalLink';
import Github from '@/components/ui/icons/Github';
import { Star, TrendingUp, Users, Zap, Clock } from 'lucide-react';

const StatusBadge = React.memo(({ status }: { status: Project['status'] }) => {
  const statusConfig = {
    live: { label: 'Live', color: 'bg-green-500', icon: Zap },
    development: { label: 'In Development', color: 'bg-yellow-500', icon: Clock },
    archived: { label: 'Archived', color: 'bg-gray-500', icon: Clock },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge className={`${config.color} text-white`}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  );
});

StatusBadge.displayName = 'StatusBadge';

const MetricsCard = React.memo(({ metrics }: { metrics: Project['metrics'] }) => {
  if (!metrics) return null;

  return (
    <div className="grid grid-cols-2 gap-2 p-3 bg-muted/50 rounded-lg">
      {metrics.users && (
        <div className="flex items-center gap-1 text-sm">
          <Users className="w-3 h-3 text-blue-500" />
          <span className="text-xs text-muted-foreground">{metrics.users}</span>
        </div>
      )}
      {metrics.performance && (
        <div className="flex items-center gap-1 text-sm">
          <TrendingUp className="w-3 h-3 text-green-500" />
          <span className="text-xs text-muted-foreground">{metrics.performance}</span>
        </div>
      )}
      {metrics.responseTime && (
        <div className="flex items-center gap-1 text-sm">
          <Zap className="w-3 h-3 text-yellow-500" />
          <span className="text-xs text-muted-foreground">{metrics.responseTime}</span>
        </div>
      )}
      {metrics.uptime && (
        <div className="flex items-center gap-1 text-sm">
          <Clock className="w-3 h-3 text-purple-500" />
          <span className="text-xs text-muted-foreground">{metrics.uptime}</span>
        </div>
      )}
    </div>
  );
});

MetricsCard.displayName = 'MetricsCard';

const ProjectCard = React.memo(({ project, index }: ProjectCardProps) => {
  const handleGithubClick = useCallback(() => {
    window.open(project.githubUrl, '_blank', 'noopener,noreferrer');
  }, [project.githubUrl]);

  const handleLiveClick = useCallback(() => {
    window.open(project.liveUrl, '_blank', 'noopener,noreferrer');
  }, [project.liveUrl]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      role="article"
      aria-labelledby={`project-title-${project.id}`}
      className="group"
    >
      <Card className="h-full shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:scale-[1.02] border-0 bg-gradient-to-br from-background to-muted/20">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              {project.featured && (
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                  <Star className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              )}
              <StatusBadge status={project.status} />
            </div>
            <span className="text-xs text-muted-foreground">{project.completedYear}</span>
          </div>

          <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden group-hover:scale-105 transition-transform duration-500">
            <Image
              src={project.image}
              alt={`${project.title} - ${project.description.slice(0, 80)}...`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={project.featured}
            />
          </div>

          <CardTitle
            id={`project-title-${project.id}`}
            className="text-xl group-hover:text-primary transition-colors duration-300"
          >
            {project.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <p className="text-muted-foreground text-sm font-medium mb-1">Problem</p>
            <p className="text-sm text-foreground/80 mb-3">{project.problemStatement}</p>

            <p className="text-muted-foreground text-sm font-medium mb-1">Solution</p>
            <p className="text-sm text-foreground/80">{project.solution}</p>
          </div>

          <Separator />

          <MetricsCard metrics={project.metrics} />

          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <Badge
                key={tech}
                variant="secondary"
                className="text-xs hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {tech}
              </Badge>
            ))}
          </div>

          {project.highlights && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Key Features</h4>
              <div className="flex flex-wrap gap-1">
                {project.highlights.map((highlight) => (
                  <Badge key={highlight} variant="outline" className="text-xs">
                    {highlight}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleGithubClick}
              className="flex-1 group-hover:border-primary transition-colors"
              aria-label={`View ${project.title} source code on GitHub`}
            >
              <Github size={16} />
              Source
            </Button>
            {project.liveUrl && (
              <Button
                size="sm"
                onClick={handleLiveClick}
                className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
                aria-label={`View ${project.title} live demo`}
              >
                <ExternalLink size={16} />
                Live Demo
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

ProjectCard.displayName = 'ProjectCard';

const FeaturedProject = React.memo(({ project }: { project: Project }) => {
  const handleGithubClick = useCallback(() => {
    window.open(project.githubUrl, '_blank', 'noopener,noreferrer');
  }, [project.githubUrl]);

  const handleLiveClick = useCallback(() => {
    window.open(project.liveUrl, '_blank', 'noopener,noreferrer');
  }, [project.liveUrl]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="mb-16"
    >
      <Card className="overflow-hidden bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20 shadow-2xl">
        <div className="grid lg:grid-cols-2 gap-0">
          <div className="relative h-64 lg:h-full">
            <Image
              src={project.image}
              alt={`Featured project: ${project.title}`}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute top-4 left-4">
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm">
                <Star className="w-4 h-4 mr-1" />
                Featured Project
              </Badge>
            </div>
          </div>

          <div className="p-8 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-4">
              <StatusBadge status={project.status} />
              <span className="text-sm text-muted-foreground">{project.completedYear}</span>
            </div>

            <h2 className="text-3xl font-bold mb-4">{project.title}</h2>

            <div className="space-y-4 mb-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Challenge</p>
                <p className="text-sm">{project.problemStatement}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Solution</p>
                <p className="text-sm">{project.solution}</p>
              </div>
            </div>

            <MetricsCard metrics={project.metrics} />

            <div className="flex flex-wrap gap-2 my-4">
              {project.technologies.slice(0, 4).map((tech) => (
                <Badge key={tech} variant="secondary" className="text-xs">
                  {tech}
                </Badge>
              ))}
              {project.technologies.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{project.technologies.length - 4} more
                </Badge>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleGithubClick}
                className="flex-1"
                aria-label={`View ${project.title} source code on GitHub`}
              >
                <Github size={16} />
                View Source
              </Button>
              {project.liveUrl && (
                <Button
                  onClick={handleLiveClick}
                  className="flex-1 bg-gradient-to-r from-primary to-primary/80"
                  aria-label={`View ${project.title} live demo`}
                >
                  <ExternalLink size={16} />
                  Live Demo
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
});

FeaturedProject.displayName = 'FeaturedProject';

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTechnology, setSelectedTechnology] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const featuredProjects = useMemo(() => getFeaturedProjects(), []);

  // Get all unique technologies
  const allTechnologies = useMemo(() => {
    const techSet = new Set<string>();
    projects.forEach((project) => {
      project.technologies.forEach((tech) => techSet.add(tech));
    });
    return Array.from(techSet).sort();
  }, []);

  // Filter projects based on search and filters
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        searchQuery === '' ||
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTechnology =
        selectedTechnology === 'all' || project.technologies.includes(selectedTechnology);

      const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus;

      return matchesSearch && matchesTechnology && matchesStatus;
    });
  }, [searchQuery, selectedTechnology, selectedStatus]);

  return (
    <>
      <NavBar />
      <main className="pt-24 pb-16 px-6 lg:px-8">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">Portfolio Projects</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            A showcase of full-stack applications demonstrating modern web development practices, from AI-powered
            solutions to enterprise-grade platforms.
          </p>
        </motion.header>

        {/* Filter Component */}
        <div className="max-w-7xl mx-auto">
          <ProjectFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedTechnology={selectedTechnology}
            onTechnologyChange={setSelectedTechnology}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            technologies={allTechnologies}
          />
        </div>

        {/* Featured Project Section */}
        {featuredProjects.length > 0 && (
          <section aria-labelledby="featured-projects">
            <motion.h2
              id="featured-projects"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-semibold mb-8 text-center"
            >
              Featured Work
            </motion.h2>
            {featuredProjects.map((project) => (
              <FeaturedProject key={project.id} project={project} />
            ))}
          </section>
        )}

        {/* All Projects Section */}
        <section aria-labelledby="all-projects">
          <motion.h2
            id="all-projects"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-2xl font-semibold mb-8 text-center"
          >
            All Projects {filteredProjects.length < projects.length && `(${filteredProjects.length})`}
          </motion.h2>

          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                No projects found matching your filters. Try adjusting your search criteria.
              </p>
            </div>
          )}
        </section>
      </main>

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Portfolio Projects',
            description: 'Full-stack web development projects by Naiplawan',
            author: {
              '@type': 'Person',
              name: 'Naiplawan',
            },
            mainEntity: projects.map((project) => ({
              '@type': 'SoftwareApplication',
              name: project.title,
              description: project.description,
              url: project.liveUrl,
              applicationCategory: 'WebApplication',
              operatingSystem: 'Web Browser',
            })),
          }),
        }}
      />
    </>
  );
}
