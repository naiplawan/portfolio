'use client';

import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';

function Footer() {
  const socialLinks = [
    {
      icon: <FaGithub className="h-4 w-4" />,
      href: 'https://github.com/naiplawan',
      label: 'GitHub',
    },
    {
      icon: <FaLinkedin className="h-4 w-4" />,
      href: 'https://linkedin.com/in/rachaphol-plookaom',
      label: 'LinkedIn',
    },
    {
      icon: <FaEnvelope className="h-4 w-4" />,
      href: 'mailto:rachaphol.plo@gmail.com',
      label: 'Email',
    },
  ];

  return (
    <footer className="border-t border-[hsl(var(--rule))]">
      <div className="container-premium py-12">
        <div className="flex flex-col items-center gap-6 text-center">
          {/* Name */}
          <span className="font-display text-lg">
            Rachaphol<span className="text-[hsl(var(--accent))]">.</span>
          </span>

          {/* Social */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {social.icon}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Rachaphol Plookaom. Built in Bangkok.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
