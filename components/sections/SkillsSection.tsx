'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

interface SkillCategory {
  title: string
  skills: string[]
}

const skillCategories: SkillCategory[] = [
  {
    title: 'Frontend',
    skills: ['React.js', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
  },
  {
    title: 'Backend',
    skills: ['Go / Fiber', 'Node.js', 'Python', 'Django', 'REST APIs'],
  },
  {
    title: 'Mobile',
    skills: ['Flutter', 'Dart', 'React Native'],
  },
  {
    title: 'Tools & Database',
    skills: ['PostgreSQL', 'MySQL', 'Firebase', 'Git / GitHub', 'Docker'],
  },
]

export default function SkillsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <section ref={ref} className="section-padding border-t border-[hsl(var(--rule))]">
      <div className="container-premium">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="section-label mb-3">Capabilities</p>
          <h2 className="font-display text-3xl sm:text-4xl tracking-tight">
            Skills & Technologies
          </h2>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {skillCategories.map((category, catIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: catIndex * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <h3 className="text-sm font-medium mb-4 pb-3 border-b border-[hsl(var(--rule))]">
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, skillIndex) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                    transition={{
                      delay: catIndex * 0.1 + skillIndex * 0.03,
                      duration: 0.3,
                    }}
                    className="rounded-full bg-muted px-3.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-[hsl(var(--accent)/0.1)] hover:text-[hsl(var(--accent))]"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Currently focused */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-10 text-sm text-muted-foreground text-center"
        >
          Currently exploring advanced React patterns and cloud architecture.
        </motion.p>
      </div>
    </section>
  )
}
