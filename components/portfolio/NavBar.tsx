'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { DarkModeToggle } from '@/components/ui/dark-mode-toggle';
import Menu from '@/components/ui/icons/Menu';
import { X, Download } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

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
            <motion.button
              className="text-2xl font-bold font-display tracking-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl px-3 py-2"
              onClick={() => router.push('/')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              aria-label="Go to homepage"
            >
              <span className="bio-gradient-text">Rachaphol.</span>
            </motion.button>

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
                  <button
                    className={cn(
                      'relative px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300',
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

                    {/* Hover Background */}
                    <AnimatePresence>
                      {hoveredItem === item.href && !isActiveRoute(item.href) && (
                        <motion.div
                          className="absolute inset-0 bg-muted/50 rounded-xl"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </AnimatePresence>
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Download Resume Button */}
              <motion.a
                href="/Rachaphol_Resume.pdf"
                download="Rachaphol_Plookaom_Resume.pdf"
                className="hidden md:flex bio-button px-5 py-2.5 text-sm font-semibold items-center gap-2"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Download className="w-4 h-4" />
                <span>Resume</span>
              </motion.a>

              <DarkModeToggle />

              {/* Mobile Menu Toggle */}
              <button
                className="lg:hidden bio-glass-card p-3 rounded-xl"
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
              </button>
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
                  <div className="text-2xl font-bold font-display bio-gradient-text">
                    Menu
                  </div>
                  <button
                    className="p-2 rounded-xl hover:bg-muted/50 transition-colors"
                    onClick={() => setIsOpen(false)}
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
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
                        <button
                          className={cn(
                            'w-full text-left px-5 py-4 rounded-xl font-medium text-base transition-all duration-300 relative overflow-hidden',
                            isActiveRoute(item.href)
                              ? 'text-primary bg-primary/10'
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                          )}
                          onClick={() => handleNavigation(item.href)}
                          role="menuitem"
                          aria-current={
                            isActiveRoute(item.href) ? 'page' : undefined
                          }
                        >
                          <span className="relative z-10">{item.label}</span>
                          {isActiveRoute(item.href) && (
                            <motion.div
                              className="absolute inset-0 bg-primary/10"
                              layoutId="mobileActiveIndicator"
                              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                            />
                          )}
                        </button>
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
                    <a
                      href="/Rachaphol_Resume.pdf"
                      download="Rachaphol_Plookaom_Resume.pdf"
                    >
                      <button className="w-full bio-button px-6 py-4 text-base font-semibold flex items-center justify-center gap-3">
                        <Download className="w-5 h-5" />
                        <span>Download Resume</span>
                      </button>
                    </a>
                  </motion.div>
                </nav>

                {/* Footer in Mobile Menu */}
                <div className="pt-6 mt-auto border-t border-border/50">
                  <p className="text-sm text-muted-foreground text-center">
                    © 2024 Rachaphol Plookaom
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
