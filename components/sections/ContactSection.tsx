'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Mail, Phone, MapPin, Send, Github, Linkedin, Twitter, CheckCircle, AlertCircle, Check } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ContactMethod {
  icon: React.ReactNode
  label: string
  value: string
  href: string
  color: string
}

const contactMethods: ContactMethod[] = [
  {
    icon: <Mail className="w-5 h-5" />,
    label: 'Email',
    value: 'rachaphol.plo@gmail.com',
    href: 'mailto:rachaphol.plo@gmail.com',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    icon: <Phone className="w-5 h-5" />,
    label: 'Phone',
    value: '+66 95 554 6654',
    href: 'tel:+66955546654',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    icon: <MapPin className="w-5 h-5" />,
    label: 'Location',
    value: 'Bangkok, Thailand',
    href: 'https://maps.google.com/?q=Bangkok,Thailand',
    color: 'from-violet-500 to-purple-600',
  },
]

interface SocialLink {
  icon: React.ReactNode
  label: string
  href: string
  color: string
}

const socialLinks: SocialLink[] = [
  {
    icon: <Github className="w-5 h-5" />,
    label: 'GitHub',
    href: 'https://github.com/naiplawan',
    color: 'hover:bg-gray-800 dark:hover:bg-white/20',
  },
  {
    icon: <Linkedin className="w-5 h-5" />,
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/rachaphol-plookaom',
    color: 'hover:bg-blue-600 dark:hover:bg-blue-500/20',
  },
  {
    icon: <Twitter className="w-5 h-5" />,
    label: 'Twitter',
    href: 'https://twitter.com/rachaphol',
    color: 'hover:bg-sky-500 dark:hover:bg-sky-500/20',
  },
]

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
        if (value.length < 2) {
          return 'Name must be at least 2 characters'
        }
        return undefined
      case 'email': {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) {
          return 'Please enter a valid email address'
        }
        return undefined
      }
      case 'message':
        if (value.length < 10) {
          return 'Message must be at least 10 characters'
        }
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
    // Clear error when user starts typing
    if (touched[field]) {
      const error = validateField(field, value)
      setErrors(prev => ({ ...prev, [field]: error }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all fields
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

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSubmitted(true)

    // Reset after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({ name: '', email: '', message: '' })
      setTouched({ name: false, email: false, message: false })
    }, 3000)
  }

  const getFieldState = (field: keyof typeof formData) => {
    if (touched[field] && errors[field]) {
      return 'error'
    }
    if (touched[field] && !errors[field] && formData[field]) {
      return 'success'
    }
    return 'default'
  }

  return (
    <section ref={ref} className="relative py-20 lg:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.01]" style={{
        backgroundImage: `
          linear-gradient(to right, currentColor 1px, transparent 1px),
          linear-gradient(to bottom, currentColor 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
      }} />

      {/* Gradient Orbs */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px]" />

      <div className="container-premium relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="bio-badge text-sm mb-4">Get In Touch</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-4">
            Let's <span className="bio-gradient-text">Connect</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have a project in mind or want to discuss opportunities? I'd love to hear from you.
            Drop me a message and I'll get back to you as soon as possible.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-display">Send a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className={cn(
                      getFieldState('name') === 'error' && 'text-destructive',
                      getFieldState('name') === 'success' && 'text-emerald-600'
                    )}>
                      Your Name
                    </Label>
                    <div className="relative">
                      <Input
                        type="text"
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        onBlur={() => handleBlur('name')}
                        placeholder="John Doe"
                        className={cn(
                          'pr-10 transition-colors',
                          getFieldState('name') === 'error' && 'border-destructive focus:border-destructive',
                          getFieldState('name') === 'success' && 'border-emerald-500 focus:border-emerald-500'
                        )}
                      />
                      {getFieldState('name') === 'success' && (
                        <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                      )}
                      {getFieldState('name') === 'error' && (
                        <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-destructive" />
                      )}
                    </div>
                    {touched.name && errors.name && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className={cn(
                      getFieldState('email') === 'error' && 'text-destructive',
                      getFieldState('email') === 'success' && 'text-emerald-600'
                    )}>
                      Email Address
                    </Label>
                    <div className="relative">
                      <Input
                        type="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        onBlur={() => handleBlur('email')}
                        placeholder="john@example.com"
                        className={cn(
                          'pr-10 transition-colors',
                          getFieldState('email') === 'error' && 'border-destructive focus:border-destructive',
                          getFieldState('email') === 'success' && 'border-emerald-500 focus:border-emerald-500'
                        )}
                      />
                      {getFieldState('email') === 'success' && (
                        <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                      )}
                      {getFieldState('email') === 'error' && (
                        <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-destructive" />
                      )}
                    </div>
                    {touched.email && errors.email && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className={cn(
                      getFieldState('message') === 'error' && 'text-destructive',
                      getFieldState('message') === 'success' && 'text-emerald-600'
                    )}>
                      Your Message
                    </Label>
                    <div className="relative">
                      <Textarea
                        id="message"
                        required
                        value={formData.message}
                        onChange={(e) => handleChange('message', e.target.value)}
                        onBlur={() => handleBlur('message')}
                        rows={5}
                        placeholder="Tell me about your project or opportunity..."
                        className={cn(
                          'resize-none pr-10 transition-colors',
                          getFieldState('message') === 'error' && 'border-destructive focus:border-destructive',
                          getFieldState('message') === 'success' && 'border-emerald-500 focus:border-emerald-500'
                        )}
                      />
                      {getFieldState('message') === 'success' && (
                        <Check className="absolute right-3 top-3 w-4 h-4 text-emerald-500" />
                      )}
                      {getFieldState('message') === 'error' && (
                        <AlertCircle className="absolute right-3 top-3 w-4 h-4 text-destructive" />
                      )}
                    </div>
                    {touched.message && errors.message && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.message}
                      </p>
                    )}
                    <p className={cn(
                      'text-xs transition-colors',
                      getFieldState('message') === 'success' ? 'text-emerald-600' : 'text-muted-foreground'
                    )}>
                      {formData.message.length}/10 characters minimum
                    </p>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting || isSubmitted}
                    className="w-full"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : isSubmitted ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        <span>Message Sent!</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Contact Methods */}
            <div className="space-y-4">
              {contactMethods.map((method, index) => (
                <motion.a
                  key={method.label}
                  href={method.href}
                  target={method.label === 'Location' ? '_blank' : undefined}
                  rel={method.label === 'Location' ? 'noopener noreferrer' : undefined}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="block"
                >
                  <div className="bio-glass-card p-5 rounded-xl transition-all duration-300 hover:scale-[1.02]">
                    <div className="flex items-center gap-4">
                      <div className={cn('w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-white', method.color)}>
                        {method.icon}
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
                          {method.label}
                        </div>
                        <div className="font-medium">{method.value}</div>
                      </div>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Social Links */}
            <div className="bio-glass-card p-6 rounded-2xl">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                Connect on Social
              </h4>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className={cn(
                      'w-12 h-12 rounded-xl bg-muted flex items-center justify-center transition-all duration-300',
                      social.color
                    )}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Availability Badge */}
            <div className="bio-glass-card p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent">
              <div className="flex items-start gap-4">
                <div className="relative flex h-3 w-3 mt-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </div>
                <div>
                  <div className="font-semibold mb-1">Available for Work</div>
                  <p className="text-sm text-muted-foreground">
                    I'm currently open to freelance projects and full-time opportunities.
                    Let's discuss how I can help bring your ideas to life.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
