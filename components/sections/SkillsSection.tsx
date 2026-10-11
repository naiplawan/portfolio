import { XpFill } from '@/components/motion/XpFill'
import { SectionHeading } from '@/components/ui/section-heading'

interface Skill {
  name: string
  /** Self-assessed, 1–10 */
  level: number
}

interface SkillKingdom {
  kingdom: string
  skills: Skill[]
}

const MAX_LEVEL = 10

const SOFTWARE_SINCE = 2023

const kingdoms: SkillKingdom[] = [
  {
    kingdom: 'Frontend',
    skills: [
      { name: 'React.js', level: 8 },
      { name: 'Next.js', level: 8 },
      { name: 'TypeScript', level: 8 },
      { name: 'Tailwind CSS', level: 8 },
      { name: 'Framer Motion', level: 6 },
    ],
  },
  {
    kingdom: 'Backend',
    skills: [
      { name: 'Go / Fiber', level: 5 },
      { name: 'Node.js', level: 6 },
      { name: 'Python', level: 5 },
      { name: 'Django', level: 4 },
      { name: 'REST APIs', level: 7 },
    ],
  },
  {
    kingdom: 'Mobile',
    skills: [
      { name: 'Flutter', level: 6 },
      { name: 'Dart', level: 6 },
      { name: 'React Native', level: 3 },
    ],
  },
  {
    kingdom: 'Tools & Data',
    skills: [
      { name: 'PostgreSQL', level: 6 },
      { name: 'MySQL', level: 4 },
      { name: 'Firebase', level: 5 },
      { name: 'Git / GitHub', level: 8 },
      { name: 'Docker', level: 4 },
    ],
  },
]

const stats = [
  { term: 'class', detail: 'Biologist → Developer' },
  { term: 'level', detail: `${new Date().getFullYear() - SOFTWARE_SINCE} (shipping since ${SOFTWARE_SINCE})` },
  { term: 'origin', detail: 'Biological Sciences lab, Mahidol' },
  { term: 'perk', detail: 'Treats every bug as an experiment' },
]

function XpBar({ level }: { level: number }) {
  return (
    <span className="flex gap-[2px]" aria-hidden="true">
      {Array.from({ length: MAX_LEVEL }, (_, i) => (
        <span
          key={i}
          className={
            i < level
              ? 'xp-on h-2.5 w-2 bg-[hsl(var(--accent))]'
              : 'h-2.5 w-2 bg-[hsl(var(--rule))]'
          }
        />
      ))}
    </span>
  )
}

export default function SkillsSection() {
  return (
    <section className="section-padding">
      <div className="container-premium">
        <SectionHeading index="02" label="Capabilities" title="Character sheet">
          Classified the way I was trained to: by kingdom first, then species.
        </SectionHeading>

        <dl className="mb-12 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-[hsl(var(--rule))] py-5 lg:grid-cols-4">
          {stats.map(({ term, detail }) => (
            <div key={term}>
              <dt className="pixel-label mb-1 text-muted-foreground">{term}</dt>
              <dd className="text-sm">{detail}</dd>
            </div>
          ))}
        </dl>

        <XpFill className="grid gap-x-10 sm:grid-cols-2 lg:grid-cols-4">
          {kingdoms.map(({ kingdom, skills }) => (
            <section key={kingdom} className="border-t border-foreground pb-8 pt-3">
              <h3 className="mb-4 flex items-baseline justify-between gap-3">
                <span className="mono-tag">kingdom</span>
                <span className="font-display text-xl font-semibold tracking-tight">{kingdom}</span>
              </h3>
              <ul className="space-y-3">
                {skills.map(({ name, level }) => (
                  <li key={name}>
                    <div className="mb-1 flex items-baseline justify-between gap-3">
                      <span className="text-base">{name}</span>
                      <span className="pixel-label text-muted-foreground">
                        lv.{level}
                        <span className="sr-only"> of {MAX_LEVEL}</span>
                      </span>
                    </div>
                    <XpBar level={level} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </XpFill>
      </div>
    </section>
  )
}
