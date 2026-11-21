import faqJson from '@/content/faq.json'
import seoJson from '@/content/seo.json'
import siteJson from '@/content/site.json'
import { faqSchema, seoSchema, siteSchema } from './schemas'

/** Validated content edited in the Keystatic admin (`/keystatic`). */
export const SITE = siteSchema.parse(siteJson)
export const SEO = seoSchema.parse(seoJson)
export const FAQ = faqSchema.parse(faqJson)
