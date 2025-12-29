'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Clock,
  Video,
  Mail,
  ArrowRight,
  CheckCircle,
  Users,
  Zap,
} from 'lucide-react';
import Link from 'next/link';

const timeSlots = [
  { time: '15 minutes', type: 'Quick Chat', description: 'Brief introduction or question' },
  { time: '30 minutes', type: 'Consultation', description: 'Project discussion' },
  { time: '45 minutes', type: 'Deep Dive', description: 'Technical discussion' },
  { time: '60 minutes', type: 'Full Meeting', description: 'Comprehensive consultation' },
];

const topics = [
  { icon: Zap, title: 'Project Inquiry', description: 'Discuss a new project or opportunity' },
  { icon: Users, title: 'Collaboration', description: 'Explore working together' },
  { icon: Video, title: 'Technical Review', description: 'Code review or architecture discussion' },
  { icon: Mail, title: 'General Inquiry', description: 'Any other questions or opportunities' },
];

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <Badge variant="secondary" className="px-4 py-1.5 text-sm">
              Available for Calls
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white tracking-tight">
              Let&apos;s Schedule a Call
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Book a time to discuss your project. I offer flexible scheduling options to fit your
              needs and timezone.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Time Slots Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Choose Your Duration
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Select the meeting length that works best for you
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {timeSlots.map((slot, index) => (
              <motion.div
                key={slot.time}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-2 hover:border-blue-300 dark:hover:border-blue-700">
                  <CardHeader className="text-center pb-3">
                    <Clock className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                    <CardTitle className="text-xl">{slot.time}</CardTitle>
                    <CardDescription className="text-base">{slot.type}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-4">
                      {slot.description}
                    </p>
                    <Button
                      className="w-full"
                      variant="outline"
                      asChild
                    >
                      <Link href="/contact?subject=Meeting Request: {slot.time}">
                        Select
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Topics Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What to Discuss
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Come prepared with topics you&apos;d like to cover
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {topics.map((topic, index) => {
              const Icon = topic.icon;
              return (
                <motion.div
                  key={topic.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-md transition-shadow duration-300">
                    <CardContent className="pt-6">
                      <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg sm:rounded-xl flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {topic.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {topic.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="text-2xl">Before We Meet</CardTitle>
                <CardDescription className="text-base">
                  To make the most of our time together
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Come prepared with questions
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Share your project details, challenges, and goals beforehand
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Be on time
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      I respect your time and ask the same in return
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Bring your team
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Feel free to invite stakeholders or decision makers
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center text-white"
          >
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-90" />
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to Book?
            </h2>
            <p className="text-lg sm:text-xl text-blue-100 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Send me a message with your preferred time and topic, and I&apos;ll confirm our meeting.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50"
                asChild
              >
                <Link href="/contact?subject=Meeting Request">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Meeting Request
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
            <p className="text-sm text-blue-100 mt-6">
              Usually respond within 24 hours
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
