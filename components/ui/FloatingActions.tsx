'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { Download, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FloatingActions() {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    {
      icon: <FaGithub className="w-5 h-5" />,
      label: 'GitHub',
      href: 'https://github.com/naiplawan',
      color: 'hover:bg-gray-800 dark:hover:bg-gray-700',
      textColor: 'text-gray-700 dark:text-gray-300',
    },
    {
      icon: <FaLinkedin className="w-5 h-5" />,
      label: 'LinkedIn',
      href: 'https://linkedin.com/in/rachaphol-plookaom',
      color: 'hover:bg-blue-600',
      textColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      icon: <FaEnvelope className="w-5 h-5" />,
      label: 'Email',
      href: 'mailto:rachaphol.plo@gmail.com',
      color: 'hover:bg-emerald-600',
      textColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      icon: <Download className="w-5 h-5" />,
      label: 'Resume',
      href: '/Rachaphol_Resume.pdf',
      color: 'hover:bg-purple-600',
      textColor: 'text-purple-600 dark:text-purple-400',
    },
  ];

  // Don't render on very short viewports where it would overlap navbar
  return (
    <div className="fixed bottom-6 right-6 z-40 hidden md:block">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-20 right-0 space-y-3"
          >
            {actions.map((action, index) => (
              <motion.a
                key={action.label}
                href={action.href}
                target={action.label !== 'Email' ? '_blank' : undefined}
                rel={action.label !== 'Email' ? 'noopener noreferrer' : undefined}
                initial={{ opacity: 0, x: 60, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 60, scale: 0.8 }}
                transition={{
                  delay: index * 0.06,
                  type: 'spring' as const,
                  stiffness: 300,
                  damping: 20,
                }}
                className="flex items-center justify-end gap-3"
              >
                <span className="bio-glass-card px-3 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap">
                  {action.label}
                </span>
                <div
                  className={`bio-glass-card w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${action.color} ${action.textColor} cursor-pointer`}
                >
                  {action.icon}
                </div>
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Toggle Button */}
      <Button
        size="icon"
        className="relative w-16 h-16 rounded-full shadow-2xl"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle floating menu"
      >
        <motion.div
          animate={{ rotate: isOpen ? 135 : 0 }}
          transition={{ duration: 0.3, type: 'spring' as const, stiffness: 200 }}
        >
          {isOpen ? (
            <X className="w-7 h-7" />
          ) : (
            <Plus className="w-7 h-7" />
          )}
        </motion.div>
      </Button>
    </div>
  );
}
