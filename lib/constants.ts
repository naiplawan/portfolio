// Social Media Links
export const SOCIAL_LINKS = {
  github: 'https://github.com/naiplawan',
  linkedin: 'https://www.linkedin.com/in/rachaphol-plookaom',
  facebook: 'https://www.facebook.com/mos.jrpt',
  email: 'rachaphol.plo@gmail.com',
} as const;

// Professional Information
export const PROFESSIONAL_INFO = {
  name: 'Rachaphol Plookaom',
  title: 'Frontend Developer',
  company: 'Unixdev Co., Ltd.',
  location: 'Bangkok, Thailand',
  experience: '6+',
  technologies: '20+',
} as const;

// Site URLs
export const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://rachaphol-portfolio.vercel.app';

// Resume Path
export const RESUME_PATH = '/Rachaphol_Resume.pdf';

// Analytics & Metrics
export const METRICS = {
  uptime: '99.9%',
  performanceImprovement: '60%',
  aiReduction: '75%',
  databaseOptimization: '40%',
  onboardingImprovement: '50%',
} as const;

// Typewriter Words
export const TYPEWRITER_WORDS: string[] = [
  'Performance-First Fullstack Architect',
  'Building Scalable Web Solutions',
  'Crafting Modern User Experiences',
  'Delivering Measurable Business Impact',
];

// Skill Tags
export const SKILL_TAGS: string[] = [
  'Fullstack Architecture',
  'Performance Engineering',
  'Business Impact',
  'Scalable Solutions',
];

// Employment History
export const EMPLOYMENT = {
  current: {
    title: 'Frontend Developer',
    company: 'Unixdev Co., Ltd.',
    period: 'Feb 2025 - Present',
    location: 'Bangkok City, Thailand',
    type: 'On-site',
  },
  previous: {
    title: 'Junior Full Stack Software Developer',
    company: 'Turfmapp',
    period: 'Jan 2024 - Jan 2025',
  },
} as const;

// Education
export const EDUCATION = {
  bootcamp: {
    name: 'Coding Bootcamp',
    institution: 'TechUp, Bangkok',
    period: 'June 2023 – October 2023',
    skills: ['HTML', 'CSS', 'JavaScript', 'Node.js', 'Express.js', 'MongoDB', 'PostgreSQL', 'Git'],
  },
  degree: {
    name: "Bachelor's Degree",
    institution: 'Mahidol University, Bangkok',
    period: '2015 – 2018',
    field: 'Biology/Biological Sciences',
  },
} as const;

// Animation Variants
export const ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  },
  item: {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        stiffness: 300,
        damping: 24,
      },
    },
  },
  fadeIn: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 300,
        damping: 24,
      },
    },
  },
} as const;
