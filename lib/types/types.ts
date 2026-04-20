export interface ProjectMetrics {
  readonly users?: string;
  readonly performance?: string;
  readonly uptime?: string;
  readonly responseTime?: string;
}

export interface BusinessImpact {
  readonly roi?: string;
  readonly costSavings?: string;
  readonly revenueIncrease?: string;
  readonly timeToMarket?: string;
  readonly userSatisfaction?: string;
  readonly businessOutcome: string;
}

export interface Project {
  readonly id: number;
  readonly title: string;
  readonly description: string;
  readonly problemStatement: string;
  readonly solution: string;
  readonly image: string;
  readonly technologies: readonly string[];
  readonly githubUrl: string;
  readonly liveUrl?: string;
  readonly highlights?: readonly string[];
  readonly metrics?: ProjectMetrics;
  readonly businessImpact?: BusinessImpact;
  readonly category: 'fullstack' | 'ai' | 'enterprise' | 'wellness' | 'web' | 'mobile' | 'backend' | 'gaming' | 'tools' | 'other';
  readonly status: 'live' | 'development' | 'archived';
  readonly featured: boolean;
  readonly completedYear: number;
}

export interface ProjectCardProps {
  readonly project: Project;
  readonly index: number;
}