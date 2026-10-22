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

/**
 * Editorial selection, independent of repository activity or star counts.
 * Claims and screenshots checked against the public READMEs on 2026-10-23:
 * https://github.com/naiplawan/perd-wai#readme (docs/screenshots/desktop.png)
 * https://github.com/naiplawan/layer-3d#readme (docs/screenshots/hero.png)
 * https://github.com/naiplawan/cafe-nme#readme (docs/screenshots/pos-sale.webp)
 * Outcomes describe implemented functionality, not measured adoption or impact.
 */
export const FEATURED_PROJECTS: readonly FeaturedProject[] = [
  {
    id: 1332191303,
    slug: 'perd-wai',
    title: 'Perd Wai',
    description: 'A Thai-first café launch simulator for exploring costs, break-even sales and cash runway.',
    problemStatement: 'Aspiring café owners need to see how rent, setup costs and daily sales affect their opening plan.',
    solution: 'A bilingual planning flow with deterministic calculations, scenario comparisons and exportable forecasts.',
    contribution: 'Built the planning interface, calculation engine and forecast views, with Thai/English copy and browser-saved plans.',
    designDecision: 'Keep the forecast deterministic. Optional AI explains the calculated results but cannot change the numbers or the decision signal.',
    businessImpact: {
      businessOutcome: 'Founders can compare three scenarios, inspect a six-month forecast and export a plan. The tool is ready for user validation; market validation is still pending.',
    },
    image: '/assets/projects/perd-wai.png',
    screenshot: {
      alt: 'Perd Wai café planning screen with startup assumptions and scenario inputs',
      width: 1280,
      height: 3327,
      caption: 'Planning interface with example assumptions; full screenshot includes the forecast.',
    },
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Vitest', 'Playwright'],
    githubUrl: 'https://github.com/naiplawan/perd-wai',
    liveUrl: 'https://perd-wai.vercel.app',
    category: 'web',
    status: 'live',
    featured: true,
    completedYear: 2026,
  },
  {
    id: 1414464311,
    slug: 'layer-3d',
    title: 'Layer 3D',
    description: 'A Thai-language website for a Bangkok 3D-printing studio, from material selection to a LINE quote request.',
    problemStatement: 'Customers need to understand the printing options and find a clear way to request a quote.',
    solution: 'A responsive service website with material comparisons, project examples and an interactive 3D printer preview.',
    contribution: 'Built the Next.js page, interactive printer scene and service-to-quote flow, including Thai typography and mobile layouts.',
    designDecision: 'Load the 3D scene separately, pause it outside the viewport and respect reduced motion so the illustration does not need to run continuously.',
    businessImpact: {
      businessOutcome: 'Visitors can compare materials, browse sample work and continue to LINE to request a quote from the same page.',
    },
    image: '/assets/projects/layer-3d.png',
    screenshot: {
      alt: 'Layer 3D website with Thai service information, quote buttons and an interactive printer preview',
      width: 1440,
      height: 900,
      caption: 'Desktop landing page and its interactive printer preview.',
    },
    technologies: ['Next.js', 'TypeScript', 'React Three Fiber', 'GSAP', 'Tailwind CSS'],
    githubUrl: 'https://github.com/naiplawan/layer-3d',
    liveUrl: 'https://layer-3d.vercel.app',
    category: 'web',
    status: 'live',
    featured: true,
    completedYear: 2026,
  },
  {
    id: 1417399631,
    slug: 'cafe-nme',
    title: 'Cafe’nMe',
    description: 'A café point-of-sale application connecting tablet checkout, shop administration and LINE membership.',
    problemStatement: 'Café staff, owners and customers need different interfaces that share orders, menu data and loyalty rewards.',
    solution: 'A tablet POS, web admin and LINE member card backed by a NestJS API and PostgreSQL.',
    contribution: 'Built checkout and menu-management flows alongside the API and LINE membership integration.',
    designDecision: 'Keep the staff checkout, owner admin and customer member card distinct, while sharing the order and loyalty data behind them.',
    businessImpact: {
      businessOutcome: 'The implemented flow connects orders and payments to stamps and rewards, with sales reports for owners. The screenshot uses demo café data.',
    },
    image: '/assets/projects/cafe-nme.webp',
    screenshot: {
      alt: 'Cafe’nMe tablet checkout with a drink menu, customizable cart items and payment total',
      width: 1280,
      height: 800,
      caption: 'Tablet checkout using the repository’s demo café and orders.',
    },
    technologies: ['Next.js', 'TypeScript', 'NestJS', 'PostgreSQL', 'LINE LIFF'],
    githubUrl: 'https://github.com/naiplawan/cafe-nme',
    category: 'fullstack',
    status: 'development',
    featured: true,
    completedYear: 2026,
  },
];
