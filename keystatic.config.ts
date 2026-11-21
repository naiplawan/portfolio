import { config } from '@keystatic/core'

/**
 * Content schema for the Keystatic admin at /keystatic. Local files in
 * development; commits to `content/*` branches on GitHub in production.
 */
export default config({
  storage:
    process.env.NODE_ENV === 'development'
      ? { kind: 'local' }
      : { kind: 'github', repo: { owner: 'naiplawan', name: 'portfolio' }, branchPrefix: 'content/' },
  ui: { brand: { name: 'Portfolio content' } },
})
