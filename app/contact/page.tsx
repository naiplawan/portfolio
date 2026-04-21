'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { motion } from 'framer-motion';
import { contactFormLimiter, formatTimeRemaining } from '@/lib/utils/rate-limit';
import { trackContactFormSubmit } from '@/components/analytics';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '';
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';

const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
};

export default function ContactPage() {
  const [senderEmail, setSenderEmail] = useState('');
  const [senderName, setSenderName] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<{ email?: string; message?: string; name?: string }>({});
  const [configReady, setConfigReady] = useState(true);

  useEffect(() => {
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      setConfigReady(false);
    }
  }, []);

  const validateForm = () => {
    const newErrors: { email?: string; message?: string; name?: string } = {};

    if (!senderName.trim()) {
      newErrors.name = 'Please enter your name';
    } else if (senderName.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!senderEmail.trim()) {
      newErrors.email = 'Please enter your email';
    } else if (!emailRegex.test(senderEmail)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!message.trim()) {
      newErrors.message = 'Please enter a message';
    } else if (message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (honeypot) return;

    const rateLimitCheck = contactFormLimiter.check();
    if (!rateLimitCheck.allowed) {
      setStatus('error');
      setErrors({
        email: `Too many attempts. Please try again in ${formatTimeRemaining(rateLimitCheck.resetIn)}.`,
      });
      return;
    }

    if (!validateForm()) return;

    setIsLoading(true);
    setStatus('idle');

    if (!configReady) {
      setStatus('error');
      setErrors({ email: 'Email service not configured. Please contact directly.' });
      setIsLoading(false);
      return;
    }

    emailjs
      .send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          senderName: sanitizeInput(senderName),
          senderEmail: sanitizeInput(senderEmail),
          message: sanitizeInput(message),
        },
        EMAILJS_PUBLIC_KEY
      )
      .then(
        () => {
          setStatus('success');
          contactFormLimiter.increment();
          trackContactFormSubmit(true);
          setSenderEmail('');
          setSenderName('');
          setMessage('');
          setErrors({});
        },
        () => {
          setStatus('error');
          trackContactFormSubmit(false);
        }
      )
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="container-premium section-padding">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="section-label mb-3">Contact</p>
          <h1 className="font-display text-4xl sm:text-5xl tracking-tight">Get in Touch</h1>
          <p className="mt-4 max-w-lg text-muted-foreground">
            Have a project in mind? Send me a message or reach out directly.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="lg:col-span-3"
          >
            {!configReady && (
              <div className="mb-6 rounded-[var(--radius)] border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                Contact form is not configured. Please reach out directly at{' '}
                <a className="underline" href="mailto:rachaphol.plo@gmail.com">
                  rachaphol.plo@gmail.com
                </a>.
              </div>
            )}

            {status === 'success' && (
              <div className="mb-6 flex items-center gap-2 rounded-[var(--radius)] border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-600 dark:text-green-400">
                <CheckCircle className="h-4 w-4" />
                Message sent successfully! Thank you for reaching out.
              </div>
            )}

            {status === 'error' && (
              <div className="mb-6 rounded-[var(--radius)] border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                Failed to send message. Please try again or contact me directly.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                type="text"
                name="bot-field"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm">Name</label>
                  <Input
                    id="name"
                    name="senderName"
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    maxLength={100}
                    placeholder="Your name"
                    className={errors.name ? 'border-destructive' : ''}
                    disabled={isLoading}
                  />
                  {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm">Email</label>
                  <Input
                    id="email"
                    name="senderEmail"
                    type="email"
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    maxLength={500}
                    placeholder="you@example.com"
                    className={errors.email ? 'border-destructive' : ''}
                    disabled={isLoading}
                  />
                  {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm">Message</label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Tell me about your project..."
                  maxLength={5000}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={`min-h-[150px] resize-none ${errors.message ? 'border-destructive' : ''}`}
                  disabled={isLoading}
                />
                {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
                <p className="text-xs text-muted-foreground">{message.length}/5000 characters</p>
              </div>

              <Button
                type="submit"
                disabled={isLoading || !configReady}
                className="w-full sm:w-auto min-w-[160px]"
              >
                {isLoading ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="lg:col-span-2 space-y-4"
          >
            <a
              href="mailto:rachaphol.plo@gmail.com"
              className="flex items-center gap-4 rounded-[var(--radius)] border border-[hsl(var(--border))] p-4 transition-colors hover:border-[hsl(var(--muted-foreground)/0.3)]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <Mail className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium">rachaphol.plo@gmail.com</p>
              </div>
            </a>

            <a
              href="tel:+66955546654"
              className="flex items-center gap-4 rounded-[var(--radius)] border border-[hsl(var(--border))] p-4 transition-colors hover:border-[hsl(var(--muted-foreground)/0.3)]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <Phone className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="text-sm font-medium">+66 91 069 6072</p>
              </div>
            </a>

            <div className="flex items-center gap-4 rounded-[var(--radius)] border border-[hsl(var(--border))] p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <MapPin className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="text-sm font-medium">Bangkok, Thailand</p>
              </div>
            </div>

            <div className="rounded-[var(--radius)] border border-[hsl(var(--border))] bg-muted/50 p-4">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
                </span>
                <span className="text-sm font-medium">Available for work</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Open to freelance projects and full-time opportunities.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
