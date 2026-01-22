'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { cn } from '@/lib/utils/cn'

interface Skill {
  name: string
  level: number
  category: 'frontend' | 'backend' | 'mobile' | 'tools'
}

interface SkillCategory {
  title: string
  icon: string
  skills: Skill[]
  color: string
}

const skillCategories: SkillCategory[] = [
  {
    title: 'Frontend',
    icon: '⚛️',
    color: 'from-cyan-500 to-blue-600',
    skills: [
      { name: 'React.js', level: 90, category: 'frontend' },
      { name: 'Next.js', level: 85, category: 'frontend' },
      { name: 'TypeScript', level: 88, category: 'frontend' },
      { name: 'Tailwind CSS', level: 90, category: 'frontend' },
    ],
  },
  {
    title: 'Backend',
    icon: '🔧',
    color: 'from-emerald-500 to-teal-600',
    skills: [
      { name: 'Go / Fiber', level: 82, category: 'backend' },
      { name: 'Node.js', level: 85, category: 'backend' },
      { name: 'Python', level: 80, category: 'backend' },
      { name: 'Django', level: 78, category: 'backend' },
    ],
  },
  {
    title: 'Mobile',
    icon: '📱',
    color: 'from-violet-500 to-purple-600',
    skills: [
      { name: 'Flutter', level: 88, category: 'mobile' },
      { name: 'Dart', level: 88, category: 'mobile' },
      { name: 'React Native', level: 75, category: 'mobile' },
    ],
  },
  {
    title: 'Database & Tools',
    icon: '🗄️',
    color: 'from-orange-500 to-amber-600',
    skills: [
      { name: 'PostgreSQL', level: 82, category: 'tools' },
      { name: 'MySQL', level: 80, category: 'tools' },
      { name: 'Firebase', level: 85, category: 'tools' },
      { name: 'Git / GitHub', level: 90, category: 'tools' },
    ],
  },
]

function SkillBar({ skill, index }: { skill: Skill; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.8 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="mb-4"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">{skill.name}</span>
        <span className="text-sm text-muted-foreground">{skill.level}%</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className={cn('h-full bg-gradient-to-r', skill.category === 'frontend' ? 'from-cyan-500 to-blue-600' :
            skill.category === 'backend' ? 'from-emerald-500 to-teal-600' :
              skill.category === 'mobile' ? 'from-violet-500 to-purple-600' :
                'from-orange-500 to-amber-600')}
          initial={{ width: 0 }}
          animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
          transition={{ delay: index * 0.05 + 0.2, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        />
      </div>
    </motion.div>
  )
}

function SkillCategoryCard({ category, index }: { category: SkillCategory; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="bio-glass-card p-6 rounded-2xl h-full">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className={cn('w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-2xl', category.color)}>
            {category.icon}
          </div>
          <div>
            <h3 className="text-lg font-display font-bold">{category.title}</h3>
            <p className="text-xs text-muted-foreground">{category.skills.length} Technologies</p>
          </div>
        </div>

        {/* Skills */}
        <div>
          {category.skills.map((skill, skillIndex) => (
            <SkillBar key={skill.name} skill={skill} index={skillIndex} />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default function SkillsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <section ref={ref} className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.01]" style={{
        backgroundImage: `
          linear-gradient(to right, currentColor 1px, transparent 1px),
          linear-gradient(to bottom, currentColor 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
      }} />

      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-violet-500/5 rounded-full blur-[120px]" />

      <div className="container-premium relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="bio-badge text-sm mb-4">Technical Expertise</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-4">
            Skills & <span className="bio-gradient-text">Technologies</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Technologies and tools I work with regularly, spanning frontend web development,
            backend APIs, mobile applications, and database management.
          </p>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skillCategories.map((category, index) => (
            <SkillCategoryCard key={category.title} category={category} index={index} />
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-muted-foreground">
            Always learning and exploring new technologies to stay current with industry trends.
            <span className="text-primary font-medium"> Currently focused on </span>
            <span className="font-mono text-xs bg-primary/10 px-2 py-1 rounded">Advanced React patterns</span> and
            <span className="font-mono text-xs bg-primary/10 px-2 py-1 rounded ml-1">Cloud architecture</span>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
