import { z } from 'zod'
import { CONTENT_DOCUMENTS, projectSchema } from '../lib/content/schemas'

/**
 * JSON Schemas for the Go content API, generated from the zod schemas so the
 * validation rules live in one place. Objects reject unknown keys at the API.
 * Write them with `pnpm content:schemas`; a test fails when they are stale.
 */
const strict = (node: unknown): unknown => {
  if (Array.isArray(node)) return node.map(strict)
  if (!node || typeof node !== 'object') return node
  const entries = Object.entries(node).map(([key, value]) => [key, strict(value)])
  const object = Object.fromEntries(entries) as Record<string, unknown>
  // zod's email regex uses lookaheads that Go's RE2 cannot compile; `format: email` still applies
  if (object.format === 'email') delete object.pattern
  if (object.type === 'object' && object.properties && !('additionalProperties' in object)) {
    object.additionalProperties = false
  }
  return object
}

export function contentJsonSchemas(): Record<string, string> {
  const schemas = { ...CONTENT_DOCUMENTS, project: projectSchema }
  return Object.fromEntries(
    Object.entries(schemas).map(([name, schema]) => [
      `${name}.json`,
      `${JSON.stringify(strict(z.toJSONSchema(schema, { io: 'input', unrepresentable: 'any' })), null, 2)}\n`,
    ])
  )
}

export const SCHEMA_DIRECTORY = 'backend/internal/content/schemas'

if (process.argv[1]?.endsWith('content-json-schemas.ts')) {
  const { mkdirSync, writeFileSync } = await import('node:fs')
  mkdirSync(SCHEMA_DIRECTORY, { recursive: true })
  for (const [file, json] of Object.entries(contentJsonSchemas())) writeFileSync(`${SCHEMA_DIRECTORY}/${file}`, json)
}
