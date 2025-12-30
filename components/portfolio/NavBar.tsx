'use client'

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

  const navItems = [
    { label: 'About', href: '/about' },
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

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const isActiveRoute = (href: string) => pathname === href;

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <motion.button
            className="text-lg sm:text-xl font-semibold text-foreground cursor-pointer tracking-tight focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 rounded-md px-2 py-1 truncate max-w-[200px] sm:max-w-none"
            onClick={() => router.push('/')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            aria-label="Go to homepage"
            title="Coding | Portfolio"
          >
            <span className="hidden sm:inline">Coding | Portfolio</span>
            <span className="sm:hidden">Portfolio</span>
          </motion.button>

          <div className="hidden md:flex items-center space-x-1" role="menubar">
            {navItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  variant="ghost"
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 ${
                    isActiveRoute(item.href)
                      ? 'text-foreground bg-accent'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                  onClick={() => handleNavigation(item.href)}
                  role="menuitem"
                  aria-current={isActiveRoute(item.href) ? 'page' : undefined}
                >
                  {item.label}
                </Button>
              </motion.div>
            ))}
            <motion.a
              href="/Rachaphol_Resume.pdf"
              download="Rachaphol_Plookaom_Resume.pdf"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: navItems.length * 0.1 }}
            >
              <Button
                variant="default"
                className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2"
                role="menuitem"
              >
                <Download className="w-4 h-4 mr-2" />
                Resume
              </Button>
            </motion.a>
            <DarkModeToggle />
          </div>

          <div className="md:hidden flex items-center space-x-2">
            <DarkModeToggle />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 sm:h-10 sm:w-10 focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 rounded-md"
                  aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
                  aria-expanded={isOpen}
                  aria-controls="mobile-menu"
                >
                  {isOpen ? <X className="h-4 w-4 sm:h-5 sm:w-5" /> : <Menu size={20} />}
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[280px] sm:w-80 px-4"
                aria-labelledby="mobile-menu-title"
              >
                <div className="flex flex-col space-y-4 mt-6" id="mobile-menu">
                  <div
                    className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border"
                    id="mobile-menu-title"
                  >
                    Navigation
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
                          className={`w-full justify-start text-left px-3 py-4 text-base font-medium focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 rounded-lg transition-all duration-200 ${
                            isActiveRoute(item.href)
                              ? 'text-foreground bg-accent border-l-4 border-foreground'
                              : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                          }`}
                          onClick={() => handleNavigation(item.href)}
                          role="menuitem"
                          aria-current={isActiveRoute(item.href) ? 'page' : undefined}
                        >
                          {item.label}
                        </Button>
                      </motion.div>
                    ))}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: navItems.length * 0.1 }}
                      className="pt-4 mt-4 border-t border-border"
                    >
                      <a
                        href="/Rachaphol_Resume.pdf"
                        download="Rachaphol_Plookaom_Resume.pdf"
                        className="block"
                      >
                        <Button
                          variant="default"
                          className="w-full justify-start px-3 py-4 text-base font-medium transition-all duration-200"
                          role="menuitem"
                        >
                          <Download className="w-4 h-4 mr-2" />
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
