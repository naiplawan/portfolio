'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
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
}

const skillCategories: SkillCategory[] = [
  {
    title: 'Frontend',
    icon: Code,
    description: 'Building modern, responsive user interfaces',
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
    skills: [{ name: 'Flutter' }, { name: 'Dart' }, { name: 'Cross-platform Development' }],
  },
  {
    title: 'Tools & Others',
    icon: Monitor,
    description: 'Development tools and additional technologies',
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
        stiffness: 300,
        damping: 24,
      },
    },
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
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight">
            Technology Stack
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto font-light px-2">
            Production-ready expertise across modern web technologies, cloud platforms, and AI integration
          </p>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 mt-4 sm:mt-6 px-4">
            <div className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-secondary rounded-full border border-border">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-foreground rounded-full"></div>
              <span className="text-xs sm:text-sm text-foreground font-medium">Currently at Unixdev</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-secondary rounded-full border border-border">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-foreground rounded-full"></div>
              <span className="text-xs sm:text-sm text-foreground font-medium">Frontend Specialist</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-secondary rounded-full border border-border">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-foreground rounded-full"></div>
              <span className="text-xs sm:text-sm text-foreground font-medium">Full Stack Capable</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8"
        >
          {skillCategories.map((category) => (
            <motion.div
              key={category.title}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-border hover:border-foreground/20 transition-all duration-300"
            >
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-secondary rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                    <category.icon className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg sm:text-xl font-semibold text-foreground truncate">{category.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{category.description}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {category.skills.map((skill, skillIndex) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: skillIndex * 0.1 }}
                      className="flex items-center gap-1.5 sm:gap-2 bg-secondary px-2 py-1.5 sm:px-3 sm:py-2 rounded-md sm:rounded-lg border border-border"
                    >
                      <span className="text-xs sm:text-sm font-medium text-foreground">{skill.name}</span>
                      {skill.years && (
                        <Badge variant="outline" className="text-xs text-foreground border-border px-1 py-0">
                          {skill.years}y
                        </Badge>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-20 text-center"
        >
          <div className="bg-card rounded-2xl p-8 max-w-4xl mx-auto border border-border">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-foreground" />
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-foreground mb-4">Continuous Learning</h3>
            <p className="text-lg text-muted-foreground font-light leading-relaxed">
              Technology evolves rapidly, and so do I. I'm constantly exploring new frameworks, tools, and methodologies
              to stay at the forefront of modern development.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
