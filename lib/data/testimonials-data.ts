export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  image?: string;
  text: string;
  rating: number;
  date: string;
  linkedIn?: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Product Manager',
    company: 'Tech Innovations Inc.',
    text: 'Rachaphol is an exceptional frontend developer who consistently delivers high-quality work. His attention to detail and ability to translate complex requirements into elegant solutions is remarkable. The performance optimizations he implemented reduced our load time by 60%.',
    rating: 5,
    date: '2024-12',
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'CTO',
    company: 'StartupHub',
    text: 'Working with Rachaphol was a game-changer for our project. He not only built a beautiful interface but also architected a scalable solution that grew with our business. His expertise in React and Next.js is outstanding.',
    rating: 5,
    date: '2024-11',
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Lead Designer',
    company: 'Creative Solutions',
    text: 'Rachaphol brings designs to life with pixel-perfect precision. His collaborative approach and technical expertise make him a valuable team member. He always finds innovative solutions to complex UI challenges.',
    rating: 5,
    date: '2024-10',
  },
  {
    id: 4,
    name: 'David Kim',
    role: 'Senior Developer',
    company: 'Unixdev Co., Ltd.',
    text: 'As a colleague, I\'ve witnessed Rachaphol\'s growth and dedication firsthand. His ability to learn new technologies quickly and implement them effectively is impressive. He\'s always willing to help and share knowledge.',
    rating: 5,
    date: '2025-01',
  },
];

export const getAverageRating = (): number => {
  if (testimonials.length === 0) return 0;
  const sum = testimonials.reduce((acc, t) => acc + t.rating, 0);
  return sum / testimonials.length;
};

export const getTestimonialCount = (): number => testimonials.length;
