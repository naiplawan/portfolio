import { FAQ } from '../content';
import { PERSON_SUMMARY } from '../seo';

export interface FaqItem {
  question: string;
  /** Plain text: rendered on the page and reused verbatim in FAQPage JSON-LD */
  answer: string;
}

/**
 * Short, self-contained answers written for search snippets and AI answer engines,
 * edited in the admin (FAQ). Each answer must make sense on its own,
 * without the question or the page around it.
 */
export const FAQ_ITEMS: readonly FaqItem[] = FAQ.items.map(({ question, usePersonSummary, answer }) => ({
  question,
  answer: usePersonSummary ? PERSON_SUMMARY : answer,
}));
