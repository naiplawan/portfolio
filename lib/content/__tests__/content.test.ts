// @vitest-environment node
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { createReader } from '@keystatic/core/reader'
import { describe, expect, it } from 'vitest'
import config from '@/keystatic.config'
import { pageSeo } from '@/lib/seo'
import { SEO_PAGE_PATHS, faqSchema, seoSchema, siteSchema } from '../schemas'

const root = path.resolve(__dirname, '../../..')
const reader = createReader(root, config)
const readJson = (name: string) => JSON.parse(readFileSync(path.join(root, 'content', `${name}.json`), 'utf8'))

const singletons = {
  site: siteSchema,
  seo: seoSchema,
  faq: faqSchema,
} as const

describe('content', () => {
  it.each(Object.entries(singletons))('%s passes the site schema and matches what Keystatic reads', async (name, schema) => {
    const file = readJson(name)
    expect(() => schema.parse(file)).not.toThrow()
    // readOrThrow validates against the Keystatic schema; equality catches the two schemas drifting apart
    const keystatic = await reader.singletons[name as keyof typeof singletons].readOrThrow()
    expect(keystatic).toEqual(file)
  })

  it('has every Keystatic singleton covered by a site schema', () => {
    expect(Object.keys(config.singletons ?? {}).sort()).toEqual(Object.keys(singletons).sort())
  })

  it.each(SEO_PAGE_PATHS)('builds metadata for %s', (pagePath) => {
    const metadata = pageSeo(pagePath)
    expect(metadata.alternates?.canonical).toBe(pagePath)
    expect(metadata.description).toBeTruthy()
  })
})
