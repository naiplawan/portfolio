'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { contactFormLimiter, formatTimeRemaining } from '@/lib/utils/rate-limit';
import { trackContactFormSubmit } from '@/components/analytics';

export default function ContactPage() {
  const form = useRef<HTMLFormElement>(null);
  const [senderEmail, setSenderEmail] = useState('');
  const [senderName, setSenderName] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Spam prevention
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<{ email?: string; message?: string; name?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string; message?: string; name?: string } = {};

    // Name validation
    if (!senderName.trim()) {
      newErrors.name = 'Please enter your name';
    } else if (senderName.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!senderEmail.trim()) {
      newErrors.email = 'Please enter your email';
    } else if (!emailRegex.test(senderEmail)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Message validation
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

    // Honeypot check - if filled, it's likely a bot
    if (honeypot) {
      console.log('Spam detected');
      return;
    }

    // Rate limiting check
    const rateLimitCheck = contactFormLimiter.check();
    if (!rateLimitCheck.allowed) {
      setStatus('error');
      setErrors({
        email: `Too many attempts. Please try again in ${formatTimeRemaining(rateLimitCheck.resetIn)}.`,
      });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setStatus('idle');

    if (!form.current) return;

    emailjs
      .sendForm('service_3wygx3u', 'template_p6wyyhb', form.current, 'BG8fz_8Cxun8YIhHv')
      .then(
        (result) => {
          console.log('Email sent successfully:', result.text);
          setStatus('success');
          contactFormLimiter.increment(); // Increment rate limit counter
          trackContactFormSubmit(true); // Track success
          // Clear form after successful submission
          setSenderEmail('');
          setSenderName('');
          setMessage('');
          setErrors({});
        },
        (error) => {
          console.error('Email send failed:', error.text);
          setStatus('error');
          trackContactFormSubmit(false); // Track error
        }
      )
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white pt-14 px-6 lg:px-8">
      <div className="py-16">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <Image src="/assets/8690678_3969584.svg" alt="Contact" width={500} height={400} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-2xl mx-auto w-full"
        >
          <Card className="shadow-2xl">
            <div className="text-center p-6 pb-0">
              <CardTitle className="text-2xl mb-4">Get In Touch</CardTitle>
              <p className="text-gray-700 dark:text-gray-300">
                Please contact me directly at{' '}
                <a className="underline hover:text-blue-600 transition-colors" href="mailto:rachaphol.plo@gmail.com">
                  rachaphol.plo@gmail.com
                </a>{' '}
                or through this form.
              </p>
            </div>
            <CardContent>
              {status === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-300 rounded-md"
                >
                  ✅ Message sent successfully! Thank you for reaching out.
                </motion.div>
              )}
              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded-md"
                >
                  ❌ Failed to send message. Please try again or contact me directly.
                </motion.div>
              )}
              <form ref={form} onSubmit={handleSubmit} className="space-y-6">
                {/* Honeypot field (hidden from users) */}
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

                <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                  <Input
                    name="senderName"
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    maxLength={100}
                    placeholder="Your name"
                    className={`h-12 ${errors.name ? 'border-red-500' : ''}`}
                    disabled={isLoading}
                    aria-label="Your name"
                    aria-invalid={!!errors.name}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                  <Input
                    name="senderEmail"
                    type="email"
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    maxLength={500}
                    placeholder="Your email"
                    className={`h-12 ${errors.email ? 'border-red-500' : ''}`}
                    disabled={isLoading}
                    aria-label="Your email address"
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                  <Textarea
                    name="message"
                    placeholder="Your message"
                    maxLength={5000}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className={`min-h-[150px] resize-none ${errors.message ? 'border-red-500' : ''}`}
                    disabled={isLoading}
                    aria-label="Your message"
                    aria-invalid={!!errors.message}
                  />
                  {errors.message && (
                    <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">{message.length}/5000 characters</p>
                </motion.div>

                <motion.div className="flex justify-center" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full sm:w-1/2 h-12 text-lg rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50"
                    aria-label="Send message"
                  >
                    {isLoading ? 'Sending...' : 'Send Message'}
                  </Button>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
