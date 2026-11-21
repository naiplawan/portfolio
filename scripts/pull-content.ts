import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { z } from 'zod'
import { CONTENT_DOCUMENTS, projectSchema } from '../lib/content/schemas'

/**
 * Runs before `next build`. With CONTENT_API_URL set (Vercel), it replaces
 * content/ with the content API's data so the site builds from Postgres. Any
 * failure fails the build, which keeps the previous deployment live instead of
 * publishing stale content. Without CONTENT_API_URL (CI, local), the committed
 * content/ files are used as they are. Run it locally to snapshot the database
 * into the repository: CONTENT_API_URL=https://… pnpm content:pull
 */
const bundleSchema = z.object({
  documents: z.record(z.string(), z.unknown()),
  projects: z.array(z.object({ slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/), data: z.unknown() })),
})

const json = (value: unknown) => `${JSON.stringify(value, null, 2)}\n`

async function main() {
  const base = process.env.CONTENT_API_URL?.replace(/\/+$/, '')
  if (!base) {
    console.log('content: CONTENT_API_URL is not set; building from the committed content/ files')
    return
  }

  const response = await fetch(`${base}/api/content`, { signal: AbortSignal.timeout(20_000) })
  if (!response.ok) throw new Error(`GET ${base}/api/content returned ${response.status}`)
  const bundle = bundleSchema.parse(await response.json())

  const files = new Map<string, string>()
  for (const [name, schema] of Object.entries(CONTENT_DOCUMENTS)) {
    if (!(name in bundle.documents)) throw new Error(`The content API has no "${name}" document; run the seed`)
    const result = schema.safeParse(bundle.documents[name])
    if (!result.success) throw new Error(`content/${name}.json from the API is invalid\n${z.prettifyError(result.error)}`)
    files.set(`${name}.json`, json(bundle.documents[name]))
  }
  if (bundle.projects.length === 0) throw new Error('The content API has no projects; run the seed')
  for (const { slug, data } of bundle.projects) {
    const result = projectSchema.safeParse(data)
    if (!result.success) throw new Error(`Project "${slug}" from the API is invalid\n${z.prettifyError(result.error)}`)
    // Screenshots are deployed with the site; a missing file would render a broken image
    if (!existsSync(path.join('public', result.data.image))) {
      throw new Error(`Project "${slug}" uses ${result.data.image}, which is not in public/`)
    }
    files.set(`projects/${slug}.json`, json(data))
  }

  mkdirSync('content/projects', { recursive: true })
  for (const file of readdirSync('content/projects')) {
    if (file.endsWith('.json') && !files.has(`projects/${file}`)) rmSync(path.join('content/projects', file))
  }
  for (const [file, text] of files) writeFileSync(path.join('content', file), text)
  console.log(`content: pulled ${Object.keys(CONTENT_DOCUMENTS).length} documents and ${bundle.projects.length} projects from ${base}`)
}

main().catch((error: unknown) => {
  console.error(`content: ${error instanceof Error ? error.message : String(error)}`)
  process.exit(1)
})
