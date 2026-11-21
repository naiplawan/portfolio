import { PROJECTS } from '@/lib/content/projects';
import type { Project } from '@/lib/types/types';

interface FeaturedProject extends Project {
  readonly slug: string;
  readonly contribution: string;
  readonly designDecision: string;
  readonly businessImpact: { readonly businessOutcome: string };
  readonly screenshot: {
    readonly alt: string;
    readonly width: number;
    readonly height: number;
    readonly caption: string;
  };
}

type CuratedItem = (typeof PROJECTS)[number];

const toProject = (item: CuratedItem): Project => ({
  id: item.githubRepoId,
  title: item.title,
  description: item.description,
  problemStatement: item.problemStatement,
  solution: item.solution,
  image: item.image,
  technologies: item.technologies,
  githubUrl: item.githubUrl,
  ...(item.liveUrl && { liveUrl: item.liveUrl }),
  ...(item.highlights.length > 0 && { highlights: item.highlights }),
  category: item.category,
  status: item.status,
  featured: true,
  completedYear: item.completedYear,
});

const toFeatured = (item: CuratedItem): FeaturedProject | null => {
  if (!item.caseStudy.discriminant) return null;
  const study = item.caseStudy.value;
  return {
    ...toProject(item),
    slug: item.slug,
    contribution: study.contribution,
    designDecision: study.designDecision,
    businessImpact: { businessOutcome: study.outcome },
    screenshot: {
      alt: study.screenshotAlt,
      width: study.screenshotWidth,
      height: study.screenshotHeight,
      caption: study.screenshotCaption,
    },
  };
};

/**
 * Curated projects, edited in Keystatic (Projects → Curated projects). They
 * replace GitHub's metadata for the same repository and are the fallback list
 * when GitHub is unavailable. The editor notes record how claims were checked.
 */
export const CURATED_PROJECTS: readonly Project[] = PROJECTS.map((item) => toFeatured(item) ?? toProject(item));

/** Case studies on the home page, in editor order, independent of repository activity. */
export const FEATURED_PROJECTS: readonly FeaturedProject[] = PROJECTS
  .map(toFeatured)
  .filter((project): project is FeaturedProject => project !== null);
