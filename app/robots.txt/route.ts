import { SITE_URL } from '@/lib/constants';

/**
 * Search engines and AI answer engines are welcome everywhere except the API.
 * AI crawlers are listed explicitly so the opt-in is unambiguous (GEO); all
 * user agents in one group share the same rules (RFC 9309).
 */
const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'Bingbot',
  'Googlebot',
];

export function GET() {
  const robotsContent = `User-agent: *
${AI_CRAWLERS.map((bot) => `User-agent: ${bot}`).join('\n')}
Allow: /
Disallow: /api/

Sitemap: ${SITE_URL}/sitemap.xml
`;

  return new Response(robotsContent, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
