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
