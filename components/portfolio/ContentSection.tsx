'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import Download from '@/components/ui/icons/Download';
import Mail from '@/components/ui/icons/Mail';
import ArrowRight from '@/components/ui/icons/ArrowRight';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import TypewriterEffect from '@/components/ui/TypewriterEffect';
import { SOCIAL_LINKS, RESUME_PATH, TYPEWRITER_WORDS, SKILL_TAGS, PROFESSIONAL_INFO } from '@/lib/constants';

const ParticleBackground = dynamic(() => import('@/components/ui/ParticleBackground'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800" />,
});

function ContentSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
        stiffness: 300,
        damping: 24,
      },
    },
  };

  return (
    <section className="relative pt-20 pb-8 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
      <ParticleBackground />
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center space-y-6 sm:space-y-8"
        >
          <motion.div variants={itemVariants} className="space-y-4 sm:space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-black dark:text-white tracking-tight leading-tight">
              Rachaphol
              <br />
              <span className="text-blue-600">Plookaom</span>
            </h1>

            <div className="text-lg sm:text-xl md:text-2xl text-gray-600 font-light max-w-3xl mx-auto leading-relaxed px-2">
              <TypewriterEffect
                words={TYPEWRITER_WORDS}
                className="text-blue-600 font-medium"
              />
            </div>

            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 max-w-2xl mx-auto px-4">
              {SKILL_TAGS.map((tag, index) => {
                const colors = [
                  'bg-blue-100 text-blue-800',
                  'bg-green-100 text-green-800',
                  'bg-purple-100 text-purple-800',
                  'bg-orange-100 text-orange-800',
                ];
                return (
                  <span key={tag} className={`px-2 py-1 sm:px-3 sm:py-1 ${colors[index]} rounded-full text-xs sm:text-sm font-medium`}>
                    {tag}
                  </span>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4"
          >
            <Button
              size="lg"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 rounded-full font-medium transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
              onClick={() => (window.location.href = '/projects')}
              aria-label="View my portfolio projects"
            >
              View My Work
              <ArrowRight size={16} />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-gray-300 text-gray-700 px-6 sm:px-8 py-3 rounded-full font-medium hover:bg-gray-50 transition-all duration-200 text-sm sm:text-base dark:text-white"
              onClick={() => window.open(RESUME_PATH, '_blank')}
              aria-label="Download CV as PDF"
            >
              <Download size={16} />
              Download CV
            </Button>
          </motion.div>

          <motion.div variants={itemVariants} className="flex items-center justify-center gap-4 sm:gap-6 pt-6 sm:pt-8">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 sm:h-12 sm:w-12 rounded-full hover:bg-gray-100 transition-all duration-200"
              onClick={() => window.open(SOCIAL_LINKS.github, '_blank')}
              aria-label="Visit my GitHub profile"
            >
              <FaGithub className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 sm:h-12 sm:w-12 rounded-full hover:bg-gray-100 transition-all duration-200"
              onClick={() => window.open(SOCIAL_LINKS.linkedin, '_blank')}
              aria-label="Visit my LinkedIn profile"
            >
              <FaLinkedin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 sm:h-12 sm:w-12 rounded-full hover:bg-gray-100 transition-all duration-200"
              onClick={() => (window.location.href = `mailto:${SOCIAL_LINKS.email}`)}
              aria-label="Send me an email"
            >
              <Mail size={20} color="#6b7280" />
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.8 }}
          className="mt-12 sm:mt-16 md:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 px-4"
        >
          <div className="text-center space-y-2 py-4 sm:py-0">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{PROFESSIONAL_INFO.experience}</div>
            <div className="text-sm sm:text-base text-gray-600 font-medium">Months at {PROFESSIONAL_INFO.company.split(',')[0]}</div>
          </div>
          <div className="text-center space-y-2 py-4 sm:py-0 border-t sm:border-t-0 sm:border-l sm:border-r border-gray-200 ">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Fullstack</div>
            <div className="text-sm sm:text-base text-gray-600 font-medium">Architect</div>
          </div>
          <div className="text-center space-y-2 py-4 sm:py-0 border-t sm:border-t-0 border-gray-200">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{PROFESSIONAL_INFO.technologies}</div>
            <div className="text-sm sm:text-base text-gray-600 font-medium">Technologies</div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 1.0 }}
          className="mt-16 sm:mt-20 md:mt-24 text-center px-4"
        >
          <div className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 rounded-full bg-blue-50 text-blue-700 text-xs sm:text-sm font-medium">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
            Available for new opportunities
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default ContentSection;
