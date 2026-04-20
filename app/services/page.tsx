'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
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
import { ROUTES } from '@/lib/constants/routes';

const services = [
  {
    icon: Code,
    title: 'Frontend Development',
    description: 'Modern web applications with Next.js, React, and shadcn/ui',
    features: [
      'Next.js with App Router & Server Components',
      'shadcn/ui + Radix UI component systems',
      'TypeScript with strict type safety',
      'Framer Motion animations',
      'Drag & drop with DnD Kit',
    ],
    tech: ['Next.js', 'React', 'TypeScript', 'shadcn/ui', 'Framer Motion'],
  },
  {
    icon: Database,
    title: 'Backend Development',
    description: 'High-performance APIs with Go Fiber and Clean Architecture',
    features: [
      'Go Fiber framework for fast APIs',
      'Clean Architecture patterns',
      'Docker containerization',
      'RESTful API design',
    ],
    tech: ['Go Fiber', 'Clean Arch', 'Docker', 'PostgreSQL', 'MongoDB'],
  },
  {
    icon: Smartphone,
    title: 'Mobile Development',
    description: 'Flutter apps with BLoC state management',
    features: [
      'Flutter with BLoC pattern',
      'Provider for state management',
      'ZegoCloud video & chat SDK',
      'Push notifications',
    ],
    tech: ['Flutter', 'Dart', 'BLoC', 'ZegoCloud'],
  },
  {
    icon: Video,
    title: 'Real-time Communication',
    description: 'Video calling, chat, and push notifications',
    features: [
      'ZegoCloud RTC for video calls',
      'ZIM SDK for instant messaging',
      'Push notifications (ZPNs)',
      'Custom video call UI',
    ],
    tech: ['ZegoCloud RTC', 'ZIM', 'WebSockets', 'Push Notifications'],
  },
  {
    icon: HeartPulse,
    title: 'Healthcare Platforms',
    description: 'Complete healthcare platforms with patient, doctor, and admin apps',
    features: [
      'Patient mobile apps (Flutter)',
      'Doctor web applications (Next.js)',
      'Admin dashboards',
      'Role-based access control',
    ],
    tech: ['Flutter', 'Next.js', 'Go', 'Healthcare'],
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
    ],
    tech: ['Next.js', 'Flutter', 'Go Fiber', 'NextAuth'],
  },
  {
    icon: Palette,
    title: 'UI/UX Implementation',
    description: 'Pixel-perfect implementations with modern design systems',
    features: [
      'shadcn/ui component library',
      'Dark mode support',
      'Responsive mobile-first design',
      'Accessibility (WCAG 2.1)',
    ],
    tech: ['shadcn/ui', 'Radix UI', 'Tailwind CSS', 'next-themes'],
  },
  {
    icon: Rocket,
    title: 'Testing & DevOps',
    description: 'Testing, CI/CD, and performance monitoring',
    features: [
      'Unit tests with Vitest',
      'E2E tests with Playwright',
      'GitLab CI/CD pipelines',
      'Sentry error tracking',
    ],
    tech: ['Vitest', 'Playwright', 'GitLab CI', 'Sentry'],
  },
  {
    icon: Zap,
    title: 'Performance Optimization',
    description: 'Optimized builds and Core Web Vitals',
    features: [
      'Docker multi-stage builds',
      'Core Web Vitals monitoring',
      'Bundle analysis & optimization',
      'Automated testing & linting',
    ],
    tech: ['Docker', 'Lighthouse', 'ESLint', 'Husky'],
  },
];

const pricing = [
  {
    name: 'MVP / Startup',
    description: 'Perfect for launching your first product',
    features: [
      'Next.js frontend application',
      'Responsive mobile-first design',
      'shadcn/ui component system',
      'Authentication (NextAuth)',
      'Vercel deployment',
      '1 month support',
    ],
    highlighted: false,
  },
  {
    name: 'Platform',
    description: 'Most popular — Full-stack application',
    features: [
      'Next.js frontend + Go backend API',
      'Database design & implementation',
      'Admin dashboard included',
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
    features: [
      'Multiple mobile apps (Flutter)',
      'Multiple web apps (Next.js)',
      'Unified Go backend API',
      'Real-time features (video/chat)',
      'Docker deployment setup',
      '6 months support',
      'Documentation & team training',
    ],
    highlighted: false,
  },
];

const process = [
  { step: '01', title: 'Discovery', description: 'We discuss your project requirements, goals, and timeline.' },
  { step: '02', title: 'Proposal', description: 'I provide a detailed proposal with scope, timeline, and pricing.' },
  { step: '03', title: 'Development', description: 'I build your solution with regular updates and iterations.' },
  { step: '04', title: 'Delivery', description: 'Final review, deployment, and handoff with documentation.' },
];

export default function ServicesPage() {
  const router = useRouter();

  const handleContactClick = useCallback(() => {
    router.push(ROUTES.CONTACT);
  }, [router]);

  const handleBookingClick = useCallback(() => {
    router.push(ROUTES.BOOKING);
  }, [router]);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="pt-24 pb-16">
        <div className="container-premium">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <p className="section-label mb-3">Services</p>
            <h1 className="font-display text-4xl sm:text-5xl tracking-tight">
              Services & Solutions
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              Fullstack developer specializing in healthcare platforms, mobile apps, and real-time communication.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" onClick={handleContactClick}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Get a Quote
              </Button>
              <Button size="lg" variant="outline" onClick={handleBookingClick}>
                <Calendar className="mr-2 h-4 w-4" />
                Book a Call
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="border-t border-[hsl(var(--rule))] py-16 sm:py-20">
        <div className="container-premium">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h2 className="font-display text-3xl sm:text-4xl tracking-tight">What I Offer</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  className="rounded-[var(--radius)] border border-[hsl(var(--border))] bg-card p-6 transition-colors hover:border-[hsl(var(--muted-foreground)/0.3)]"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted mb-4">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-lg mb-1">{service.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
                  <ul className="space-y-2 mb-4">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-1.5">
                    {service.tech.map((tech) => (
                      <span key={tech} className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-mono text-muted-foreground">
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="border-t border-[hsl(var(--rule))] py-16 sm:py-20 bg-muted/30">
        <div className="container-premium">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h2 className="font-display text-3xl sm:text-4xl tracking-tight">How It Works</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {process.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
              >
                <div className="rounded-[var(--radius)] border border-[hsl(var(--border))] bg-card p-6">
                  <div className="font-display text-3xl text-[hsl(var(--accent))] mb-3">
                    {item.step}
                  </div>
                  <h3 className="font-medium mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 sm:py-20">
        <div className="container-premium">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h2 className="font-display text-3xl sm:text-4xl tracking-tight">Simple Pricing</h2>
            <p className="mt-3 text-muted-foreground">Choose the package that fits your needs.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
            {pricing.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
                className={`rounded-[var(--radius)] border bg-card p-6 ${
                  plan.highlighted
                    ? 'border-foreground'
                    : 'border-[hsl(var(--border))]'
                }`}
              >
                {plan.highlighted && (
                  <span className="mb-4 inline-block rounded-full bg-foreground px-3 py-1 text-xs text-background">
                    Most Popular
                  </span>
                )}
                <h3 className="font-display text-xl mb-1">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={plan.highlighted ? 'default' : 'outline'}
                  onClick={handleContactClick}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[hsl(var(--rule))] py-16 sm:py-20 bg-foreground text-background">
        <div className="container-premium text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h2 className="font-display text-3xl sm:text-4xl tracking-tight">
              Ready to Start Your Project?
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              Let&apos;s discuss how I can help bring your ideas to life.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                size="lg"
                variant="outline"
                className="border-background/20 text-background hover:bg-background/10"
                onClick={handleContactClick}
              >
                <Mail className="mr-2 h-4 w-4" />
                Send a Message
              </Button>
              <Button
                size="lg"
                className="bg-background text-foreground hover:bg-background/90"
                onClick={handleBookingClick}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Schedule a Call
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
