'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DarkModeToggle } from '@/components/ui/dark-mode-toggle';
import Menu from '@/components/ui/icons/Menu';
import { X, Download } from 'lucide-react';

function NavBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-cream/90 backdrop-blur-sm border-b-2 border-beige/30 shadow-sm'
          : 'bg-transparent border-b border-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <motion.button
            className="text-xl sm:text-2xl font-bold text-foreground cursor-pointer tracking-tight focus:outline-none focus:ring-3 focus:ring-terracotta focus:ring-offset-2 rounded-xl px-3 py-2 font-display hover:scale-105 transition-transform"
            onClick={() => router.push('/')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            aria-label="Go to homepage"
          >
            <span className="earth-text">Rachaphol.</span>
          </motion.button>

          <div className="hidden md:flex items-center space-x-2" role="menubar">
            {navItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  variant="ghost"
                  className={`px-5 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 clay-card ${
                    isActiveRoute(item.href)
                      ? 'bg-terracotta/20 text-terracotta border-2 border-terracotta/30'
                      : 'text-foreground hover:bg-sage/20 hover:border-sage/30'
                  }`}
                  onClick={() => handleNavigation(item.href)}
                  role="menuitem"
                  aria-current={isActiveRoute(item.href) ? 'page' : undefined}
                >
                  {item.label}
                </Button>
              </motion.div>
            ))}

            <DarkModeToggle />
          </div>

          <div className="md:hidden flex items-center space-x-2">
            <DarkModeToggle />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="clay-card h-11 w-11 focus:ring-3 focus:ring-terracotta rounded-xl"
                  aria-label={
                    isOpen ? 'Close navigation menu' : 'Open navigation menu'
                  }
                  aria-expanded={isOpen}
                  aria-controls="mobile-menu"
                >
                  {isOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu size={22} />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] clay-card border-l-2 border-beige/30"
                aria-labelledby="mobile-menu-title"
              >
                <div className="flex flex-col space-y-4 mt-8" id="mobile-menu">
                  <div
                    className="text-2xl font-bold earth-text mb-6 pb-4 border-b-2 border-beige/30 font-display"
                    id="mobile-menu-title"
                  >
                    Menu
                  </div>
                  <nav role="menu">
                    {navItems.map((item, index) => (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Button
                          variant="ghost"
                          className={`w-full justify-start text-left px-5 py-4 text-base font-medium rounded-xl transition-all duration-200 clay-card mb-3 ${
                            isActiveRoute(item.href)
                              ? 'bg-terracotta/20 text-terracotta border-2 border-terracotta/30'
                              : 'text-foreground hover:bg-sage/20'
                          }`}
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
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: navItems.length * 0.1 }}
                      className="pt-6 mt-6 border-t-2 border-beige/30"
                    >
                      <a
                        href="/Rachaphol_Resume.pdf"
                        download="Rachaphol_Plookaom_Resume.pdf"
                        className="block"
                      >
                        <Button
                          variant="default"
                          className="w-full justify-start px-5 py-4 text-base font-medium rounded-2xl clay-button hover:scale-105 transition-transform"
                          role="menuitem"
                        >
                          <Download className="w-5 h-5 mr-3" />
                          Download Resume
                        </Button>
                      </a>
                    </motion.div>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

export default NavBar;
