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
export const SEO = seoSchema.parse(seoJson)
export const FAQ = faqSchema.parse(faqJson)
export const PROJECT_OVERRIDES = projectOverridesSchema.parse(projectOverridesJson)
export const HOME = homeSchema.parse(homeJson)
export const ABOUT = aboutSchema.parse(aboutJson)
export const TIMELINE = timelineSchema.parse(timelineJson)
export const SERVICES = servicesSchema.parse(servicesJson)
export const BOOKING = bookingSchema.parse(bookingJson)
