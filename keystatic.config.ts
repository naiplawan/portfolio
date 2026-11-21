import { config, fields, singleton } from '@keystatic/core'
import { SEO_PAGE_PATHS } from './lib/content/schemas'

/**
 * Content schema for the Keystatic admin at /keystatic. Local files in
 * development; commits to `content/*` branches on GitHub in production.
 *
 * Every entry is a JSON singleton under `content/`, imported statically and
 * validated by the zod schemas in `lib/content/schemas.ts`. Keep both in sync;
 * `lib/content/__tests__/content.test.ts` fails when they disagree.
 */

const json = { data: 'json' } as const

export default config({
  storage:
    process.env.NODE_ENV === 'development'
      ? { kind: 'local' }
      : { kind: 'github', repo: { owner: 'naiplawan', name: 'portfolio' }, branchPrefix: 'content/' },
  ui: {
    brand: { name: 'Portfolio content' },
    navigation: {
      Settings: ['site', 'seo'],
      Home: ['faq'],
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
  },
})
