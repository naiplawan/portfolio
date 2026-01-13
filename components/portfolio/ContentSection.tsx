'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ClayCard } from '@/components/ui/clay-card';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import TypewriterEffect from '@/components/ui/TypewriterEffect';
import {
  SOCIAL_LINKS,
  TYPEWRITER_WORDS,
  SKILL_TAGS,
  PROFESSIONAL_INFO,
} from '@/lib/constants';

function ContentSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 200,
        damping: 20,
      },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column - Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6 sm:space-y-8"
          >
            <motion.div variants={itemVariants} className="space-y-4">
              <ClayCard variant="sage" className="inline-flex items-center px-4 py-2 rounded-full mb-4">
                <span className="w-3 h-3 bg-terracotta rounded-full mr-2 animate-bounce"></span>
                <span className="text-sm font-medium text-foreground">
                  Available for new opportunities
                </span>
              </ClayCard>

              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold font-display tracking-tight leading-tight">
                Rachaphol
                <br />
                <span className="earth-text">Plookaom</span>
              </h1>

              <div className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl font-light">
                <TypewriterEffect
                  words={TYPEWRITER_WORDS}
                  className="text-foreground font-medium"
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-wrap gap-2 max-w-2xl">
              {SKILL_TAGS.slice(0, 8).map((tag) => (
                <span
                  key={tag}
                  className="clay-card px-4 py-2 rounded-full text-sm font-medium hover:scale-105 transition-transform cursor-default"
                >
                  {tag}
                </span>
              ))}
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-center gap-4">
              <Button
                className="clay-button px-8 py-6 text-lg font-semibold rounded-2xl"
                onClick={() => (window.location.href = `mailto:${SOCIAL_LINKS.email}`)}
              >
                <FaEnvelope className="mr-2" />
                Get in Touch
              </Button>
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="clay-card h-14 w-14 rounded-2xl hover:scale-110 transition-transform"
                  onClick={() => window.open(SOCIAL_LINKS.github, '_blank')}
                  aria-label="Visit my GitHub profile"
                >
                  <FaGithub className="w-6 h-6 text-terracotta" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="clay-card h-14 w-14 rounded-2xl hover:scale-110 transition-transform"
                  onClick={() => window.open(SOCIAL_LINKS.linkedin, '_blank')}
                  aria-label="Visit my LinkedIn profile"
                >
                  <FaLinkedin className="w-6 h-6 text-terracotta" />
                </Button>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Clay Code Card */}
          <motion.div
            initial={{ opacity: 0, x: 50, rotate: -5 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 0.6, delay: 0.3, type: 'spring' }}
            className="relative"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ClayCard variant="terracotta" className="overflow-hidden">
                {/* Code Editor Header */}
                <div className="flex items-center gap-2 mb-4 pb-4 border-b-2 border-beige/30">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="ml-4 text-xs text-muted-foreground font-mono">developer.ts</span>
                </div>

                {/* Code Content */}
                <pre className="text-sm sm:text-base font-mono overflow-x-auto">
                  <code>
                    <span className="text-terracotta">const</span>{' '}
                    <span className="text-sage">developer</span>
                    <span className="text-foreground"> = {'{'}</span>
                    <br />
                    <span className="pl-4 text-beige">name</span>
                    <span className="text-foreground">:</span>{' '}
                    <span className="text-green-600">&quot;Rachaphol&quot;</span>
                    <span className="text-foreground">,</span>
                    <br />
                    <span className="pl-4 text-beige">role</span>
                    <span className="text-foreground">:</span>{' '}
                    <span className="text-green-600">&quot;Fullstack&quot;</span>
                    <span className="text-foreground">,</span>
                    <br />
                    <span className="pl-4 text-beige">style</span>
                    <span className="text-foreground">:</span>{' '}
                    <span className="text-green-600">&quot;Claymorphism&quot;</span>
                    <span className="text-foreground">,</span>
                    <br />
                    <span className="pl-4 text-beige">colors</span>
                    <span className="text-foreground">:</span>{' '}
                    <span className="text-foreground">[</span>
                    <br />
                    <span className="pl-8 text-green-600">&quot;Sage&quot;</span>
                    <span className="text-foreground">,</span>
                    <br />
                    <span className="pl-8 text-green-600">&quot;Terracotta&quot;</span>
                    <span className="text-foreground">,</span>
                    <br />
                    <span className="pl-8 text-green-600">&quot;Beige&quot;</span>
                    <span className="text-foreground">,</span>
                    <br />
                    <span className="pl-4 text-foreground">],</span>
                    <br />
                    <span className="pl-4 text-beige">passion</span>
                    <span className="text-foreground">:</span>{' '}
                    <span className="text-orange-500">∞</span>
                    <br />
                    <span className="text-foreground">{'};'}</span>
                  </code>
                </pre>
              </ClayCard>
            </motion.div>
          </motion.div>
        </div>

        {/* Stats Section - Clay Cards */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.8 }}
          className="mt-16 sm:mt-20 md:mt-24 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8"
        >
          <ClayCard variant="sage" className="text-center py-10 hover:scale-105 transition-transform">
            <div className="text-4xl sm:text-5xl font-bold earth-text font-display mb-2">
              {PROFESSIONAL_INFO.experience}+
            </div>
            <div className="text-sm sm:text-base text-muted-foreground font-medium">
              Months Experience
            </div>
          </ClayCard>

          <ClayCard variant="beige" className="text-center py-10 hover:scale-105 transition-transform">
            <div className="text-4xl sm:text-5xl font-bold earth-text font-display mb-2">
              Fullstack
            </div>
            <div className="text-sm sm:text-base text-muted-foreground font-medium">
              Architect
            </div>
          </ClayCard>

          <ClayCard variant="terracotta" className="text-center py-10 hover:scale-105 transition-transform">
            <div className="text-4xl sm:text-5xl font-bold earth-text font-display mb-2">
              {PROFESSIONAL_INFO.technologies}+
            </div>
            <div className="text-sm sm:text-base text-muted-foreground font-medium">
              Technologies
            </div>
          </ClayCard>
        </motion.div>
      </div>
    </section>
  );
}

export default ContentSection;
