export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  coverImage: string;
  tags: string[];
  readingTime: number;
  featured?: boolean;
  status: 'published' | 'draft';
  category: 'technical' | 'career' | 'tutorial' | 'thoughts';
}

// Blog posts data
export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Building Performant Web Applications with Next.js 15',
    slug: 'building-performant-web-apps-nextjs-15',
    excerpt: 'Discover the latest features and best practices for building lightning-fast web applications using Next.js 15 App Router.',
    content: `
# Building Performant Web Applications with Next.js 15

Next.js 15 brings significant improvements to web application performance. In this article, we'll explore the key features and best practices for building lightning-fast applications.

## Key Features

### 1. App Router Enhancements

The App Router in Next.js 15 introduces several performance improvements:

- **Server Components by Default**: Reduced JavaScript bundle size
- **Improved Caching**: Better data fetching and caching strategies
- **Streaming UI**: Progressive rendering for faster initial paint

\`\`\`tsx
// Example of a Server Component
async function BlogPost({ slug }: { slug: string }) {
  const post = await getPost(slug);

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  );
}
\`\`\`

### 2. Optimized Data Fetching

Next.js 15 introduces improved data fetching patterns:

\`\`\`tsx
// Parallel data fetching
async function getData() {
  const [posts, authors] = await Promise.all([
    fetchPosts(),
    fetchAuthors()
  ]);

  return { posts, authors };
}
\`\`\`

### 3. Image Optimization

Built-in image optimization with automatic lazy loading and WebP support:

\`\`\`tsx
import Image from 'next/image';

<Image
  src="/blog-cover.jpg"
  alt={Blog Cover Image}
  width={800}
  height={400}
  priority // Load above-the-fold images immediately
/>
\`\`\`

## Performance Best Practices

1. **Use Server Components When Possible**: Reduce client-side JavaScript
2. **Implement Proper Caching**: Leverage Next.js caching strategies
3. **Optimize Images**: Use the Image component for all images
4. **Code Splitting**: Split code by routes and components
5. **Bundle Analysis**: Regularly analyze your bundle size

## Conclusion

Next.js 15 provides excellent tools for building performant web applications. By leveraging these features and following best practices, you can create fast, efficient applications that provide excellent user experiences.

---

*Published on November 15, 2024*
    `,
    author: 'Rachaphol Plookaom',
    publishedAt: '2024-11-15',
    updatedAt: '2024-11-15',
    coverImage: '/blog/nextjs-15-performance.jpg',
    tags: ['Next.js', 'React', 'Performance', 'Web Development'],
    readingTime: 5,
    featured: true,
    status: 'published',
    category: 'technical'
  },
  {
    id: '2',
    title: 'Mastering TypeScript for Full-Stack Development',
    slug: 'mastering-typescript-fullstack',
    excerpt: 'A comprehensive guide to TypeScript patterns and practices for building scalable full-stack applications.',
    content: `
# Mastering TypeScript for Full-Stack Development

TypeScript has become essential for modern web development. Let's explore advanced patterns and practices for building robust full-stack applications.

## Advanced TypeScript Patterns

### 1. Generic Utility Types

Create reusable utility types for your application:

\`\`\`typescript
// API Response type
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

// Paginated response
interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
\`\`\`

### 2. Conditional Types

Create flexible type definitions:

\`\`\`typescript
// Conditional type based on environment
type Config<T> = T extends 'development'
  ? { apiBaseUrl: string; debugMode: true }
  : { apiBaseUrl: string; debugMode: false };

// Usage
type DevConfig = Config<'development'>;
type ProdConfig = Config<'production'>;
\`\`\`

### 3. Mapped Types

Transform existing types:

\`\`\`typescript
// Make all properties optional
type Partial<T> = {
  [P in keyof T]?: T[P];
};

// Make all properties readonly
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};
\`\`\`

## Full-Stack TypeScript Architecture

### Frontend with React

\`\`\`typescript
// Type-safe API hooks
import { useQuery, useMutation } from '@tanstack/react-query';

interface User {
  id: string;
  name: string;
  email: string;
}

function useUsers() {
  return useQuery<User[]>({
    queryKey: ['users'],
    queryFn: () => fetch('/api/users').then(res => res.json())
  });
}

function useCreateUser() {
  return useMutation<User, Error, Omit<User, 'id'>>({
    mutationFn: (userData) =>
      fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify(userData)
      }).then(res => res.json())
  });
}
\`\`\`

### Backend with Node.js

\`\`\`typescript
// Express.js with TypeScript
import express from 'express';
import { Request, Response } from 'express';

interface TypedRequest<T> extends Request {
  body: T;
}

app.post('/api/users', async (req: TypedRequest<Omit<User, 'id'>>, res: Response) => {
  try {
    const user: User = await createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});
\`\`\`

## Best Practices

1. **Use Strict Mode**: Enable all TypeScript strict checks
2. **Prefer Interfaces**: Use interfaces over type aliases for objects
3. **Avoid any**: Use proper typing instead of any
4. **Type APIs**: Create types for all API endpoints
5. **Use Generics**: Build reusable components and functions

## Conclusion

TypeScript provides powerful tools for building robust full-stack applications. By mastering these patterns and practices, you can create scalable, maintainable codebases.

---

*Published on November 10, 2024*
    `,
    author: 'Rachaphol Plookaom',
    publishedAt: '2024-11-10',
    updatedAt: '2024-11-10',
    coverImage: '/blog/typescript-fullstack.jpg',
    tags: ['TypeScript', 'Full-Stack', 'React', 'Node.js'],
    readingTime: 8,
    featured: true,
    status: 'published',
    category: 'technical'
  },
  {
    id: '3',
    title: 'The Journey from Junior to Senior Developer',
    slug: 'journey-junior-to-senior-developer',
    excerpt: 'My personal experience and insights on career growth, skill development, and the mindset shift needed to become a senior developer.',
    content: `
# The Journey from Junior to Senior Developer

After three years in the industry, I've learned valuable lessons about career growth and professional development. Here's my journey and insights.

## The Mindset Shift

### From Coder to Problem Solver

As a junior developer, I focused on writing code. As a senior developer, I focus on solving problems.

**Junior Developer Perspective:**
- How do I implement this feature?
- What's the best way to write this function?
- How can I complete this ticket?

**Senior Developer Perspective:**
- Why are we building this feature?
- What's the business impact?
- How can we scale this solution?
- What are the long-term implications?

## Technical Growth Areas

### 1. System Design

Moving from individual components to system architecture:

\`\`\`
// Before: Focusing on single components
function UserProfile({ user }) {
  return <div>{user.name}</div>;
}

// After: Considering the entire system
const UserSystem = {
  profile: UserProfile,
  permissions: PermissionManager,
  auth: AuthService,
  cache: UserCache
};
\`\`\`

### 2. Performance Optimization

Understanding performance at scale:

- Database query optimization
- Caching strategies
- Load balancing
- CDN implementation
- Code splitting

### 3. Code Quality Standards

Establishing and maintaining standards:

- Code reviews
- Testing strategies
- Documentation
- Refactoring techniques

## Leadership and Mentorship

### Guiding Junior Developers

1. **Code Reviews**: Provide constructive, actionable feedback
2. **Pair Programming**: Collaborate and share knowledge
3. **Technical Decisions**: Explain the "why" behind choices
4. **Career Growth**: Help with skill development

### Communication Skills

- Technical writing
- Presenting to stakeholders
- Cross-team collaboration
- Managing expectations

## Continuous Learning

The tech industry evolves rapidly. Senior developers must:

1. **Stay Current**: Follow industry trends and updates
2. **Deepen Knowledge**: Go beyond surface-level understanding
3. **Teach Others**: Solidify knowledge through teaching
4. **Side Projects**: Explore new technologies

## Key Milestones

### Year 1: Foundation
- Master the basics
- Contribute to existing projects
- Learn the codebase
- Understand the business domain

### Year 2: Independence
- Lead small features
- Mentor junior developers
- Improve code quality
- Participate in architectural decisions

### Year 3+: Leadership
- Design systems
- Lead projects
- Influence technical strategy
- Build and lead teams

## Conclusion

The journey from junior to senior is about more than technical skills. It's about mindset, leadership, communication, and continuous learning. Embrace the challenges and enjoy the growth process.

---

*Published on November 5, 2024*
    `,
    author: 'Rachaphol Plookaom',
    publishedAt: '2024-11-05',
    updatedAt: '2024-11-05',
    coverImage: '/blog/career-growth.jpg',
    tags: ['Career', 'Growth', 'Leadership', 'Professional Development'],
    readingTime: 6,
    featured: false,
    status: 'published',
    category: 'career'
  }
];

// Get all published blog posts
export function getPublishedPosts(): BlogPost[] {
  return blogPosts.filter(post => post.status === 'published');
}

// Get featured blog posts
export function getFeaturedPosts(): BlogPost[] {
  return blogPosts.filter(post => post.featured && post.status === 'published');
}

// Get blog post by slug
export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug);
}

// Get posts by category
export function getPostsByCategory(category: BlogPost['category']): BlogPost[] {
  return blogPosts.filter(post => post.category === category && post.status === 'published');
}

// Get posts by tag
export function getPostsByTag(tag: string): BlogPost[] {
  return blogPosts.filter(post =>
    post.tags.includes(tag) && post.status === 'published'
  );
}

// Get recent posts
export function getRecentPosts(limit: number = 3): BlogPost[] {
  return getPublishedPosts()
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
}

// Get all unique tags
export function getAllTags(): string[] {
  const tags = new Set<string>();
  blogPosts.forEach(post => {
    if (post.status === 'published') {
      post.tags.forEach(tag => tags.add(tag));
    }
  });
  return Array.from(tags).sort();
}

// Get all categories with post count
export function getCategoriesWithCount(): { category: BlogPost['category']; count: number }[] {
  const categories = ['technical', 'career', 'tutorial', 'thoughts'] as const;
  return categories.map(category => ({
    category,
    count: getPostsByCategory(category).length
  }));
}