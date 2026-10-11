import { DecodeText } from '@/components/motion/DecodeText'
import { cn } from '@/lib/utils/cn'

interface SectionHeadingProps {
  index?: string
  label: string
  title: React.ReactNode
  as?: 'h1' | 'h2'
  className?: string
  children?: React.ReactNode
}

/**
 * Section header: a ruled code-comment kicker (pixel index + `// label`) above a sans title.
 */
export function SectionHeading({
  index,
  label,
  title,
  as: Heading = 'h2',
  className,
  children,
}: SectionHeadingProps) {
  return (
    <header className={cn('mb-12 sm:mb-16', className)}>
      <div className="mb-6 flex items-baseline gap-4 border-t border-foreground pt-3">
        {index && <span className="pixel-label text-foreground">[{index}]</span>}
        <DecodeText text={label.toLowerCase()} className="code-comment font-mono text-xs text-muted-foreground" />
      </div>
      <Heading
        className={cn(
          'max-w-4xl text-balance font-display font-semibold tracking-tight',
          Heading === 'h1'
            ? 'text-[clamp(2.5rem,7vw,5rem)] leading-[1]'
            : 'text-[clamp(2rem,5vw,3.25rem)] leading-[1.05]'
        )}
      >
        {title}
      </Heading>
      {children && (
        <div className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          {children}
        </div>
      )}
    </header>
  )
}
