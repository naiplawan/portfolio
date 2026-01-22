'use client';

import { motion } from 'framer-motion';
import { PROFESSIONAL_INFO } from '@/lib/constants';

function PremiumContentSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
      },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 15,
      },
    },
  } as const;

  const highlights = [
    {
      title: 'Fullstack Architecture',
      description: 'Building scalable, maintainable applications with modern frameworks and best practices.',
      icon: '🏗️',
    },
    {
      title: 'Performance Engineering',
      description: 'Optimizing load times, Core Web Vitals, and user experience through technical excellence.',
      icon: '⚡',
    },
    {
      title: 'Business Impact',
      description: 'Delivering solutions that drive measurable results and ROI for stakeholders.',
      icon: '📈',
    },
    {
      title: 'Scalable Solutions',
      description: 'Creating systems that grow seamlessly with your business needs.',
      icon: '🔄',
    },
  ];

  return (
    <section className="relative section-padding overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-gradient-to-br from-terracotta/10 to-transparent rounded-full blur-3xl bio-blob opacity-50" />
        <div className="absolute bottom-20 left-1/4 w-96 h-96 bg-gradient-to-tl from-sage/10 to-transparent rounded-full blur-3xl bio-blob opacity-50" />
      </div>

      <div className="container-premium">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-6">
              <span className="bio-gradient-text">What I Do Best</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              I combine technical expertise with business acumen to deliver solutions that make a real impact.
            </p>
          </motion.div>

          {/* Highlights Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {highlights.map((highlight) => (
              <motion.div
                key={highlight.title}
                variants={itemVariants}
                className="bio-glass-card p-8 rounded-3xl hover:scale-[1.02] transition-transform cursor-default group"
                whileHover={{ y: -4 }}
              >
                <div className="text-5xl mb-4">{highlight.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-foreground">
                  {highlight.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {highlight.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Professional Info Banner */}
          <motion.div
            variants={itemVariants}
            className="mt-12 bio-glass-card p-8 rounded-3xl text-center"
          >
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-2xl">💼</span>
                <span className="font-medium text-foreground">
                  {PROFESSIONAL_INFO.company}
                </span>
              </div>
              <div className="w-px h-6 bg-border hidden sm:block" />
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                <span className="font-medium text-foreground">
                  {PROFESSIONAL_INFO.title}
                </span>
              </div>
              <div className="w-px h-6 bg-border hidden sm:block" />
              <div className="flex items-center gap-2">
                <span className="text-2xl">🌍</span>
                <span className="font-medium text-foreground">
                  {PROFESSIONAL_INFO.location}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default PremiumContentSection;
