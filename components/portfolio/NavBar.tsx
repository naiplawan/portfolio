'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { DarkModeToggle } from '@/components/ui/dark-mode-toggle';
import Menu from '@/components/ui/icons/Menu';
import { X, Download } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';

function NavBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const navItems = [
    { label: 'About', href: '/about' },
    { label: 'Projects', href: '/projects' },
    { label: 'Services', href: '/services' },
    { label: 'Blog', href: '/blog' },
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
      setScrolled(window.scrollY > 30);
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
      {/* Desktop Navigation */}
      <motion.nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled
            ? 'bio-nav py-3'
            : 'bg-transparent py-5'
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container-premium">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Button
              variant="ghost"
              className="text-2xl font-bold font-display tracking-tight px-3 py-2"
              onClick={() => router.push('/')}
              aria-label="Go to homepage"
            >
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Rachaphol.</span>
            </Button>

            {/* Desktop Nav Items */}
            <div className="hidden lg:flex items-center gap-1" role="menubar">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  onHoverStart={() => setHoveredItem(item.href)}
                  onHoverEnd={() => setHoveredItem(null)}
                >
                  <Button
                    variant="ghost"
                    className={cn(
                      'relative px-5 py-2.5 font-medium text-sm',
                      isActiveRoute(item.href)
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                    onClick={() => handleNavigation(item.href)}
                    role="menuitem"
                    aria-current={isActiveRoute(item.href) ? 'page' : undefined}
                  >
                    {item.label}

                    {/* Active Indicator */}
                    {isActiveRoute(item.href) && (
                      <motion.div
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full"
                        layoutId="activeIndicator"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                  </Button>
                </motion.div>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Download Resume Button */}
              <Button
                asChild
                variant="default"
                size="sm"
                className="hidden md:flex"
              >
                <a href="/Rachaphol_Resume.pdf" download="Rachaphol_Plookaom_Resume.pdf">
                  <Download className="w-4 h-4 mr-2" />
                  Resume
                </a>
              </Button>

              <DarkModeToggle />

              {/* Mobile Menu Toggle */}
              <Button
                variant="outline"
                size="icon"
                className="lg:hidden"
                onClick={() => setIsOpen(!isOpen)}
                aria-label={
                  isOpen ? 'Close navigation menu' : 'Open navigation menu'
                }
                aria-expanded={isOpen}
                aria-controls="mobile-menu"
              >
                {isOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu size={22} />
                )}
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Mobile Menu Sheet */}
            <motion.div
              id="mobile-menu"
              className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bio-glass-card z-50 lg:hidden border-l border-border/50 rounded-l-3xl"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="flex flex-col h-full p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="text-2xl font-bold font-display bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Menu
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1" role="menu">
                  <div className="space-y-2">
                    {navItems.map((item, index) => (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.08 }}
                      >
                        <Button
                          variant={isActiveRoute(item.href) ? 'secondary' : 'ghost'}
                          className={cn(
                            'w-full justify-start px-5 py-6 font-medium text-base',
                            isActiveRoute(item.href)
                              ? 'text-primary'
                              : 'text-muted-foreground'
                          )}
                          onClick={() => handleNavigation(item.href)}
                          role="menuitem"
                          aria-current={
                            isActiveRoute(item.href) ? 'page' : undefined
                          }
                        >
                          {item.label}
                        </Button>
                      </motion.div>
                    ))}
                  </div>

                  {/* Download Resume - Mobile */}
                  <motion.div
                    className="mt-8 pt-8 border-t border-border/50"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navItems.length * 0.08 }}
                  >
                    <Button asChild size="lg" className="w-full">
                      <a href="/Rachaphol_Resume.pdf" download="Rachaphol_Plookaom_Resume.pdf">
                        <Download className="w-5 h-5 mr-2" />
                        Download Resume
                      </a>
                    </Button>
                  </motion.div>
                </nav>

                {/* Footer in Mobile Menu */}
                <div className="pt-6 mt-auto border-t border-border/50">
                  <p className="text-sm text-muted-foreground text-center">
                    © 2025 Rachaphol Plookaom
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
