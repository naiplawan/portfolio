'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Mail, Phone, MapPin, Send, Github, Linkedin, CheckCircle, Check } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface ValidationErrors {
  name?: string
  email?: string
  message?: string
}

export default function ContactSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [touched, setTouched] = useState({ name: false, email: false, message: false })

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'name':
        if (value.length < 2) return 'Name must be at least 2 characters'
        return undefined
      case 'email': {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) return 'Please enter a valid email address'
        return undefined
      }
      case 'message':
        if (value.length < 10) return 'Message must be at least 10 characters'
        return undefined
      default:
        return undefined
    }
  }

  const handleBlur = (field: keyof typeof formData) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    const error = validateField(field, formData[field])
    setErrors(prev => ({ ...prev, [field]: error }))
  }

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (touched[field]) {
      const error = validateField(field, value)
      setErrors(prev => ({ ...prev, [field]: error }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: ValidationErrors = {}
    let hasError = false

    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key, value)
      if (error) {
        newErrors[key as keyof ValidationErrors] = error
        hasError = true
      }
    })

    setErrors(newErrors)
    setTouched({ name: true, email: true, message: true })

    if (hasError) return

    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setIsSubmitted(true)

    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({ name: '', email: '', message: '' })
      setTouched({ name: false, email: false, message: false })
    }, 3000)
  }

  const getFieldState = (field: keyof typeof formData) => {
    if (touched[field] && errors[field]) return 'error'
    if (touched[field] && !errors[field] && formData[field]) return 'success'
    return 'default'
  }

  return (
    <section ref={ref} id="contact" className="section-padding border-t border-[hsl(var(--rule))]">
      <div className="container-premium">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="section-label mb-3">Contact</p>
          <h2 className="font-display text-3xl sm:text-4xl tracking-tight">
            Get in touch
          </h2>
          <p className="mt-4 max-w-lg text-muted-foreground">
            Have a project in mind? I'd love to hear about it. Drop me a message
            and I'll get back to you.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-3"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className={cn(
                    getFieldState('name') === 'error' && 'text-destructive',
                  )}>
                    Name
                  </Label>
                  <div className="relative">
                    <Input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      onBlur={() => handleBlur('name')}
                      placeholder="Your name"
                      className={cn(
                        'pr-10',
                        getFieldState('name') === 'error' && 'border-destructive',
                        getFieldState('name') === 'success' && 'border-green-500',
                      )}
                    />
                    {getFieldState('name') === 'success' && (
                      <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                    )}
                  </div>
                  {touched.name && errors.name && (
                    <p className="text-xs text-destructive">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className={cn(
                    getFieldState('email') === 'error' && 'text-destructive',
                  )}>
                    Email
                  </Label>
                  <div className="relative">
                    <Input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      onBlur={() => handleBlur('email')}
                      placeholder="you@example.com"
                      className={cn(
                        'pr-10',
                        getFieldState('email') === 'error' && 'border-destructive',
                        getFieldState('email') === 'success' && 'border-green-500',
                      )}
                    />
                    {getFieldState('email') === 'success' && (
                      <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                    )}
                  </div>
                  {touched.email && errors.email && (
                    <p className="text-xs text-destructive">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className={cn(
                  getFieldState('message') === 'error' && 'text-destructive',
                )}>
                  Message
                </Label>
                <Textarea
                  id="message"
                  required
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  onBlur={() => handleBlur('message')}
                  rows={5}
                  placeholder="Tell me about your project..."
                  className={cn(
                    'resize-none',
                    getFieldState('message') === 'error' && 'border-destructive',
                    getFieldState('message') === 'success' && 'border-green-500',
                  )}
                />
                {touched.message && errors.message && (
                  <p className="text-xs text-destructive">{errors.message}</p>
                )}
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting || isSubmitted}
                className="w-full sm:w-auto min-w-[160px]"
              >
                {isSubmitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Sending...
                  </>
                ) : isSubmitted ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Sent!
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
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Contact Methods */}
            <div className="space-y-4">
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
                  <p className="text-sm font-medium">+66 95 554 6654</p>
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
            </div>

            {/* Socials */}
            <div>
              <p className="text-xs text-muted-foreground mb-3">Find me on</p>
              <div className="flex gap-3">
                <a
                  href="https://github.com/naiplawan"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[hsl(var(--border))] transition-colors hover:bg-foreground hover:text-background hover:border-foreground"
                >
                  <Github className="h-4 w-4" />
                </a>
                <a
                  href="https://linkedin.com/in/rachaphol-plookaom"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[hsl(var(--border))] transition-colors hover:bg-foreground hover:text-background hover:border-foreground"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Availability */}
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
    </section>
  )
}
