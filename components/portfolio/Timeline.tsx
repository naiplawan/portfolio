'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Briefcase, GraduationCap, Award, Rocket, Calendar, MapPin } from 'lucide-react';
import { TimelineItem, getTimelineSorted, getTimelineByType } from '@/lib/data/timeline-data';

const iconMap = {
  work: Briefcase,
  education: GraduationCap,
  achievement: Award,
  project: Rocket,
};

const colorMap = {
  work: 'bg-blue-500',
  education: 'bg-purple-500',
  achievement: 'bg-yellow-500',
  project: 'bg-green-500',
};

const typeLabels = {
  work: 'Work Experience',
  education: 'Education',
  achievement: 'Achievement',
  project: 'Project',
};

export default function Timeline() {
  const [selectedType, setSelectedType] = useState<TimelineItem['type'] | 'all'>('all');

  const timelineItems = selectedType === 'all'
    ? getTimelineSorted()
    : getTimelineByType(selectedType);

  const formatDate = (date: string, endDate?: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short' };
    const startFormatted = new Date(date).toLocaleDateString('en-US', options);

    if (endDate) {
      const endFormatted = new Date(endDate).toLocaleDateString('en-US', options);
      return `${startFormatted} - ${endFormatted}`;
    }

    return `${startFormatted} - Present`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 300,
        damping: 24,
      },
    },
  };

  return (
    <section className="py-16 px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Career Journey
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A timeline of my professional experience, education, and achievements
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          <Button
            variant={selectedType === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedType('all')}
            className="transition-all"
          >
            All
          </Button>
          {Object.entries(typeLabels).map(([type, label]) => (
            <Button
              key={type}
              variant={selectedType === type ? 'default' : 'outline'}
              onClick={() => setSelectedType(type as TimelineItem['type'])}
              className="transition-all"
            >
              {label}
            </Button>
          ))}
        </motion.div>

        {/* Timeline */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative"
        >
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border hidden md:block" />

          <div className="space-y-8">
            {timelineItems.map((item) => {
              const Icon = iconMap[item.type];
              const color = colorMap[item.type];

              return (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  className="relative"
                >
                  {/* Timeline Dot */}
                  <div className={`absolute left-6 top-6 w-4 h-4 rounded-full ${color} border-4 border-background hidden md:block z-10`} />

                  {/* Content */}
                  <div className="md:ml-20">
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                          <div className="flex items-start gap-3 flex-1">
                            <div className={`p-2 rounded-lg ${color} text-white shrink-0`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-xl mb-1">{item.title}</CardTitle>
                              <p className="text-muted-foreground font-medium">
                                {item.organization}
                              </p>
                            </div>
                          </div>
                          <Badge variant="secondary" className="shrink-0">
                            {typeLabels[item.type]}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(item.date, item.endDate)}
                          </div>
                          {item.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {item.location}
                            </div>
                          )}
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <p className="text-foreground/80">{item.description}</p>

                        {item.highlights && item.highlights.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-2 text-sm text-muted-foreground">
                              Key Highlights
                            </h4>
                            <ul className="space-y-1">
                              {item.highlights.map((highlight, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm">
                                  <span className="text-primary mt-1.5">•</span>
                                  <span>{highlight}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {item.technologies && item.technologies.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-2 text-sm text-muted-foreground">
                              Technologies
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {item.technologies.map((tech) => (
                                <Badge key={tech} variant="outline" className="text-xs">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {timelineItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No items found for this filter.</p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
