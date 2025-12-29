'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Code,
  Zap,
  Smartphone,
  Database,
  Palette,
  Rocket,
  CheckCircle,
  ArrowRight,
  Mail,
  Calendar,
  MessageSquare,
  Video,
  HeartPulse,
  Building,
} from 'lucide-react';
import Link from 'next/link';

const services = [
  {
    icon: Code,
    title: 'Frontend Development',
    description: 'Modern web applications with Next.js 16, React 19, and shadcn/ui',
    features: [
      'Next.js 15-16 with App Router & Server Components',
      'shadcn/ui + Radix UI component systems',
      'TypeScript with strict type safety',
      'Framer Motion animations',
      'Drag & drop with DnD Kit',
    ],
    tech: ['Next.js 16', 'React 19', 'TypeScript', 'shadcn/ui', 'Framer Motion', 'DnD Kit'],
  },
  {
    icon: Database,
    title: 'Backend Development',
    description: 'High-performance APIs with Go Fiber and Clean Architecture',
    features: [
      'Go Fiber framework for fast APIs',
      'Clean Architecture patterns',
      'Docker containerization',
      'Air hot-reload for development',
      'RESTful API design',
    ],
    tech: ['Go Fiber', 'Clean Arch', 'Docker', 'PostgreSQL', 'MongoDB'],
  },
  {
    icon: Smartphone,
    title: 'Mobile Development',
    description: 'Flutter apps with BLoC state management and Clean Architecture',
    features: [
      'Flutter with BLoC pattern',
      'Provider for state management',
      'ZegoCloud video & chat SDK',
      'Camera & image picker integration',
      'Push notifications (ZPNs)',
    ],
    tech: ['Flutter', 'Dart', 'BLoC', 'ZegoCloud', 'Provider'],
  },
  {
    icon: Video,
    title: 'Real-time Communication',
    description: 'Video calling, chat, and push notifications integration',
    features: [
      'ZegoCloud RTC for video calls',
      'ZIM SDK for instant messaging',
      'Push notifications (ZPNs)',
      'Custom video call UI',
      'Chat history management',
    ],
    tech: ['ZegoCloud RTC', 'ZegoCloud ZIM', 'WebSockets', 'Push Notifications'],
  },
  {
    icon: HeartPulse,
    title: 'Healthcare Platforms',
    description: 'Complete healthcare platforms with patient, doctor, and admin apps',
    features: [
      'Patient mobile apps (Flutter)',
      'Doctor web applications (Next.js)',
      'Admin dashboards (React/Next.js)',
      'Driver/delivery apps',
      'Role-based access control',
    ],
    tech: ['Flutter', 'Next.js', 'Go', 'Healthcare', 'Multi-app'],
  },
  {
    icon: Building,
    title: 'Full-Stack Platforms',
    description: 'End-to-end platforms with web, mobile, and backend integration',
    features: [
      'Multiple frontend apps (web + mobile)',
      'Unified backend API',
      'Cross-app authentication',
      'Real-time data sync',
      'Admin panel integration',
    ],
    tech: ['Next.js', 'Flutter', 'Go Fiber', 'NextAuth', 'Docker'],
  },
  {
    icon: Palette,
    title: 'UI/UX Implementation',
    description: 'Pixel-perfect implementations with modern design systems',
    features: [
      'shadcn/ui component library',
      'Radix UI primitives',
      'Dark mode with next-themes',
      'Responsive mobile-first design',
      'Accessibility (WCAG 2.1)',
    ],
    tech: ['shadcn/ui', 'Radix UI', 'Tailwind CSS 4', 'next-themes'],
  },
  {
    icon: Rocket,
    title: 'Testing & Quality',
    description: 'Comprehensive testing with Vitest, Playwright, and MSW',
    features: [
      'Unit tests with Vitest',
      'E2E tests with Playwright',
      'Testing Library for components',
      'MSW for API mocking',
      'Test-driven development',
    ],
    tech: ['Vitest', 'Playwright', 'Testing Library', 'MSW', 'Husky'],
  },
  {
    icon: Zap,
    title: 'Performance & DevOps',
    description: 'Optimized builds, CI/CD, and performance monitoring',
    features: [
      'GitLab CI/CD pipelines',
      'Docker multi-stage builds',
      'Sentry error tracking',
      'Core Web Vitals monitoring',
      'Automated testing & linting',
    ],
    tech: ['GitLab CI', 'Docker', 'Sentry', 'Husky', 'ESLint'],
  },
];

const pricing = [
  {
    name: 'MVP / Startup',
    description: 'Perfect for launching your first product',
    price: 'Contact',
    features: [
      'Next.js frontend application',
      'Responsive mobile-first design',
      'shadcn/ui component system',
      'Contact form & basic features',
      'Authentication (NextAuth)',
      'Vercel deployment',
      '1 month support',
    ],
    highlighted: false,
  },
  {
    name: 'Platform',
    description: 'Most popular - Full-stack application',
    price: 'Contact',
    features: [
      'Next.js frontend + Go backend API',
      'Database design & implementation',
      'Admin dashboard included',
      'Authentication & authorization',
      'GitLab CI/CD setup',
      'Error tracking (Sentry)',
      '3 months support',
      'Source code included',
    ],
    highlighted: true,
  },
  {
    name: 'Ecosystem',
    description: 'Multi-app platform like healthcare systems',
    price: 'Contact',
    features: [
      'Multiple mobile apps (Flutter)',
      'Multiple web apps (Next.js)',
      'Unified Go backend API',
      'Real-time features (video/chat)',
      'Role-based access control',
      'Docker deployment setup',
      '6 months support',
      'Documentation & team training',
    ],
    highlighted: false,
  },
];

const process = [
  {
    step: '01',
    title: 'Discovery',
    description: 'We discuss your project requirements, goals, and timeline.',
  },
  {
    step: '02',
    title: 'Proposal',
    description: 'I provide a detailed proposal with scope, timeline, and pricing.',
  },
  {
    step: '03',
    title: 'Development',
    description: 'I build your solution with regular updates and iterations.',
  },
  {
    step: '04',
    title: 'Delivery',
    description: 'Final review, deployment, and handoff with documentation.',
  },
];

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

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6"
          >
            <Badge variant="secondary" className="px-4 py-1.5 text-sm">
              Available for Hire
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white tracking-tight">
              Services & Solutions
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Fullstack developer specializing in healthcare platforms, mobile apps, and real-time communication.
              Proven experience building complete multi-app ecosystems with Next.js, Flutter, and Go.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button size="lg" className="w-full sm:w-auto" asChild>
                <Link href="/contact">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Get a Quote
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
                <Link href="/booking">
                  <Calendar className="w-4 h-4 mr-2" />
                  Book a Call
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16 space-y-4"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              What I Offer
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Comprehensive development services to bring your ideas to life
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <motion.div key={service.title} variants={itemVariants}>
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg sm:rounded-xl flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                      <CardDescription className="text-sm sm:text-base">
                        {service.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ul className="space-y-2">
                        {service.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                            <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {service.tech.map((tech) => (
                          <Badge key={tech} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16 space-y-4"
          >
            <Badge variant="secondary" className="px-4 py-1.5 text-sm">
              Featured Work
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Projects I&apos;ve Built
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Real-world projects showcasing full-stack capabilities across multiple platforms
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {/* Healthcare Platform */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center mb-4">
                      <HeartPulse className="w-6 h-6 text-white" />
                    </div>
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      Healthcare Platform
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">Multi-App Healthcare Platform</CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Complete healthcare ecosystem with patient app, doctor portal, admin dashboard, and driver app
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">Key Features:</div>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                        <span>Video consultations with real-time communication</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                        <span>In-app chat with message history</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                        <span>4 mobile apps + 2 web applications</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                        <span>Role-based access control</span>
                      </li>
                    </ul>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Badge variant="secondary" className="text-xs">Flutter</Badge>
                    <Badge variant="secondary" className="text-xs">Next.js 15</Badge>
                    <Badge variant="secondary" className="text-xs">Go Fiber</Badge>
                    <Badge variant="secondary" className="text-xs">BLoC</Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* SaaS Platform */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-purple-200 dark:border-purple-800">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg sm:rounded-xl flex items-center justify-center mb-4">
                      <Building className="w-6 h-6 text-white" />
                    </div>
                    <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                      SaaS Platform
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">Full-Stack SaaS Application</CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Full-stack SaaS application with comprehensive testing and drag-and-drop functionality
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">Key Features:</div>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                        <span>Complex drag-and-drop functionality</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                        <span>Full testing suite (unit + E2E)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                        <span>API mocking for development</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                        <span>QR code generation & authentication</span>
                      </li>
                    </ul>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Badge variant="secondary" className="text-xs">Next.js 16</Badge>
                    <Badge variant="secondary" className="text-xs">React 19</Badge>
                    <Badge variant="secondary" className="text-xs">Go Fiber</Badge>
                    <Badge variant="secondary" className="text-xs">DnD Kit</Badge>
                    <Badge variant="secondary" className="text-xs">Vitest</Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16 space-y-4"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              A simple, transparent process from start to finish
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {process.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-sm">
                  <div className="text-3xl sm:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                    {item.description}
                  </p>
                </div>
                {index < process.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-blue-200 dark:bg-blue-800" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16 space-y-4"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Simple Pricing
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Choose the package that fits your needs. All packages include source code and support.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {pricing.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={plan.highlighted ? 'md:-mt-4 md:mb-4' : ''}
              >
                <Card
                  className={`h-full ${
                    plan.highlighted
                      ? 'border-blue-500 border-2 shadow-xl relative'
                      : 'hover:shadow-lg transition-shadow duration-300'
                  }`}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-blue-600 text-white px-4 py-1">Most Popular</Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription className="text-sm sm:text-base">{plan.description}</CardDescription>
                    <div className="pt-4">
                      <span className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                        {plan.price}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                          <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`w-full ${
                        plan.highlighted
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : ''
                      }`}
                      variant={plan.highlighted ? 'default' : 'outline'}
                      asChild
                    >
                      <Link href="/contact">
                        Get Started
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
              Ready to Start Your Project?
            </h2>
            <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto pt-4">
              Let&apos;s discuss how I can help bring your ideas to life. Get in touch and I&apos;ll get
              back to you within 24 hours.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              size="lg"
              variant="secondary"
              className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50"
              asChild
            >
              <Link href="/contact">
                <Mail className="w-4 h-4 mr-2" />
                Send a Message
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-white text-white hover:bg-white/10"
              asChild
            >
              <Link href="/booking">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule a Call
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
