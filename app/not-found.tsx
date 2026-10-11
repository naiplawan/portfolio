import Link from 'next/link';
import { SpecimenScene } from '@/components/motion/SpecimenScene';

const links = [
  { label: 'Work', href: '/projects' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function NotFound() {
  return (
    <div className="container-premium section-padding">
      <p className="mb-6 flex items-baseline gap-4 border-t border-foreground pt-3">
        <span className="pixel-label">[404]</span>
        <span className="code-comment font-mono text-xs text-muted-foreground">error</span>
      </p>

      <div className="grid gap-10 md:grid-cols-[1fr_minmax(0,24rem)] md:items-center">
        <div>
          <h1 className="font-display text-[clamp(3rem,10vw,7rem)] font-semibold leading-none tracking-tight">
            Specimen not found.
          </h1>
          <p className="mt-8 max-w-lg text-lg text-muted-foreground">
            This page doesn&apos;t exist, or it migrated. We checked every slide.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex h-11 items-center rounded-lg bg-foreground px-5 text-background transition-opacity hover:opacity-85"
          >
            <span className="pixel-label">▶ Press start to go home</span>
          </Link>
          <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="ed-link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <SpecimenScene className="pixelated w-full" />
      </div>
    </div>
  );
}
