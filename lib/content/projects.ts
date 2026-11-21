import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { z } from 'zod'
import { projectSchema } from './schemas'

const DIRECTORY = path.join(process.cwd(), 'content', 'projects')

/**
 * Curated projects from the Keystatic collection in `content/projects/`, one
 * JSON file per slug, sorted by their `order` field. Server-only (reads files).
 */
export const PROJECTS = readdirSync(DIRECTORY)
  .filter((file) => file.endsWith('.json'))
  .map((file) => {
    const result = projectSchema.safeParse(JSON.parse(readFileSync(path.join(DIRECTORY, file), 'utf8')))
    if (!result.success) throw new Error(`content/projects/${file}\n${z.prettifyError(result.error)}`)
    return { slug: file.slice(0, -'.json'.length), ...result.data }
  })
  .sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug))
