'use client';

import AboutMe from '@/components/portfolio/AboutMe';
import GitHubStats from '@/components/portfolio/GitHubStats';
import Timeline from '@/components/portfolio/Timeline';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaFacebook } from 'react-icons/fa';

export default function AboutPage() {
  const socialLinks = [
    {
      icon: FaFacebook,
      href: 'https://www.facebook.com/mos.jrpt',
      label: 'Facebook',
    },
    {
      icon: FaLinkedin,
      href: 'https://www.linkedin.com/in/rachaphol-plookaom',
      label: 'LinkedIn',
    },
    {
      icon: FaGithub,
      href: 'https://github.com/naiplawan',
      label: 'GitHub',
    },
  ];

  return (
    <div className="min-h-screen pt-20">
      <AboutMe />
      <Timeline />
      <GitHubStats />

      <section className="section-padding border-t border-[hsl(var(--rule))]">
        <div className="container-premium">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-6"
          >
            <p className="section-label">Connect</p>
            <h2 className="font-display text-3xl sm:text-4xl tracking-tight">Let&apos;s Connect</h2>

            <div className="flex justify-center gap-4 pt-2">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  aria-label={social.label}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-[hsl(var(--border))] text-muted-foreground transition-colors hover:bg-foreground hover:text-background hover:border-foreground"
                >
                  <social.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
