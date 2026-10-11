'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { DarkModeToggle } from '@/components/ui/dark-mode-toggle';
import { cn } from '@/lib/utils/cn';
import { PROFESSIONAL_INFO, SOCIAL_LINKS } from '@/lib/constants';

const navItems = [
  { label: 'Work', href: '/projects' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Contact', href: '/contact' },
];

function NavBar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);

  const handleMenuKeys = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      return;
    }
    if (e.key !== 'Tab' || !menuRef.current) return;

    const focusable = menuRef.current.querySelectorAll<HTMLElement>('button, [href]');
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }, []);

  // Focus trap, scroll lock and inert page while the mobile menu is open
  useEffect(() => {
    if (!isOpen) {
      if (wasOpenRef.current) menuButtonRef.current?.focus();
      wasOpenRef.current = false;
      return undefined;
    }
    wasOpenRef.current = true;

    const pageElements = [
      document.querySelector('main'),
      document.querySelector('footer'),
    ].filter(Boolean) as HTMLElement[];
    const previousBodyOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';
    pageElements.forEach((element) => element.setAttribute('inert', ''));
    document.addEventListener('keydown', handleMenuKeys);
    const timer = window.setTimeout(() => {
      menuRef.current?.querySelector<HTMLElement>('[href]')?.focus();
    }, 50);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('keydown', handleMenuKeys);
      document.body.style.overflow = previousBodyOverflow;
      pageElements.forEach((element) => element.removeAttribute('inert'));
    };
  }, [isOpen, handleMenuKeys]);

  const isActiveRoute = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <nav
        className="fixed inset-x-0 top-0 z-50 border-b border-[hsl(var(--rule))] bg-background/90 backdrop-blur-sm"
        aria-label="Main navigation"
      >
        <div className="container-premium flex h-14 items-center justify-between">
          <Link
            href="/"
            className="text-sm font-medium tracking-tight text-foreground"
            onClick={() => setIsOpen(false)}
          >
            {PROFESSIONAL_INFO.name}
          </Link>

          <div className="flex items-center gap-1 sm:gap-2">
            <ul className="hidden items-center gap-6 md:flex">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActiveRoute(item.href) ? 'page' : undefined}
                    className={cn(
                      'text-sm transition-colors',
                      isActiveRoute(item.href)
                        ? 'text-foreground underline decoration-1 underline-offset-[6px]'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <span className="mx-2 hidden h-4 w-px bg-[hsl(var(--rule))] md:block" aria-hidden="true" />

            <DarkModeToggle />

            <button
              type="button"
              ref={menuButtonRef}
              className="inline-flex h-9 items-center px-2 font-mono text-xs uppercase tracking-widest text-foreground md:hidden"
              onClick={() => setIsOpen((open) => !open)}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              {isOpen ? 'Close' : 'Menu'}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="fixed inset-x-0 bottom-0 top-14 z-40 flex flex-col overflow-y-auto bg-background md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <ul className="container-premium flex-1 pt-6">
              {navItems.map((item, index) => (
                <li key={item.href} className="border-b border-[hsl(var(--rule))]">
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    aria-current={isActiveRoute(item.href) ? 'page' : undefined}
                    className="flex items-baseline gap-4 py-5"
                  >
                    <span className="index-num">0{index + 1}</span>
                    <span
                      className={cn(
                        'font-display text-4xl tracking-tight',
                        isActiveRoute(item.href) && 'italic text-[hsl(var(--accent))]'
                      )}
                    >
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="container-premium flex items-center justify-between py-6 text-sm text-muted-foreground">
              <a href={`mailto:${SOCIAL_LINKS.email}`} className="ed-link">
                {SOCIAL_LINKS.email}
              </a>
              <span>{PROFESSIONAL_INFO.location.split(',')[0]}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default NavBar;
