'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { contactFormLimiter, formatTimeRemaining } from '@/lib/utils/rate-limit';
import { trackContactFormSubmit } from '@/components/analytics';
import { Send, CheckCircle } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { SOCIAL_LINKS } from '@/lib/constants';

const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '';
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';
const EMAILJS_CONFIG_READY = Boolean(EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY);

const directChannels = [
  { label: 'Email', value: SOCIAL_LINKS.email, href: `mailto:${SOCIAL_LINKS.email}` },
  { label: 'Phone', value: '+66 91 069 6072', href: 'tel:+66910696072' },
  { label: 'Location', value: 'Bangkok, Thailand', href: undefined },
] as const;

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
  const [configReady] = useState(EMAILJS_CONFIG_READY);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const subject = new URLSearchParams(window.location.search).get('subject');
      if (subject) {
        setMessage((currentMessage) => currentMessage || `${subject}\n\n`);
      }
    }, 0);

    return () => window.clearTimeout(timer);
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
    <div className="container-premium section-padding">
      <SectionHeading as="h1" label="Contact" title="Tell me what you're building">
        Who it&apos;s for, where you&apos;re stuck, and when you need it. I usually
        reply within 24 hours.
      </SectionHeading>

      <div className="grid gap-16 lg:grid-cols-[3fr_2fr] lg:gap-20">
        <div>
          {!configReady && (
            <p role="status" className="mb-8 border-l-2 border-destructive pl-4 text-sm text-destructive">
              The contact form isn&apos;t configured. Please email{' '}
              <a className="ed-link" href={`mailto:${SOCIAL_LINKS.email}`}>
                {SOCIAL_LINKS.email}
              </a>{' '}
              directly.
            </p>
          )}

          {status === 'success' && (
            <p role="status" className="mb-8 flex items-center gap-2 border-l-2 border-success pl-4 text-sm text-success">
              <CheckCircle className="h-4 w-4" />
              Message sent. Thank you for reaching out.
            </p>
          )}

          {status === 'error' && (
            <p role="alert" className="mb-8 border-l-2 border-destructive pl-4 text-sm text-destructive">
              The message couldn&apos;t be sent. Please try again or email me directly.
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
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

            <div className="grid gap-8 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="name" className="section-label">Name</label>
                <Input
                  id="name"
                  name="senderName"
                  type="text"
                  autoComplete="name"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  maxLength={100}
                  placeholder="Your name"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  className={`h-12 text-base ${errors.name ? 'border-destructive' : ''}`}
                  disabled={isLoading}
                />
                {errors.name && <p id="name-error" className="text-sm text-destructive">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="section-label">Email</label>
                <Input
                  id="email"
                  name="senderEmail"
                  type="email"
                  autoComplete="email"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  maxLength={500}
                  placeholder="you@example.com"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  className={`h-12 text-base ${errors.email ? 'border-destructive' : ''}`}
                  disabled={isLoading}
                />
                {errors.email && <p id="email-error" className="text-sm text-destructive">{errors.email}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <label htmlFor="message" className="section-label">Message</label>
                <span className="mono-tag">{message.length}/5000</span>
              </div>
              <Textarea
                id="message"
                name="message"
                placeholder="Tell me about your project…"
                maxLength={5000}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? 'message-error' : undefined}
                className={`min-h-[180px] resize-y text-base ${errors.message ? 'border-destructive' : ''}`}
                disabled={isLoading}
              />
              {errors.message && <p id="message-error" className="text-sm text-destructive">{errors.message}</p>}
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={isLoading || !configReady}
              className="w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Sending…
                </>
              ) : (
                <>
                  Send message
                  <Send className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </div>

        <aside>
          <dl className="border-t border-[hsl(var(--rule))]">
            {directChannels.map(({ label, value, href }) => (
              <div key={label} className="border-b border-[hsl(var(--rule))] py-5">
                <dt className="section-label mb-1">{label}</dt>
                <dd className="text-lg">
                  {href ? (
                    <a href={href} className="ed-link break-all">{value}</a>
                  ) : (
                    value
                  )}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-sm text-muted-foreground">
            Open to freelance projects and full-time opportunities.
          </p>
        </aside>
      </div>
    </div>
  );
}
