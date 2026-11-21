import { z } from 'zod'

/**
 * Runtime schemas for the JSON files in `content/`, mirroring the Keystatic
 * schema in `keystatic.config.ts`. Parsing happens at import time, so invalid
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

/** Keystatic omits an empty optional URL (or stores `null`); the site treats it as absent. */
const optionalUrl = z
  .url()
  .nullish()
  .transform((value) => value ?? undefined)

/** Keystatic writes an empty conditional branch with `value: null` or without `value`. */
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
