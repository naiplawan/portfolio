import { TIMELINE } from '@/lib/content';

export interface TimelineItem {
  id: string;
  type: 'work' | 'education' | 'achievement' | 'project';
  title: string;
  organization: string;
  location?: string;
  date: string;
  endDate?: string;
  description: string;
  highlights?: string[];
  technologies?: string[];
  icon?: string;
  /** How the entry reads in the home page's `git log` / level map */
  commit: {
    hash: string;
    message: string;
    world: string;
  };
}

/** Career entries, edited in the admin (Career timeline). */
export const timelineData: TimelineItem[] = TIMELINE.items.map(({ location, endDate, highlights, technologies, ...item }) => ({
  ...item,
  ...(location && { location }),
  ...(endDate && { endDate }),
  ...(highlights.length > 0 && { highlights }),
  ...(technologies.length > 0 && { technologies }),
}));

export function getTimelineByType(type?: TimelineItem['type']): TimelineItem[] {
  if (!type) return timelineData;
  return timelineData.filter(item => item.type === type);
}

export function getTimelineSorted(): TimelineItem[] {
  return [...timelineData].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });
}

export function formatTimelinePeriod(item: Pick<TimelineItem, 'date' | 'endDate'>): string {
  const format = (date: string) =>
    new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', timeZone: 'UTC' });

  return `${format(item.date)} – ${item.endDate ? format(item.endDate) : 'Present'}`;
}
