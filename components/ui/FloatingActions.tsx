'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import Mail from '@/components/ui/icons/Mail';
import Download from '@/components/ui/icons/Download';
import { Plus, X } from 'lucide-react';

export default function FloatingActions() {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    {
      icon: <FaGithub className="w-5 h-5" />,
      label: 'GitHub',
      onClick: () => window.open('https://github.com/naiplawan', '_blank'),
      variant: 'default' as const,
      className: 'bg-gray-800 hover:bg-gray-900 text-white border-gray-800'
    },
    {
      icon: <FaLinkedin className="w-5 h-5" />,
      label: 'LinkedIn',
      onClick: () => window.open('https://www.linkedin.com/in/rachaphol-plookaom', '_blank'),
      variant: 'default' as const,
      className: 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'
    },
    {
      icon: <Mail size={20} />,
      label: 'Email',
      onClick: () => window.location.href = 'mailto:rachaphol.plo@gmail.com',
      variant: 'default' as const,
      className: 'bg-green-600 hover:bg-green-700 text-white border-green-600'
    },
    {
      icon: <Download size={20} />,
      label: 'Resume',
      onClick: () => window.open('/Rachaphol_Resume.pdf', '_blank'),
      variant: 'default' as const,
      className: 'bg-purple-600 hover:bg-purple-700 text-white border-purple-600'
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-16 right-0 space-y-3"
          >
            {actions.map((action, index) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, x: 50, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: 50, y: 20 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3"
              >
                <Badge
                  variant="secondary"
                  className="bg-popover text-popover-foreground px-3 py-1 shadow-lg border"
                >
                  {action.label}
                </Badge>
                <Button
                  size="icon"
                  variant={action.variant}
                  className={`w-12 h-12 rounded-full shadow-lg ${action.className}`}
                  onClick={action.onClick}
                  aria-label={action.label}
                >
                  {action.icon}
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        size="icon"
        variant="default"
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground"
        aria-label="Toggle floating menu"
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
        </motion.div>
      </Button>
    </div>
  );
}