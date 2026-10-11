import Link from 'next/link';

const links = [
  { label: 'Home', href: '/' },
  { label: 'Work', href: '/projects' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function NotFound() {
  return (
    <div className="container-premium section-padding">
      <p className="section-label mb-6 border-t border-foreground pt-3">Error 404</p>
      <h1 className="font-display text-[clamp(4rem,18vw,12rem)] italic leading-none tracking-tight">
        Not found.
      </h1>
      <p className="mt-8 max-w-lg text-lg text-muted-foreground">
        This page doesn&apos;t exist, or it moved. Try one of these instead:
      </p>
      <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-lg">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="ed-link">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
