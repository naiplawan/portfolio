'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  CalendarDays,
  MapPin,
  Briefcase,
  GraduationCap,
  Code,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface Experience {
  title: string;
  company: string;
  location: string;
  period: string;
  description: string[];
  type: 'work' | 'education';
}

const experiences: Experience[] = [
  {
    title: 'Software Developer',
    company: 'Unixdev Co., Ltd.',
    location: 'Bangkok, Thailand',
    period: 'July 2022 - Present',
    description: [
      'Developing web applications using React and TypeScript',
      'Implementing responsive designs and UI/UX best practices',
      'Optimizing application performance and load times',
      'Collaborating with cross-functional teams',
    ],
    type: 'work',
  },
  {
    title: 'Full Stack Developer',
    company: 'Turfmapp Co., Ltd.',
    location: 'Bangkok, Thailand',
    period: 'November 2024 - February 2025',
    description: [
      'Built and maintained web applications using React, Node.js, and Django',
      'Managed backend databases with MongoDB and PostgreSQL',
      'Deployed applications on DigitalOcean with Cloudflare',
      'Integrated AI technologies including LLM and RAG systems',
    ],
    type: 'work',
  },

  {
    title: 'B.E. Biological Science',
    company: 'Mahidol University',
    location: 'Bangkok, Thailand',
    period: '2014 - 2018',
    description: [
      'Graduated with a Bachelor of Engineering in Biological Science',
      'Relevant coursework: Data Analysis, Research Methodologies, Biotechnology',
      'Participated in various research projects and internships',
    ],
    type: 'education',
  },
];

function TimelineItem({
  experience,
  index,
}: {
  experience: Experience;
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  const icons = {
    work: <Briefcase className="w-5 h-5" />,
    education: <GraduationCap className="w-5 h-5" />,
  };

  const colors = {
    work: 'from-cyan-500 to-blue-600',
    education: 'from-violet-500 to-purple-600',
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      animate={
        isInView
          ? { opacity: 1, x: 0 }
          : { opacity: 0, x: index % 2 === 0 ? -50 : 50 }
      }
      transition={{
        delay: index * 0.15,
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className="relative"
    >
      {/* Timeline Line */}
      {index !== experiences.length - 1 && (
        <div className="absolute top-8 left-8 w-0.5 h-full bg-border/50 -z-10" />
      )}

      <div className="flex gap-4">
        {/* Icon */}
        <div
          className={cn(
            'w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white shrink-0',
            colors[experience.type],
          )}
        >
          {icons[experience.type]}
        </div>

        {/* Content */}
        <div className="bio-glass-card p-6 rounded-2xl flex-1">
          <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
            <div>
              <h3 className="text-lg font-display font-bold">
                {experience.title}
              </h3>
              <p className="text-primary font-medium">{experience.company}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3" />
                {experience.location}
              </p>
            </div>
            <span className="px-3 py-1 bg-muted rounded-full text-xs font-medium flex items-center gap-1.5 whitespace-nowrap">
              <CalendarDays className="w-3 h-3" />
              {experience.period}
            </span>
          </div>
          <ul className="text-sm text-muted-foreground space-y-1">
            {experience.description.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

export default function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

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
          <span className="bio-badge text-sm mb-4">About Me</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-4">
            My <span className="bio-gradient-text">Journey</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Bio Column */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
            transition={{ duration: 0.6 }}
          >
            {/* Profile Card */}
            <div className="bio-glass-card p-8 rounded-2xl mb-6">
              <h3 className="text-2xl font-display font-bold mb-4">
                Hi, I'm{' '}
                <span className="bio-gradient-text">Rachaphol Plookaom</span>
              </h3>

              <p className="text-muted-foreground mb-6 leading-relaxed">
                I'm a passionate Software Developer at Unixdev Co., Ltd. with
                expertise in frontend development (React, Next.js, TypeScript),
                backend development (Go, Fiber, Node.js), and mobile development
                (Flutter). I love building clean, scalable applications that
                solve real-world problems.
              </p>

              <p className="text-muted-foreground mb-6 leading-relaxed">
                Currently based in Bangkok, Thailand, I'm always eager to learn
                new technologies and take on challenging projects. When I'm not
                coding, you can find me exploring new tech trends, contributing
                to open source, or enjoying a good cup of coffee.
              </p>

              {/* Quick Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>Bangkok, Thailand</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Briefcase className="w-4 h-4 text-primary" />
                  <span>Software Developer at Unixdev</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Code className="w-4 h-4 text-primary" />
                  <span>3+ years of professional experience</span>
                </div>
              </div>
            </div>

            {/* Code Block Decoration */}
            <div className="bio-glass-card p-6 rounded-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-2 text-xs text-muted-foreground font-mono">
                  developer.ts
                </span>
              </div>
              <pre className="text-sm font-mono text-muted-foreground overflow-x-auto">
                <code>{`const developer = {
  name: "Rachaphol Plookaom",
  role: "Software Developer",
  location: "Bangkok, Thailand",
  skills: [
    "React", "Next.js", "TypeScript",
    "Go", "Fiber", "Flutter",
    "Node.js", "Python", "Django"
  ],
  available: true
};`}</code>
              </pre>
            </div>
          </motion.div>

          {/* Timeline Column */}
          <div className="space-y-6">
            <motion.h3
              initial={{ opacity: 0, x: 40 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-xl font-display font-bold mb-6"
            >
              Experience & Education
            </motion.h3>

            {experiences.map((experience, index) => (
              <TimelineItem key={index} experience={experience} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
