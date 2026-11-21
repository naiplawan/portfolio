import { collection, config, fields, singleton } from '@keystatic/core'
import { PROJECT_CATEGORIES, PROJECT_STATUSES, SEO_PAGE_PATHS, TIMELINE_TYPES } from './lib/content/schemas'

/**
 * Content schema for the Keystatic admin at /keystatic. Local files in
 * development; commits to `content/*` branches on GitHub in production.
 * Set NEXT_PUBLIC_KEYSTATIC_STORAGE=github to use GitHub mode under `next dev`
 * (needed once to create the GitHub App, and to test the production flow).
 *
 * Every entry is a JSON singleton under `content/`, imported statically and
 * validated by the zod schemas in `lib/content/schemas.ts`. Keep both in sync;
 * `lib/content/__tests__/content.test.ts` fails when they disagree.
 */

const json = { data: 'json' } as const
const yearMonth = { regex: /^\d{4}-(0[1-9]|1[0-2])$/, message: 'Use YYYY-MM' }

const required = { isRequired: true } as const
const textList = (label: string, itemLabel: string) =>
  fields.array(fields.text({ label: itemLabel, validation: required }), {
    label,
    itemLabel: (props) => props.value,
  })
const multiline = (label: string, description?: string) =>
  fields.text({ label, multiline: true, validation: required, ...(description && { description }) })
const titled = (label: string) =>
  fields.array(
    fields.object({
      title: fields.text({ label: 'Title', validation: required }),
      description: multiline('Description'),
    }),
    { label, itemLabel: (props) => props.fields.title.value }
  )
const linkDescription =
  'A case study anchor such as /#project-perd-wai (or #project-perd-wai on the home page), or /about#<timeline id>. The tests check that the target exists.'
const notes = fields.text({
  label: 'Editor notes',
  description: 'Sources and checks behind this content. Not shown on the site.',
  multiline: true,
})

export default config({
  storage:
    process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_KEYSTATIC_STORAGE !== 'github'
      ? { kind: 'local' }
      : { kind: 'github', repo: { owner: 'naiplawan', name: 'portfolio' }, branchPrefix: 'content/' },
  ui: {
    brand: { name: 'Portfolio content' },
    navigation: {
      Settings: ['site', 'seo'],
      Home: ['home', 'faq'],
      About: ['about', 'timeline'],
      Services: ['services', 'booking'],
      Projects: ['projects', 'projectOverrides'],
    },
  },
  singletons: {
    site: singleton({
      label: 'Site & contact',
      path: 'content/site',
      format: json,
      schema: {
        name: fields.text({ label: 'Name', validation: { isRequired: true } }),
        jobTitle: fields.text({ label: 'Job title', validation: { isRequired: true } }),
        company: fields.text({ label: 'Company', validation: { isRequired: true } }),
        location: fields.text({ label: 'Location', validation: { isRequired: true } }),
        email: fields.text({ label: 'Email', validation: { isRequired: true } }),
        github: fields.url({ label: 'GitHub URL', validation: { isRequired: true } }),
        linkedin: fields.url({ label: 'LinkedIn URL', validation: { isRequired: true } }),
        facebook: fields.url({ label: 'Facebook URL', validation: { isRequired: true } }),
      },
    }),
    seo: singleton({
      label: 'SEO',
      path: 'content/seo',
      format: json,
      schema: {
        personSummary: fields.text({
          label: 'Person summary',
          description:
            'One citable sentence in the third person. Used as the home description, the first FAQ answer, JSON-LD and llms.txt.',
          multiline: true,
          validation: { isRequired: true, length: { max: 320 } },
        }),
        homeTitle: fields.text({ label: 'Home page title', validation: { isRequired: true } }),
        defaultTitle: fields.text({ label: 'Default title', validation: { isRequired: true } }),
        defaultDescription: fields.text({
          label: 'Default description',
          multiline: true,
          validation: { isRequired: true },
        }),
        socialDescription: fields.text({
          label: 'Default X/Twitter description',
          multiline: true,
          validation: { isRequired: true },
        }),
        keywords: fields.array(fields.text({ label: 'Keyword', validation: { isRequired: true } }), {
          label: 'Keywords',
          itemLabel: (props) => props.value,
        }),
        knowsAbout: fields.array(fields.text({ label: 'Skill', validation: { isRequired: true } }), {
          label: 'Skills (knowsAbout)',
          description: 'Listed in the Person JSON-LD and llms.txt.',
          itemLabel: (props) => props.value,
        }),
        manifestDescription: fields.text({
          label: 'Web app manifest description',
          multiline: true,
          validation: { isRequired: true },
        }),
        pages: fields.array(
          fields.object({
            path: fields.select({
              label: 'Page',
              options: SEO_PAGE_PATHS.map((path) => ({ label: path, value: path })),
              defaultValue: '/about',
            }),
            title: fields.text({ label: 'Title', validation: { isRequired: true } }),
            description: fields.text({
              label: 'Meta description',
              multiline: true,
              validation: { isRequired: true, length: { max: 200 } },
            }),
          }),
          { label: 'Pages', itemLabel: (props) => props.fields.path.value }
        ),
      },
    }),
    faq: singleton({
      label: 'FAQ',
      path: 'content/faq',
      format: json,
      schema: {
        items: fields.array(
          fields.object({
            question: fields.text({ label: 'Question', validation: { isRequired: true } }),
            usePersonSummary: fields.checkbox({
              label: 'Answer with the person summary (SEO)',
              defaultValue: false,
            }),
            answer: fields.text({
              label: 'Answer',
              description:
                'Plain text in the third person that makes sense on its own. Leave empty when using the person summary.',
              multiline: true,
            }),
          }),
          { label: 'Questions', itemLabel: (props) => props.fields.question.value }
        ),
      },
    }),
    home: singleton({
      label: 'Home page',
      path: 'content/home',
      format: json,
      schema: {
        headline: fields.array(
          fields.object({
            word: fields.text({ label: 'Word', validation: required }),
            accent: fields.checkbox({ label: 'Accent colour', defaultValue: false }),
          }),
          {
            label: 'Hero headline',
            description: 'One word per item; each word pops in on its own. A full stop is added after the last word.',
            itemLabel: (props) => props.fields.word.value,
          }
        ),
        lead: multiline('Hero introduction'),
        detail: multiline('Hero second paragraph'),
        config: fields.array(
          fields.object({
            key: fields.text({ label: 'Key', validation: required }),
            value: fields.text({
              label: 'Value',
              description: 'Shown as code: include the quotes or brackets, e.g. "Bangkok, TH". Keep it under 60 characters so the typing animation stays short.',
              validation: { isRequired: true, length: { max: 60 } },
            }),
          }),
          { label: 'rachaphol.config.ts lines', itemLabel: (props) => props.fields.key.value }
        ),
        capabilities: fields.array(
          fields.object({
            name: fields.text({ label: 'Name', validation: required }),
            tools: fields.text({ label: 'Tools', description: 'Separate with " · ".', validation: required }),
            evidence: multiline('Evidence'),
            href: fields.text({ label: 'Link target', description: linkDescription, validation: required }),
            link: fields.text({ label: 'Link text', validation: required }),
          }),
          { label: 'Capabilities', itemLabel: (props) => props.fields.name.value }
        ),
        aboutParagraphs: fields.array(multiline('Paragraph'), {
          label: 'About section paragraphs',
          itemLabel: (props) => props.value.slice(0, 60),
        }),
      },
    }),
    about: singleton({
      label: 'About page',
      path: 'content/about',
      format: json,
      schema: {
        paragraphs: fields.array(multiline('Paragraph'), {
          label: 'Introduction',
          description: 'The first paragraph is shown larger.',
          itemLabel: (props) => props.value.slice(0, 60),
        }),
        capabilities: titled('Capabilities'),
      },
    }),
    timeline: singleton({
      label: 'Career timeline',
      path: 'content/timeline',
      format: json,
      schema: {
        items: fields.array(
          fields.object({
            id: fields.text({
              label: 'Anchor id',
              description: 'Used in links such as /about#work-2. Changing it breaks those links.',
              validation: { isRequired: true, pattern: { regex: /^[a-z0-9-]+$/, message: 'Lowercase letters, numbers and hyphens' } },
            }),
            type: fields.select({
              label: 'Type',
              options: TIMELINE_TYPES.map((value) => ({ label: value, value })),
              defaultValue: 'work',
            }),
            title: fields.text({ label: 'Title', validation: required }),
            organization: fields.text({ label: 'Organization', validation: required }),
            location: fields.text({ label: 'Location' }),
            date: fields.text({ label: 'Start (YYYY-MM)', validation: { isRequired: true, pattern: yearMonth } }),
            endDate: fields.text({ label: 'End (YYYY-MM)', description: 'Leave empty for a current role.' }),
            description: multiline('Description'),
            highlights: textList('Highlights', 'Highlight'),
            technologies: textList('Technologies', 'Technology'),
            commit: fields.object(
              {
                hash: fields.text({ label: 'Commit hash', validation: required }),
                message: fields.text({ label: 'Commit message', validation: required }),
                world: fields.text({ label: 'Level-map world', description: 'e.g. 3-1', validation: required }),
              },
              { label: 'git log entry (home page)' }
            ),
          }),
          {
            label: 'Entries',
            description: 'Shown newest first by start date.',
            itemLabel: (props) => `${props.fields.title.value} — ${props.fields.organization.value}`,
          }
        ),
      },
    }),
    services: singleton({
      label: 'Services page',
      path: 'content/services',
      format: json,
      schema: {
        offers: fields.array(
          fields.object({
            title: fields.text({ label: 'Title', validation: required }),
            suitableFor: multiline('For'),
            deliverable: multiline('You receive'),
            features: textList('Features', 'Feature'),
            exampleName: fields.text({ label: 'Example link text', validation: required }),
            exampleHref: fields.text({ label: 'Example link target', description: linkDescription, validation: required }),
          }),
          { label: 'Offers', itemLabel: (props) => props.fields.title.value }
        ),
        process: titled('Process steps'),
      },
    }),
    booking: singleton({
      label: 'Booking page',
      path: 'content/booking',
      format: json,
      schema: {
        timeSlots: fields.array(
          fields.object({
            time: fields.text({ label: 'Length', description: 'e.g. 30 minutes', validation: required }),
            type: fields.text({ label: 'Name', validation: required }),
            description: fields.text({ label: 'Description', validation: required }),
          }),
          { label: 'Call lengths', itemLabel: (props) => props.fields.time.value }
        ),
        topics: titled('Topics'),
        preparation: titled('Before we meet'),
      },
    }),
    projectOverrides: singleton({
      label: 'GitHub corrections',
      path: 'content/project-overrides',
      format: json,
      schema: {
        notes,
        items: fields.array(
          fields.object({
            repo: fields.text({
              label: 'Repository name',
              description: 'Lowercase GitHub repository name, e.g. layer-3d.',
              validation: required,
            }),
            title: fields.text({ label: 'Title', description: 'Leave empty to keep the repository name.' }),
            description: fields.text({
              label: 'Description',
              description: 'Leave empty to keep the GitHub description.',
              multiline: true,
            }),
            liveUrl: fields.conditional(
              fields.select({
                label: 'Live URL',
                options: [
                  { label: 'Keep the GitHub homepage', value: 'keep' },
                  { label: 'Replace with a verified URL', value: 'replace' },
                  { label: 'Remove (no longer deployed)', value: 'remove' },
                ],
                defaultValue: 'keep',
              }),
              {
                keep: fields.empty(),
                replace: fields.url({ label: 'Verified URL', validation: required }),
                remove: fields.empty(),
              }
            ),
          }),
          { label: 'Corrections', itemLabel: (props) => props.fields.repo.value }
        ),
      },
    }),
  },
  collections: {
    projects: collection({
      label: 'Curated projects',
      path: 'content/projects/*',
      format: json,
      slugField: 'title',
      columns: ['order', 'title'],
      schema: {
        title: fields.slug({
          name: { label: 'Title', validation: required },
          slug: {
            label: 'Slug',
            description: 'File name, screenshot folder and home page anchor (/#project-<slug>).',
          },
        }),
        order: fields.integer({
          label: 'Order',
          description: 'Lower numbers come first on the home page and in the fallback list.',
          validation: required,
        }),
        notes,
        githubRepoId: fields.integer({
          label: 'GitHub repository id',
          description: 'From api.github.com/repos/<owner>/<repo> → id.',
          validation: required,
        }),
        githubUrl: fields.url({ label: 'GitHub URL', validation: required }),
        liveUrl: fields.url({ label: 'Live URL', description: 'Leave empty when there is no verified deployment.' }),
        description: fields.text({ label: 'Description', multiline: true, validation: required }),
        problemStatement: fields.text({ label: 'Hypothesis (problem)', multiline: true, validation: required }),
        solution: fields.text({ label: 'Method (solution)', multiline: true, validation: required }),
        image: fields.image({
          label: 'Screenshot',
          directory: 'public/assets/projects',
          publicPath: '/assets/projects/',
          validation: required,
        }),
        technologies: textList('Technologies', 'Technology'),
        highlights: textList('Highlights', 'Highlight'),
        category: fields.select({
          label: 'Category',
          options: PROJECT_CATEGORIES.map((value) => ({ label: value, value })),
          defaultValue: 'web',
        }),
        status: fields.select({
          label: 'Status',
          options: PROJECT_STATUSES.map((value) => ({ label: value, value })),
          defaultValue: 'live',
        }),
        completedYear: fields.integer({ label: 'Year', validation: { isRequired: true, min: 2000, max: 2100 } }),
        caseStudy: fields.conditional(
          fields.checkbox({ label: 'Show as a case study on the home page', defaultValue: false }),
          {
            true: fields.object({
              contribution: fields.text({ label: 'My contribution', multiline: true, validation: required }),
              designDecision: fields.text({ label: 'Key decision', multiline: true, validation: required }),
              outcome: fields.text({ label: 'Result', multiline: true, validation: required }),
              screenshotAlt: fields.text({ label: 'Screenshot alt text', validation: required }),
              screenshotCaption: fields.text({ label: 'Screenshot caption', validation: required }),
              screenshotWidth: fields.integer({
                label: 'Screenshot width (px)',
                description: 'Must match the image file; the tests check it.',
                validation: required,
              }),
              screenshotHeight: fields.integer({ label: 'Screenshot height (px)', validation: required }),
            }),
            false: fields.empty(),
          }
        ),
      },
    }),
  },
})
