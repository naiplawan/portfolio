import { makeRouteHandler } from '@keystatic/next/route-handler'
import { KEYSTATIC_ENABLED } from '@/lib/content/admin'
import config from '../../../../keystatic.config'

const notFound = () => new Response('Not Found', { status: 404 })

export const { GET, POST } = KEYSTATIC_ENABLED
  ? makeRouteHandler({ config })
  : { GET: notFound, POST: notFound }
