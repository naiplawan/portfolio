import { z } from 'zod'

/**
 * Runtime schemas for the JSON files in `content/`. They are the single source
 * of validation rules: the admin checks edits with them, the build parses
 * content with them, and `pnpm content:schemas` exports them as JSON Schemas
 * for the Go content API. Parsing happens at import time, so invalid
 * content fails the build and the test suite rather than rendering broken pages.
 */

/** Routes whose title and description are edited under SEO → Pages. */
export const SEO_PAGE_PATHS = ['/about', '/projects', '/services', '/booking', '/contact'] as const
export type SeoPagePath = (typeof SEO_PAGE_PATHS)[number]

const text = z.string().trim().min(1)

export const siteSchema = z.object({
  name: text,
  jobTitle: text,
  company: text,
  location: text,
  email: z.email(),
  github: z.url(),
  linkedin: z.url(),
  facebook: z.url(),
})

export const seoSchema = z.object({
  personSummary: text.max(320),
  homeTitle: text,
  defaultTitle: text,
  defaultDescription: text,
  socialDescription: text,
  keywords: z.array(text),
  knowsAbout: z.array(text).min(1),
  manifestDescription: text,
  pages: z
    .array(z.object({ path: z.enum(SEO_PAGE_PATHS), title: text, description: text.max(200) }))
    .refine((pages) => SEO_PAGE_PATHS.every((path) => pages.filter((page) => page.path === path).length === 1), {
      message: `SEO → Pages needs exactly one entry for each of ${SEO_PAGE_PATHS.join(', ')}`,
    }),
})

export const faqSchema = z.object({
  items: z
    .array(
      z
        .object({ question: text, usePersonSummary: z.boolean(), answer: z.string() })
        .refine((item) => item.usePersonSummary || item.answer.trim().length > 0, {
          message: 'An FAQ answer is required unless it uses the person summary',
        })
    )
    .min(1),
})

export const PROJECT_CATEGORIES = [
  'web', 'fullstack', 'mobile', 'backend', 'ai', 'enterprise', 'wellness', 'gaming', 'tools', 'other',
] as const
export const PROJECT_STATUSES = ['live', 'development', 'archived'] as const

/** An empty optional URL may be omitted or `null`; the site treats it as absent. */
const optionalUrl = z
  .url()
  .nullish()
  .transform((value) => value ?? undefined)

/** A conditional field's empty branch may have `value: null` or no `value`. */
const emptyValue = z.null().optional()

const caseStudySchema = z.discriminatedUnion('discriminant', [
  z.object({ discriminant: z.literal(false), value: emptyValue }),
  z.object({
    discriminant: z.literal(true),
    value: z.object({
      contribution: text,
      designDecision: text,
      outcome: text,
      screenshotAlt: text,
      screenshotCaption: text,
      screenshotWidth: z.number().int().positive(),
      screenshotHeight: z.number().int().positive(),
    }),
  }),
])

/** One file in `content/projects/`; the file name is the slug. */
export const projectSchema = z.object({
  title: text,
  order: z.number().int(),
  notes: z.string(),
  githubRepoId: z.number().int().positive(),
  githubUrl: z.url(),
  liveUrl: optionalUrl,
  description: text,
  problemStatement: text,
  solution: text,
  image: z.string().regex(/^\/assets\/projects\/[a-z0-9-]+\/image\.(png|jpe?g|webp|avif)$/),
  technologies: z.array(text),
  highlights: z.array(text),
  category: z.enum(PROJECT_CATEGORIES),
  status: z.enum(PROJECT_STATUSES),
  completedYear: z.number().int().min(2000).max(2100),
  caseStudy: caseStudySchema,
})

const liveUrlOverrideSchema = z.discriminatedUnion('discriminant', [
  z.object({ discriminant: z.literal('keep'), value: emptyValue }),
  z.object({ discriminant: z.literal('replace'), value: z.url() }),
  z.object({ discriminant: z.literal('remove'), value: emptyValue }),
])

export const projectOverridesSchema = z.object({
  notes: z.string(),
  items: z.array(
    z.object({
      repo: z.string().regex(/^[a-z0-9._-]+$/, 'Use the lowercase GitHub repository name'),
      title: z.string(),
      description: z.string(),
      liveUrl: liveUrlOverrideSchema,
    })
  ),
})

export const TIMELINE_TYPES = ['work', 'education', 'achievement', 'project'] as const

const yearMonth = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Use YYYY-MM')
const titled = z.array(z.object({ title: text, description: text }))

export const homeSchema = z.object({
  headline: z.array(z.object({ word: text, accent: z.boolean() })).min(1),
  lead: text,
  detail: text,
  config: z.array(z.object({ key: text, value: text.max(60) })),
  capabilities: z.array(z.object({ name: text, tools: text, evidence: text, href: text, link: text })),
  aboutParagraphs: z.array(text).min(1),
})

export const aboutSchema = z.object({
  paragraphs: z.array(text).min(1),
  capabilities: titled,
})

export const timelineSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string().regex(/^[a-z0-9-]+$/),
        type: z.enum(TIMELINE_TYPES),
        title: text,
        organization: text,
        location: z.string(),
        date: yearMonth,
        endDate: yearMonth.or(z.literal('')),
        description: text,
        highlights: z.array(text),
        technologies: z.array(text),
        commit: z.object({ hash: text, message: text, world: text }),
      })
    )
    .min(1)
    .refine((items) => new Set(items.map((item) => item.id)).size === items.length, {
      message: 'Timeline anchor ids must be unique',
    }),
})

export const servicesSchema = z.object({
  offers: z.array(
    z.object({
      title: text,
      suitableFor: text,
      deliverable: text,
      features: z.array(text),
      exampleName: text,
      exampleHref: text,
    })
  ),
  process: titled,
})

export const bookingSchema = z.object({
  timeSlots: z.array(z.object({ time: text, type: text, description: text })),
  topics: titled,
  preparation: titled,
})

/**
 * Every single-file content document, keyed by its name in `content/<name>.json`
 * and in the content API (`/api/content/<name>`). Projects are separate.
 */
export const CONTENT_DOCUMENTS = {
  site: siteSchema,
  seo: seoSchema,
  faq: faqSchema,
  home: homeSchema,
  about: aboutSchema,
  timeline: timelineSchema,
  services: servicesSchema,
  booking: bookingSchema,
  'project-overrides': projectOverridesSchema,
} as const
export type ContentDocumentName = keyof typeof CONTENT_DOCUMENTS
