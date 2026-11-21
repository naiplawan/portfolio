// @vitest-environment node
import { readFileSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'
import { imageSize } from 'image-size'
import { describe, expect, it } from 'vitest'
import { EMPLOYMENT } from '@/lib/constants'
import { pageSeo } from '@/lib/seo'
import { SCHEMA_DIRECTORY, contentJsonSchemas } from '@/scripts/content-json-schemas'
import { ABOUT, FAQ, HOME, SERVICES, SITE_PLACEHOLDERS, TIMELINE } from '..'
import { PROJECTS } from '../projects'
import { CONTENT_DOCUMENTS, SEO_PAGE_PATHS, projectSchema } from '../schemas'

const root = path.resolve(__dirname, '../../..')
const readJson = (file: string) => JSON.parse(readFileSync(path.join(root, 'content', file), 'utf8'))

/** Large screenshots slow the home page; resize before adding them. */
const MAX_IMAGE_BYTES = 600 * 1024

describe('content', () => {
  it('has exactly one file per content document', () => {
    const files = readdirSync(path.join(root, 'content')).filter((file) => file.endsWith('.json'))
    expect(files.map((file) => file.replace(/\.json$/, '')).sort()).toEqual(Object.keys(CONTENT_DOCUMENTS).sort())
  })

  it.each(Object.entries(CONTENT_DOCUMENTS))('%s passes its schema', (name, schema) => {
    expect(() => schema.parse(readJson(`${name}.json`))).not.toThrow()
  })

  it.each(Object.entries(contentJsonSchemas()))('the Go API schema %s matches zod (run pnpm content:schemas)', (file, json) => {
    expect(readFileSync(path.join(root, SCHEMA_DIRECTORY, file), 'utf8')).toBe(json)
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

  it.each(Object.entries({ home: HOME, about: ABOUT, faq: FAQ }))(
    '%s uses only known placeholders',
    (_name, document) => {
      const leftovers = JSON.stringify(document).match(/\{\w+\}/g)
      expect(leftovers, `unknown placeholders; use one of ${Object.keys(SITE_PLACEHOLDERS).map((key) => `{${key}}`).join(', ')}`).toBeNull()
    }
  )

  it('keeps the EMPLOYMENT facts (llms.txt) in line with the career timeline', () => {
    const roles = TIMELINE.items.filter((item) => item.type === 'work')
    for (const job of [EMPLOYMENT.current, EMPLOYMENT.previous]) {
      const entry = roles.find((role) => job.company.startsWith(role.organization))
      expect(entry?.title).toBe(job.title)
    }
  })

  describe.each(PROJECTS.map((project) => [project.slug, project] as const))('project %s', (slug, project) => {
    const file = path.join(root, 'public', project.image)

    it('passes its schema', () => {
      expect(() => projectSchema.parse(readJson(`projects/${slug}.json`))).not.toThrow()
    })

    it('keeps its screenshot in its own folder', () => {
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
