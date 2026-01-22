'use client';

import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { Heart } from 'lucide-react';

function Footer() {
  const socialLinks = [
    {
      icon: <FaGithub className="w-5 h-5" />,
      href: 'https://github.com/naiplawan',
      label: 'GitHub',
    },
    {
      icon: <FaLinkedin className="w-5 h-5" />,
      href: 'https://linkedin.com/in/rachaphol-plookaom',
      label: 'LinkedIn',
    },
    {
      icon: <FaEnvelope className="w-5 h-5" />,
      href: 'mailto:rachaphol.plo@gmail.com',
      label: 'Email',
    },
  ];

  return (
    <footer className="relative mt-20">
      {/* Premium Wave Animation */}
      <div className="relative h-32 sm:h-40 overflow-hidden">
        <svg
          className="absolute bottom-0 left-0 right-0 w-full h-full"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
              <stop offset="50%" stopColor="hsl(105, 25%, 55%)" stopOpacity="0.15" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <motion.path
            d="M0,64 C240,100 480,20 720,50 C960,80 1200,30 1440,60 L1440,120 L0,120 Z"
            fill="url(#waveGradient)"
            animate={{
              d: [
                'M0,64 C240,100 480,20 720,50 C960,80 1200,30 1440,60 L1440,120 L0,120 Z',
                'M0,80 C240,40 480,90 720,60 C960,30 1200,80 1440,50 L1440,120 L0,120 Z',
                'M0,64 C240,100 480,20 720,50 C960,80 1200,30 1440,60 L1440,120 L0,120 Z',
              ],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </svg>
      </div>

      {/* Main Footer Content */}
      <div className="bg-muted/30 dark:bg-background border-t border-border/50 backdrop-blur-sm">
        <div className="container-premium py-16">
          <div className="grid md:grid-cols-3 gap-12">
            {/* Brand Column */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-2xl font-bold font-display bio-gradient-text">
                Rachaphol.
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Crafting exceptional digital experiences with precision and
                passion. Let's build something amazing together.
              </p>
            </motion.div>

            {/* Quick Links Column */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Quick Links
              </h4>
              <ul className="space-y-2">
                {['About', 'Projects', 'Services', 'Blog', 'Contact'].map(
                  (link) => (
                    <li key={link}>
                      <a
                        href={`/${link.toLowerCase()}`}
                        className="bio-link text-foreground hover:text-primary transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </motion.div>

            {/* Connect Column */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Let's Connect
              </h4>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="bio-glass-card w-12 h-12 rounded-xl flex items-center justify-center text-foreground hover:text-primary transition-all duration-300 hover:scale-110 hover:-translate-y-1"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                rachaphol.plo@gmail.com
              </p>
            </motion.div>
          </div>

          {/* Bottom Bar */}
          <motion.div
            className="mt-12 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              © 2024 Rachaphol Plookaom. Made with{' '}
              <Heart className="w-4 h-4 text-red-500 fill-red-500" /> in Bangkok
            </p>
            <p className="text-sm text-muted-foreground">
              Designed & Built with{' '}
              <span className="bio-gradient-text font-semibold">Precision</span>
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
