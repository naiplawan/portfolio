/**
 * The Keystatic admin runs in local mode during `next dev` and in GitHub mode
 * in production. Without the GitHub App credentials, production serves 404 for
 * the admin and its API instead of failing the build or exposing local writes.
 */
export const KEYSTATIC_ENABLED =
  process.env.NODE_ENV === 'development' ||
  Boolean(
    process.env.KEYSTATIC_GITHUB_CLIENT_ID &&
      process.env.KEYSTATIC_GITHUB_CLIENT_SECRET &&
      process.env.KEYSTATIC_SECRET &&
      process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG
  )
