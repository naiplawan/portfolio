import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { ROUTES } from '@/lib/constants/routes';

const services = [
  {
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
  return (
    <>
      <section className="container-premium pt-[clamp(4rem,10vw,8rem)]">
        <SectionHeading as="h1" label="Services" title="Product engineering across web, mobile and API">
          I build healthcare platforms, mobile apps and real-time features —
          from first prototype to production handoff.
        </SectionHeading>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
          <Link
            href={ROUTES.CONTACT}
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-foreground px-5 text-background transition-opacity hover:opacity-85"
          >
            Get a quote
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link href={ROUTES.BOOKING} className="ed-link">
            Book a call
          </Link>
        </div>
      </section>

      <section className="container-premium section-padding">
        <SectionHeading index="01" label="Offer" title="What I can help with" />
        <ol className="grid border-t border-[hsl(var(--rule))] md:grid-cols-2 md:gap-x-12">
          {services.map((service, index) => (
            <li key={service.title} className="border-b border-[hsl(var(--rule))] py-8">
              <div className="flex items-baseline gap-4">
                <span className="index-num">{String(index + 1).padStart(2, '0')}</span>
                <h3 className="font-display text-2xl tracking-tight">{service.title}</h3>
              </div>
              <p className="mt-3 text-muted-foreground">{service.description}</p>
              <ul className="mt-4 space-y-1.5 text-sm">
                {service.features.map((feature) => (
                  <li key={feature} className="flex gap-3">
                    <span aria-hidden="true" className="text-muted-foreground">–</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <p className="mono-tag mt-5">{service.tech.join(' · ')}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="container-premium pb-[clamp(4rem,10vw,8rem)]">
        <SectionHeading index="02" label="Process" title="How a project runs" />
        <ol className="grid border-t border-[hsl(var(--rule))] sm:grid-cols-2 lg:grid-cols-4">
          {process.map((item) => (
            <li key={item.step} className="border-b border-[hsl(var(--rule))] py-6 sm:pr-8 lg:border-b-0">
              <span className="font-pixel text-3xl text-[hsl(var(--accent))]">{item.step}</span>
              <h3 className="mt-3 font-medium">{item.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="container-premium pb-[clamp(4rem,10vw,8rem)]">
        <SectionHeading index="03" label="Engagements" title="Ways to work together">
          Every project is scoped individually. These are typical starting points.
        </SectionHeading>
        <div className="grid gap-px overflow-hidden border border-[hsl(var(--rule))] bg-[hsl(var(--rule))] md:grid-cols-3">
          {pricing.map((plan) => (
            <div key={plan.name} className="flex flex-col bg-background p-6 sm:p-8">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-display text-2xl tracking-tight">{plan.name}</h3>
                {plan.highlighted && <span className="section-label text-[hsl(var(--accent))]">Most common</span>}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
              <ul className="mt-6 flex-1 space-y-2 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-3">
                    <span aria-hidden="true" className="text-muted-foreground">–</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={`${ROUTES.CONTACT}?subject=${encodeURIComponent(`Enquiry: ${plan.name}`)}`}
                className="ed-link mt-8 inline-flex items-center gap-1 self-start text-sm"
              >
                Start a {plan.name} project
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
