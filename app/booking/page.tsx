'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
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
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="pb-16">
        <div className="container-premium">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <p className="section-label mb-3">Booking</p>
            <h1 className="font-display text-4xl sm:text-5xl tracking-tight">
              Schedule a Call
            </h1>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              Book a time to discuss your project. I offer flexible scheduling options to fit your needs and timezone.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Time Slots */}
      <section className="border-t border-[hsl(var(--rule))] py-16">
        <div className="container-premium">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <h2 className="font-display text-3xl tracking-tight">Choose Your Duration</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {timeSlots.map((slot, index) => (
              <motion.div
                key={slot.time}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
                className="rounded-[var(--radius)] border border-[hsl(var(--border))] bg-card p-5 text-center transition-colors hover:border-[hsl(var(--muted-foreground)/0.3)]"
              >
                <Clock className="mx-auto mb-3 h-6 w-6 text-muted-foreground" />
                <h3 className="font-display text-lg">{slot.time}</h3>
                <p className="text-sm text-muted-foreground">{slot.type}</p>
                <p className="mt-2 text-xs text-muted-foreground">{slot.description}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 w-full"
                  asChild
                >
                  <Link href={`/contact?subject=Meeting Request: ${slot.time}`}>
                    Select
                  </Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Topics */}
      <section className="border-t border-[hsl(var(--rule))] py-16 bg-muted/30">
        <div className="container-premium">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <h2 className="font-display text-3xl tracking-tight">What to Discuss</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {topics.map((topic, index) => {
              const Icon = topic.icon;
              return (
                <motion.div
                  key={topic.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08, duration: 0.4 }}
                  className="rounded-[var(--radius)] border border-[hsl(var(--border))] bg-card p-5"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted mb-3">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-medium mb-1">{topic.title}</h3>
                  <p className="text-sm text-muted-foreground">{topic.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Before We Meet */}
      <section className="border-t border-[hsl(var(--rule))] py-16">
        <div className="container-premium max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display text-3xl tracking-tight mb-6">Before We Meet</h2>
            <div className="space-y-4">
              {[
                { title: 'Come prepared with questions', desc: 'Share your project details, challenges, and goals beforehand' },
                { title: 'Be on time', desc: 'I respect your time and ask the same in return' },
                { title: 'Bring your team', desc: 'Feel free to invite stakeholders or decision makers' },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[hsl(var(--rule))] py-16 bg-foreground text-background">
        <div className="container-premium text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <Calendar className="mx-auto h-10 w-10 opacity-60" />
            <h2 className="font-display text-3xl sm:text-4xl tracking-tight">
              Ready to Book?
            </h2>
            <p className="mx-auto max-w-lg text-muted">
              Send me a message with your preferred time and topic, and I&apos;ll confirm our meeting.
            </p>
            <Button
              size="lg"
              className="bg-background text-foreground hover:bg-background/90"
              asChild
            >
              <Link href="/contact?subject=Meeting Request">
                <Mail className="mr-2 h-4 w-4" />
                Send Meeting Request
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <p className="text-xs text-muted">Usually respond within 24 hours</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
