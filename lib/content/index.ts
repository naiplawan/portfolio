import aboutJson from '@/content/about.json'
import bookingJson from '@/content/booking.json'
import faqJson from '@/content/faq.json'
import homeJson from '@/content/home.json'
import projectOverridesJson from '@/content/project-overrides.json'
import seoJson from '@/content/seo.json'
import servicesJson from '@/content/services.json'
import siteJson from '@/content/site.json'
import timelineJson from '@/content/timeline.json'
import {
  aboutSchema,
  bookingSchema,
  faqSchema,
  homeSchema,
  projectOverridesSchema,
  seoSchema,
  servicesSchema,
  siteSchema,
  timelineSchema,
} from './schemas'

/** Validated content (edited at `/admin`, pulled from the content API at build time). Server-only. */
export const SITE = siteSchema.parse(siteJson)

/** Placeholders that prose can use so it follows the Site & contact document. */
export const SITE_PLACEHOLDERS = {
  name: SITE.name,
  jobTitle: SITE.jobTitle,
  company: SITE.company,
  location: SITE.location,
  email: SITE.email,
} as const

/** Replaces `{jobTitle}`-style placeholders in every string of a content document. */
function withSiteFacts<T>(value: T): T {
  if (typeof value === 'string') {
    return value.replace(/\{(\w+)\}/g, (match, key: string) =>
      Object.hasOwn(SITE_PLACEHOLDERS, key) ? SITE_PLACEHOLDERS[key as keyof typeof SITE_PLACEHOLDERS] : match
    ) as T
  }
  if (Array.isArray(value)) return value.map(withSiteFacts) as T
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, withSiteFacts(entry)])) as T
  }
  return value
}

export const SEO = seoSchema.parse(seoJson)
export const FAQ = withSiteFacts(faqSchema.parse(faqJson))
export const PROJECT_OVERRIDES = projectOverridesSchema.parse(projectOverridesJson)
export const HOME = withSiteFacts(homeSchema.parse(homeJson))
export const ABOUT = withSiteFacts(aboutSchema.parse(aboutJson))
export const TIMELINE = timelineSchema.parse(timelineJson)
export const SERVICES = servicesSchema.parse(servicesJson)
export const BOOKING = bookingSchema.parse(bookingJson)
