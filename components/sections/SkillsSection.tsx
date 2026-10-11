import { SectionHeading } from '@/components/ui/section-heading'

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
    title: 'Tools & Data',
    skills: ['PostgreSQL', 'MySQL', 'Firebase', 'Git / GitHub', 'Docker'],
  },
]

export default function SkillsSection() {
  return (
    <section className="section-padding">
      <div className="container-premium">
        <SectionHeading index="02" label="Capabilities" title="What I work with" />

        <dl className="grid border-t border-[hsl(var(--rule))] sm:grid-cols-2 lg:grid-cols-4">
          {skillCategories.map((category) => (
            <div
              key={category.title}
              className="border-b border-[hsl(var(--rule))] py-6 sm:pr-8 lg:border-b-0"
            >
              <dt className="section-label mb-4">{category.title}</dt>
              {category.skills.map((skill) => (
                <dd key={skill} className="py-1 text-lg leading-snug">
                  {skill}
                </dd>
              ))}
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
