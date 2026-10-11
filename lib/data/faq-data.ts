import { SOCIAL_LINKS } from '../constants';
import { PERSON_SUMMARY } from '../seo';

export interface FaqItem {
  question: string;
  /** Plain text: rendered on the page and reused verbatim in FAQPage JSON-LD */
  answer: string;
}

/**
 * Short, self-contained answers written for search snippets and AI answer engines.
 * Each answer must make sense on its own, without the question or the page around it.
 */
export const FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: 'Who is Rachaphol Plookaom?',
    answer: PERSON_SUMMARY,
  },
  {
    question: 'What technologies does Rachaphol Plookaom work with?',
    answer:
      'Rachaphol Plookaom builds frontends with React, Next.js, TypeScript and Tailwind CSS, backends with Go (Fiber), Node.js and Python (Django), and mobile apps with Flutter and Dart, using PostgreSQL for data.',
  },
  {
    question: 'How does a biology background help in software development?',
    answer:
      'Training in Biological Sciences taught Rachaphol Plookaom to treat problems as experiments: form a hypothesis, change one variable, measure the result. The same loop drives debugging, performance work and product decisions.',
  },
  {
    question: 'What has Rachaphol Plookaom built?',
    answer:
      'Public projects include Rob Baan, a wildlife dex for Bangkok parks; Perd Wai, a café launch simulator; ByteTrack, a calorie tracker; PayKit, a retail point-of-sale template; and Layer, a website for a Bangkok 3D-printing service. The full list is on the Projects page.',
  },
  {
    question: 'Is Rachaphol Plookaom available for freelance work?',
    answer: `Yes. Rachaphol Plookaom is open to freelance projects and full-time roles. The fastest way to get in touch is by email at ${SOCIAL_LINKS.email} or through the contact form on this site.`,
  },
  {
    question: 'Where is Rachaphol Plookaom based?',
    answer: 'Rachaphol Plookaom is based in Bangkok, Thailand (UTC+7).',
  },
];
