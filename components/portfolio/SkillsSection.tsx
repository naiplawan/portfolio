'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { ClayCard } from '@/components/ui/clay-card';
import { Code, Database, Cloud, Brain, Smartphone, Zap, Monitor } from 'lucide-react';

interface Skill {
  name: string;
  years?: number;
}

interface SkillCategory {
  title: string;
  icon: any;
  skills: Skill[];
  description: string;
  variant: 'sage' | 'beige' | 'terracotta';
}

const skillCategories: SkillCategory[] = [
  {
    title: 'Frontend',
    icon: Code,
    description: 'Building modern, responsive user interfaces',
    variant: 'sage',
    skills: [
      { name: 'HTML5 & CSS3' },
      { name: 'JavaScript' },
      { name: 'React.js' },
      { name: 'Next.js' },
      { name: 'TypeScript' },
      { name: 'Tailwind CSS' },
      { name: 'Ant Design' },
    ],
  },
  {
    title: 'Backend',
    icon: Database,
    description: 'Server-side development and API design',
    variant: 'beige',
    skills: [
      { name: 'Python' },
      { name: 'Django' },
      { name: 'Node.js' },
      { name: 'Express.js' },
      { name: 'Go' },
      { name: 'Go Fiber' },
      { name: 'REST APIs' },
    ],
  },
  {
    title: 'Database',
    icon: Database,
    description: 'Data storage and management solutions',
    variant: 'terracotta',
    skills: [
      { name: 'PostgreSQL' },
      { name: 'MongoDB' },
      { name: 'SQL' },
      { name: 'pgAdmin' },
      { name: 'Elasticsearch' },
    ],
  },
  {
    title: 'AI & ML',
    icon: Brain,
    description: 'Artificial intelligence and machine learning integration',
    variant: 'sage',
    skills: [
      { name: 'Large Language Models (LLM)' },
      { name: 'Retrieval-Augmented Generation (RAG)' },
      { name: 'AI Integration' },
    ],
  },
  {
    title: 'Cloud & DevOps',
    icon: Cloud,
    description: 'Cloud infrastructure and deployment',
    variant: 'beige',
    skills: [
      { name: 'DigitalOcean' },
      { name: 'Cloudflare' },
      { name: 'Docker' },
      { name: 'CI/CD' },
      { name: 'Nginx' },
    ],
  },
  {
    title: 'Mobile & Apps',
    icon: Smartphone,
    description: 'Cross-platform mobile development',
    variant: 'terracotta',
    skills: [{ name: 'Flutter' }, { name: 'Dart' }, { name: 'Cross-platform Development' }],
  },
  {
    title: 'Tools & Others',
    icon: Monitor,
    description: 'Development tools and additional technologies',
    variant: 'sage',
    skills: [
      { name: 'Git' },
      { name: 'Postman' },
      { name: 'Webflow' },
      { name: 'Wagtail CMS' },
      { name: 'Manual Software Testing' },
    ],
  },
];

export default function SkillsSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 200,
        damping: 20,
      },
    },
  };

  const getAccentColor = (variant: 'sage' | 'beige' | 'terracotta') => {
    switch (variant) {
      case 'sage':
        return '#A8BBA3';
      case 'beige':
        return '#C4A484';
      case 'terracotta':
        return '#B87C4C';
    }
  };

  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16 space-y-4"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight font-display earth-text">
            Technology Stack
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto font-light px-2">
            Production-ready expertise across modern web technologies, cloud platforms, and AI integration
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-6 px-4">
            <ClayCard variant="sage" className="inline-flex items-center gap-2 px-4 py-2 rounded-full">
              <div className="w-3 h-3 rounded-full bg-terracotta"></div>
              <span className="text-sm font-medium">Currently at Unixdev</span>
            </ClayCard>
            <ClayCard variant="beige" className="inline-flex items-center gap-2 px-4 py-2 rounded-full">
              <div className="w-3 h-3 rounded-full bg-sage"></div>
              <span className="text-sm font-medium">Frontend Specialist</span>
            </ClayCard>
            <ClayCard variant="terracotta" className="inline-flex items-center gap-2 px-4 py-2 rounded-full">
              <div className="w-3 h-3 rounded-full bg-beige"></div>
              <span className="text-sm font-medium">Full Stack Capable</span>
            </ClayCard>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {skillCategories.map((category) => (
            <motion.div
              key={category.title}
              variants={itemVariants}
              className="h-full"
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <ClayCard variant={category.variant} className="h-full">
                <div className="space-y-5">
                  <div className="flex items-center space-x-4">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg"
                      style={{
                        backgroundColor: getAccentColor(category.variant),
                      }}
                    >
                      <category.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-xl font-semibold text-foreground font-display">
                        {category.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {category.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill) => (
                      <motion.span
                        key={skill.name}
                        whileHover={{ scale: 1.05 }}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-cream border-2 border-beige/20 hover:border-terracotta/30 transition-all cursor-default shadow-sm"
                      >
                        <span className="text-sm font-medium text-foreground">
                          {skill.name}
                        </span>
                        {skill.years && (
                          <Badge
                            variant="outline"
                            className="text-xs text-foreground border-beige/30 px-2 py-0 rounded-lg bg-beige/10"
                          >
                            {skill.years}y
                          </Badge>
                        )}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </ClayCard>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-20 text-center"
        >
          <ClayCard variant="beige" className="p-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg bg-terracotta"
              >
                <Zap className="w-8 h-8 text-white" />
              </motion.div>
            </div>
            <h3 className="text-2xl font-semibold text-foreground mb-4 font-display earth-text">
              Continuous Learning
            </h3>
            <p className="text-lg text-muted-foreground font-light leading-relaxed">
              Technology evolves rapidly, and so do I. I'm constantly exploring new frameworks, tools, and
              methodologies to stay at the forefront of modern development.
            </p>
          </ClayCard>
        </motion.div>
      </div>
    </section>
  );
}
