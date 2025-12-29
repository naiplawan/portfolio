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
      color: 'hover:text-blue-600',
    },
    {
      icon: FaLinkedin,
      href: 'https://www.linkedin.com/in/rachaphol-plookaom',
      label: 'LinkedIn',
      color: 'hover:text-blue-700',
    },
    {
      icon: FaGithub,
      href: 'https://github.com/naiplawan',
      label: 'GitHub',
      color: 'hover:text-gray-900 dark:hover:text-gray-100',
    },
  ];

  return (
    <div className="min-h-screen pt-14">
        <AboutMe />
        <Timeline />
        <GitHubStats />

        <section className="py-16 px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center space-y-8"
            >
              <h2 className="text-3xl font-bold text-foreground">Let&apos;s Connect</h2>

              <div className="flex justify-center space-x-6">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -4 }}
                    className={`w-16 h-16 bg-card rounded-2xl flex items-center justify-center border border-border transition-all duration-200 ${social.color}`}
                  >
                    <social.icon className="w-7 h-7" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
    </div>
  );
}
