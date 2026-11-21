// @vitest-environment node
import { readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { createReader } from '@keystatic/core/reader'
import { imageSize } from 'image-size'
import { describe, expect, it } from 'vitest'
import config from '@/keystatic.config'
import { pageSeo } from '@/lib/seo'
import { HOME, SERVICES, TIMELINE } from '..'
import { PROJECTS } from '../projects'
import {
  SEO_PAGE_PATHS,
  aboutSchema,
  bookingSchema,
  faqSchema,
  homeSchema,
  projectOverridesSchema,
  projectSchema,
  seoSchema,
  servicesSchema,
  siteSchema,
  timelineSchema,
} from '../schemas'

const root = path.resolve(__dirname, '../../..')
const reader = createReader(root, config)
const readJson = (file: string) => JSON.parse(readFileSync(path.join(root, 'content', file), 'utf8'))

const singletons = {
  site: siteSchema,
  seo: seoSchema,
  faq: faqSchema,
  projectOverrides: projectOverridesSchema,
  home: homeSchema,
  about: aboutSchema,
  timeline: timelineSchema,
  services: servicesSchema,
  booking: bookingSchema,
} as const
type SingletonKey = keyof typeof singletons

/** Keystatic omits empty optional values on save but reads them back as `null`. */
const withoutNulls = (value: unknown): unknown =>
  Array.isArray(value)
    ? value.map(withoutNulls)
    : value && typeof value === 'object'
      ? Object.fromEntries(
          Object.entries(value)
            .filter(([, entry]) => entry !== null)
            .map(([key, entry]) => [key, withoutNulls(entry)])
        )
      : value

/** Keystatic file name for each singleton key. */
const fileName = (key: string) => `${key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}.json`

/** Large screenshots slow the home page; resize before uploading. */
const MAX_IMAGE_BYTES = 600 * 1024

describe('content', () => {
  it.each(Object.keys(singletons) as SingletonKey[])(
    '%s passes the site schema and matches what Keystatic reads',
    async (key) => {
      const file = readJson(fileName(key))
      expect(() => singletons[key].parse(file)).not.toThrow()
      // readOrThrow validates against the Keystatic schema; equality catches the two schemas drifting apart
      expect(withoutNulls(await reader.singletons[key].readOrThrow())).toEqual(withoutNulls(file))
    }
  )

  it('covers every Keystatic singleton and collection', () => {
    expect(Object.keys(config.singletons ?? {}).sort()).toEqual(Object.keys(singletons).sort())
    expect(Object.keys(config.collections ?? {})).toEqual(['projects'])
  })

  it.each(SEO_PAGE_PATHS)('builds metadata for %s', (pagePath) => {
    const metadata = pageSeo(pagePath)
    expect(metadata.alternates?.canonical).toBe(pagePath)
    expect(metadata.description).toBeTruthy()
  })

  const internalLinks = [
    ...HOME.capabilities.map(({ name, href }) => [`home capability "${name}"`, href] as const),
    ...SERVICES.offers.map(({ title, exampleHref }) => [`service "${title}"`, exampleHref] as const),
  ]

  it.each(internalLinks)('%s links to something that exists (%s)', (_label, href) => {
    const caseStudy = href.match(/^\/?#project-(.+)$/)
    const timelineEntry = href.match(/^\/about#(.+)$/)
    if (caseStudy) {
      const slugs = PROJECTS.filter((project) => project.caseStudy.discriminant).map((project) => project.slug)
      expect(slugs).toContain(caseStudy[1])
    } else if (timelineEntry) {
      expect(TIMELINE.items.map((item) => item.id)).toContain(timelineEntry[1])
    } else {
      expect(href).toMatch(/^(\/[\w/-]*|https:\/\/\S+)$/)
    }
  })

  it('loads every project file', async () => {
    expect((await reader.collections.projects.list()).sort()).toEqual(PROJECTS.map((project) => project.slug).sort())
  })

  describe.each(PROJECTS.map((project) => [project.slug, project] as const))('project %s', (slug, project) => {
    const file = path.join(root, 'public', project.image)

    it('passes the site schema and matches what Keystatic reads', async () => {
      const json = readJson(`projects/${slug}.json`)
      expect(() => projectSchema.parse(json)).not.toThrow()
      expect(withoutNulls(await reader.collections.projects.readOrThrow(slug))).toEqual(withoutNulls(json))
    })

    it('keeps its screenshot in the folder Keystatic uses for the slug', () => {
      expect(path.dirname(project.image)).toBe(`/assets/projects/${slug}`)
    })

    it('has a screenshot under the size budget', () => {
      expect(statSync(file).size).toBeLessThanOrEqual(MAX_IMAGE_BYTES)
    })

    it.runIf(project.caseStudy.discriminant)('declares the real screenshot dimensions', () => {
      if (!project.caseStudy.discriminant) return
      const { width, height } = imageSize(readFileSync(file))
      expect({ width, height }).toEqual({
        width: project.caseStudy.value.screenshotWidth,
        height: project.caseStudy.value.screenshotHeight,
      })
    })
  })
})
