import { PROFESSIONAL_INFO, SOCIAL_LINKS } from '@/lib/constants';

const links = [
  { label: 'GitHub', href: SOCIAL_LINKS.github, external: true },
  { label: 'LinkedIn', href: SOCIAL_LINKS.linkedin, external: true },
  { label: 'Email', href: `mailto:${SOCIAL_LINKS.email}`, external: false },
];

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[hsl(var(--rule))]">
      <div className="container-premium flex flex-col gap-6 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          &copy; {year} {PROFESSIONAL_INFO.name}. Built in Bangkok.
        </p>

        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                {...(link.external && { target: '_blank', rel: 'noopener noreferrer' })}
                className="transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a href="#main-content" className="transition-colors hover:text-foreground">
              Back to top ↑
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}

export default Footer;
