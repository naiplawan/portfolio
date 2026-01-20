export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  publishedAt: string;
  updatedAt: string;
  readTime: number;
  featured: boolean;
  author: string;
  status: 'draft' | 'published';
  slug: string;
}

export interface BlogPostFormData {
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  featured: boolean;
  status: 'draft' | 'published';
}

// Local storage functions for blog posts
const BLOG_STORAGE_KEY = 'portfolio_blog_posts';

export function getBlogPosts(): BlogPost[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(BLOG_STORAGE_KEY);
    return stored ? JSON.parse(stored) : getDefaultBlogPosts();
  } catch (error) {
    console.error('Error loading blog posts:', error);
    return getDefaultBlogPosts();
  }
}

export function saveBlogPost(post: BlogPostFormData, id?: string): BlogPost {
  const posts = getBlogPosts();
  const now = new Date().toISOString();
  
  const blogPost: BlogPost = {
    id: id || generateId(),
    ...post,
    slug: generateSlug(post.title),
    publishedAt: id ? posts.find(p => p.id === id)?.publishedAt || now : now,
    updatedAt: now,
    readTime: calculateReadTime(post.content),
    author: 'Rachaphol Naiplawan'
  };
  
  if (id) {
    const index = posts.findIndex(p => p.id === id);
    if (index >= 0) {
      posts[index] = blogPost;
    } else {
      posts.unshift(blogPost);
    }
  } else {
    posts.unshift(blogPost);
  }
  
  localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(posts));
  return blogPost;
}

export function deleteBlogPost(id: string): void {
  const posts = getBlogPosts();
  const filteredPosts = posts.filter(p => p.id !== id);
  localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(filteredPosts));
}

export function getBlogPost(idOrSlug: string): BlogPost | undefined {
  const posts = getBlogPosts();
  return posts.find(p => p.id === idOrSlug || p.slug === idOrSlug);
}

export function getPublishedBlogPosts(): BlogPost[] {
  return getBlogPosts().filter(p => p.status === 'published');
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();
}

function calculateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

function getDefaultBlogPosts(): BlogPost[] {
  return [
    {
      id: 'modern-react-patterns',
      title: 'Modern React Patterns in 2024',
      excerpt: 'Exploring the latest patterns and best practices for building scalable React applications with hooks, context, and custom patterns.',
      content: `# Modern React Patterns in 2024

React continues to evolve, and with it, the patterns and best practices for building scalable applications. In this article, we'll explore the latest patterns that have emerged in 2024.

## Custom Hooks Pattern

Custom hooks are one of the most powerful patterns in React. They allow you to extract component logic into reusable functions.

\`\`\`javascript
function useApi(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, [url]);

  return { data, loading, error };
}
\`\`\`

This pattern promotes reusability and keeps your components clean and focused.

## Compound Components

Compound components give you expressive and flexible APIs for components that need to work together.

\`\`\`javascript
function Modal({ children, isOpen, onClose }) {
  return createPortal(
    isOpen ? (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          {children}
        </div>
      </div>
    ) : null,
    document.body
  );
}

Modal.Header = function ModalHeader({ children }) {
  return <div className="modal-header">{children}</div>;
};

Modal.Body = function ModalBody({ children }) {
  return <div className="modal-body">{children}</div>;
};
\`\`\`

## Conclusion

These patterns help create maintainable and scalable React applications. The key is to choose the right pattern for your specific use case.`,
      tags: ['React', 'JavaScript', 'Frontend'],
      publishedAt: '2024-01-15T00:00:00.000Z',
      updatedAt: '2024-01-15T00:00:00.000Z',
      readTime: 8,
      featured: true,
      author: 'Rachaphol Naiplawan',
      status: 'published',
      slug: 'modern-react-patterns'
    },
    {
      id: 'nextjs-performance',
      title: 'Optimizing Next.js Performance',
      excerpt: 'A comprehensive guide to improving Core Web Vitals and overall performance in Next.js applications.',
      content: `# Optimizing Next.js Performance

Performance is crucial for user experience and SEO. Next.js provides many built-in optimizations, but there's always more we can do.

## Image Optimization

Next.js Image component automatically optimizes images:

\`\`\`javascript
import Image from 'next/image';

function MyComponent() {
  return (
    <Image
      src="/hero.jpg"
      alt="Blog hero section featuring abstract technology background"
      width={800}
      height={600}
      priority
    />
  );
}
\`\`\`

## Code Splitting

Use dynamic imports for code splitting:

\`\`\`javascript
import dynamic from 'next/dynamic';

const DynamicComponent = dynamic(() => import('../components/Heavy'), {
  loading: () => <p>Loading...</p>,
});
\`\`\`

## Conclusion

Performance optimization is an ongoing process. Monitor your Core Web Vitals and continuously improve.`,
      tags: ['Next.js', 'Performance', 'SEO'],
      publishedAt: '2024-01-10T00:00:00.000Z',
      updatedAt: '2024-01-10T00:00:00.000Z',
      readTime: 12,
      featured: true,
      author: 'Rachaphol Naiplawan',
      status: 'published',
      slug: 'nextjs-performance'
    }
  ];
}