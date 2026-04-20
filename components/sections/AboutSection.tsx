'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { MapPin, Briefcase, Code } from 'lucide-react';

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
    period: 'Feb 2025 - Present',
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
    period: 'Nov 2024 - Feb 2025',
    description: [
      'Built web applications using React, Node.js, and Django',
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
      'Bachelor of Engineering in Biological Science',
      'Relevant coursework: Data Analysis, Research Methodologies',
      'Participated in research projects and internships',
    ],
    type: 'education',
  },
];

export default function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section ref={ref} className="section-padding">
      <div className="container-premium">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <p className="section-label mb-3">About</p>
          <h2 className="font-display text-3xl sm:text-4xl tracking-tight">
            A bit about me
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Bio Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <p className="text-muted-foreground leading-relaxed mb-6">
              I'm a software developer at Unixdev Co., Ltd. with expertise in
              frontend development (React, Next.js, TypeScript), backend (Go, Fiber,
              Node.js), and mobile (Flutter). I build clean, scalable applications
              that solve real-world problems.
            </p>

            <p className="text-muted-foreground leading-relaxed mb-8">
              Based in Bangkok, Thailand. Always eager to learn new technologies
              and take on challenging projects.
            </p>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>Bangkok, Thailand</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Briefcase className="h-4 w-4 shrink-0" />
                <span>Software Developer at Unixdev</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Code className="h-4 w-4 shrink-0" />
                <span>3+ years of professional experience</span>
              </div>
            </div>
          </motion.div>

          {/* Timeline Column */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-medium mb-8 pb-3 border-b border-[hsl(var(--rule))]">
              Experience & Education
            </h3>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-[15px] top-2 bottom-2 w-px bg-[hsl(var(--border))]" />

              <div className="space-y-8">
                {experiences.map((experience, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 16 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                    transition={{
                      delay: index * 0.12,
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="relative pl-10"
                  >
                    {/* Dot */}
                    <div className="absolute left-[7px] top-2 timeline-dot" />

                    <div className="rounded-[var(--radius)] border border-[hsl(var(--border))] bg-card p-5">
                      <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                        <div>
                          <h4 className="font-display text-base">
                            {experience.title}
                          </h4>
                          <p className="text-sm text-[hsl(var(--accent))]">
                            {experience.company}
                          </p>
                        </div>
                        <span className="shrink-0 rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                          {experience.period}
                        </span>
                      </div>
                      <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                        {experience.description.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
