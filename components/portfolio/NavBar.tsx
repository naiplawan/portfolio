'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { DarkModeToggle } from '@/components/ui/dark-mode-toggle';
import Menu from '@/components/ui/icons/Menu';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { PROFESSIONAL_INFO } from '@/lib/constants';

function NavBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const handleMenuTab = useCallback((e: KeyboardEvent) => {
    if (e.key !== 'Tab' || !menuRef.current) return;

    const focusable = menuRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
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

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleMenuTab);
      const timer = setTimeout(() => {
        const firstFocusable = menuRef.current?.querySelector<HTMLElement>('button, [href]');
        firstFocusable?.focus();
      }, 100);
      return () => {
        document.removeEventListener('keydown', handleMenuTab);
        clearTimeout(timer);
      };
    } else {
      document.removeEventListener('keydown', handleMenuTab);
      menuButtonRef.current?.focus();
      return undefined;
    }
  }, [isOpen, handleMenuTab]);

  const navItems = [
    { label: 'About', href: '/about' },
    { label: 'Projects', href: '/projects' },
    { label: 'Services', href: '/services' },
    { label: 'Contact', href: '/contact' },
  ];

  const handleNavigation = (href: string) => {
    setIsOpen(false);
    router.push(href);
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    document.addEventListener('keydown', handleEscape);
    window.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isOpen]);

  const isActiveRoute = (href: string) => pathname === href;

  return (
    <>
      <motion.nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bio-nav py-3'
            : 'bg-transparent py-4'
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container-premium">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <button
              className="text-lg font-display tracking-tight text-foreground"
              onClick={() => router.push('/')}
              aria-label="Go to homepage"
            >
              {PROFESSIONAL_INFO.name.split(' ')[0]}
              <span className="text-[hsl(var(--accent))]">.</span>
            </button>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1" role="menubar">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  className={cn(
                    'relative px-4 py-2 text-sm transition-colors',
                    isActiveRoute(item.href)
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                  onClick={() => handleNavigation(item.href)}
                  role="menuitem"
                  aria-current={isActiveRoute(item.href) ? 'page' : undefined}
                >
                  {item.label}
                  {isActiveRoute(item.href) && (
                    <motion.div
                      className="absolute bottom-0 left-4 right-4 h-px bg-foreground"
                      layoutId="activeIndicator"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    if (window.location.pathname === '/') {
                      document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      window.location.href = '/#contact';
                    }
                  }
                }}
                className="hidden md:inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm text-background transition-opacity hover:opacity-80"
              >
                Hire Me
              </button>

              <DarkModeToggle />

              <button
                ref={menuButtonRef}
                className="lg:hidden inline-flex items-center justify-center rounded-md p-2 text-foreground transition-colors hover:bg-muted"
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={isOpen}
                aria-controls="mobile-menu"
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              ref={menuRef}
              id="mobile-menu"
              className="fixed top-0 right-0 bottom-0 z-50 w-80 max-w-[90vw] bg-background border-l border-[hsl(var(--border))] lg:hidden"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="flex h-full flex-col p-6">
                <div className="flex items-center justify-between mb-8">
                  <span className="text-lg font-display">Menu</span>
                  <button
                    onClick={() => setIsOpen(false)}
                    aria-label="Close menu"
                    className="rounded-md p-2 transition-colors hover:bg-muted"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <nav className="flex-1" role="menu">
                  <div className="space-y-1">
                    {navItems.map((item, index) => (
                      <motion.button
                        key={item.href}
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={cn(
                          'block w-full px-4 py-3 text-left text-base rounded-[var(--radius)] transition-colors',
                          isActiveRoute(item.href)
                            ? 'bg-muted text-foreground font-medium'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        )}
                        onClick={() => handleNavigation(item.href)}
                        role="menuitem"
                        aria-current={isActiveRoute(item.href) ? 'page' : undefined}
                      >
                        {item.label}
                      </motion.button>
                    ))}
                  </div>
                </nav>

                <div className="border-t border-[hsl(var(--border))] pt-6">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      if (typeof window !== 'undefined') {
                        if (window.location.pathname === '/') {
                          document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                        } else {
                          window.location.href = '/#contact';
                        }
                      }
                    }}
                    className="w-full rounded-full bg-foreground py-3 text-sm text-background transition-opacity hover:opacity-80"
                  >
                    Hire Me
                  </button>
                  <p className="mt-4 text-center text-xs text-muted-foreground">
                    &copy; {new Date().getFullYear()} {PROFESSIONAL_INFO.name}
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default NavBar;
