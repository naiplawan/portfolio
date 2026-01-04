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
}

export const timelineData: TimelineItem[] = [
  // Work Experience
  {
    id: 'work-1',
    type: 'work',
    title: 'Frontend Developer',
    organization: 'Unixdev',
    location: 'Bangkok, Thailand',
    date: '2025-02',
    description: 'Design and implement innovative user-facing features that enhance digital product functionality and user experience. Architect modular, scalable code solutions with a focus on reusability and maintainability.',
    highlights: [
      'Built and deployed web applications using React.js 19, Next.js 15 (App Router), and Tailwind CSS',
      'Architect modular, scalable code solutions with focus on reusability and industry best practices',
      'Facilitate cross-functional collaboration between design, development, and product management teams',
      'Drive continuous technological innovation by researching and integrating emerging web technologies'
    ],
    technologies: ['React.js 19', 'Next.js 15', 'Tailwind CSS', 'Flutter', 'TypeScript']
  },
  {
    id: 'work-2',
    type: 'work',
    title: 'Full Stack Software Developer',
    organization: 'Turfmapp',
    location: 'Bangkok, Thailand',
    date: '2024-01',
    endDate: '2025-01',
    description: 'Developed and maintained web applications using a comprehensive technology stack. Managed backend databases and integrated AI technologies including LLM and RAG systems.',
    highlights: [
      'Developed web applications using React.js, Node.js, Express.js, Django, and Tailwind CSS',
      'Managed backend databases with MongoDB and PostgreSQL ensuring data integrity',
      'Deployed and optimized applications on DigitalOcean with Cloudflare',
      'Integrated AI technologies including LLM and RAG systems to improve functionality',
      'Utilized Postman for comprehensive API testing and documentation'
    ],
    technologies: ['React.js', 'Node.js', 'Express.js', 'Django', 'MongoDB', 'PostgreSQL', 'DigitalOcean', 'Cloudflare', 'LLM', 'RAG']
  },


  // Education
  {
    id: 'edu-2',
    type: 'education',
    title: 'Coding Bootcamp',
    organization: 'TechUp',
    location: 'Bangkok, Thailand',
    date: '2023-06',
    endDate: '2023-10',
    description: 'Intensive full-stack development bootcamp covering modern web development technologies and practices.',
    highlights: [
      'HTML, CSS, JavaScript, Node.js, Express.js',
      'MongoDB and PostgreSQL database management',
      'Software testing methodologies',
      'Hands-on project-based learning'
    ]
  },
  {
    id: 'edu-1',
    type: 'education',
    title: "Bachelor's Degree in Biological Sciences",
    organization: 'Mahidol University',
    location: 'Bangkok, Thailand',
    date: '2015-08',
    endDate: '2018-05',
    description: 'Bachelor\'s degree in Biological Sciences with a strong foundation in analytical thinking and scientific methodology.',
    highlights: [
      'Biology/Biological Sciences program',
      'Strong analytical and problem-solving skills',
      'Scientific research methodology'
    ]
  },
];

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
