/**
 * Browser-based LocalStorage Export Script
 *
 * This script can be run in the browser console to export existing blog posts
 * from localStorage to a JSON file for migration to Supabase.
 *
 * Usage:
 * 1. Open your portfolio site in the browser
 * 2. Navigate to /blog/manage (log in if needed)
 * 3. Open browser console (F12)
 * 4. Copy and paste this script
 * 5. Run the export() function
 */

/**
 * Export localStorage blog posts to JSON file
 */
function exportLocalStoragePosts() {
  const STORAGE_KEY = 'portfolio_blog_posts';

  // Get posts from localStorage
  const stored = localStorage.getItem(STORAGE_KEY);

  let posts;

  if (stored) {
    posts = JSON.parse(stored);
  } else {
    console.warn('No posts found in localStorage. Using default posts.');
    // Use default posts if localStorage is empty
    posts = getDefaultBlogPosts();
  }

  console.log(`Found ${posts.length} blog posts in localStorage`);

  // Create JSON blob
  const blob = new Blob([JSON.stringify(posts, null, 2)], {
    type: 'application/json',
  });

  // Create download link
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `blog-posts-export-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  console.log('✅ Posts exported successfully!');
  console.log(`📁 File downloaded: blog-posts-export-${new Date().toISOString().split('T')[0]}.json`);

  return posts;
}

/**
 * Display posts in console for review
 */
function reviewLocalStoragePosts() {
  const STORAGE_KEY = 'portfolio_blog_posts';
  const stored = localStorage.getItem(STORAGE_KEY);

  let posts;

  if (stored) {
    posts = JSON.parse(stored);
  } else {
    posts = getDefaultBlogPosts();
  }

  console.log('📝 Blog Posts in localStorage:');
  console.table(posts.map(p => ({
    id: p.id,
    title: p.title,
    status: p.status,
    featured: p.featured,
    tags: p.tags.join(', '),
    publishedAt: new Date(p.publishedAt).toLocaleDateString(),
  })));

  return posts;
}

/**
 * Get default blog posts (fallback)
 */
function getDefaultBlogPosts() {
  return [
    {
      id: 'modern-react-patterns',
      title: 'Modern React Patterns in 2024',
      excerpt: 'Exploring the latest patterns and best practices for building scalable React applications with hooks, context, and custom patterns.',
      content: `# Modern React Patterns in 2024\n\nReact continues to evolve, and with it, the patterns and best practices for building scalable applications. In this article, we'll explore the latest patterns that have emerged in 2024.\n\n## Custom Hooks Pattern\n\nCustom hooks are one of the most powerful patterns in React. They allow you to extract component logic into reusable functions.\n\n\`\`\`javascript\nfunction useApi(url) {\n  const [data, setData] = useState(null);\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState(null);\n\n  useEffect(() => {\n    fetch(url)\n      .then(response => response.json())\n      .then(data => {\n        setData(data);\n        setLoading(false);\n      })\n      .catch(error => {\n        setError(error);\n        setLoading(false);\n      });\n  }, [url]);\n\n  return { data, loading, error };\n}\n\`\`\`\n\nThis pattern promotes reusability and keeps your components clean and focused.\n\n## Compound Components\n\nCompound components give you expressive and flexible APIs for components that need to work together.\n\n\`\`\`javascript\nfunction Modal({ children, isOpen, onClose }) {\n  return createPortal(\n    isOpen ? (\n      <div className="modal-overlay" onClick={onClose}>\n        <div className="modal-content" onClick={e => e.stopPropagation()}>\n          {children}\n        </div>\n      </div>\n    ) : null,\n    document.body\n  );\n}\n\nModal.Header = function ModalHeader({ children }) {\n  return <div className="modal-header">{children}</div>;\n};\n\nModal.Body = function ModalBody({ children }) {\n  return <div className="modal-body">{children}</div>;\n};\n\`\`\`\n\n## Conclusion\n\nThese patterns help create maintainable and scalable React applications. The key is to choose the right pattern for your specific use case.`,
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
      content: `# Optimizing Next.js Performance\n\nPerformance is crucial for user experience and SEO. Next.js provides many built-in optimizations, but there's always more we can do.\n\n## Image Optimization\n\nNext.js Image component automatically optimizes images:\n\n\`\`\`javascript\nimport Image from 'next/image';\n\nfunction MyComponent() {\n  return (\n    <Image\n      src="/hero.jpg"\n      alt="Blog hero section featuring abstract technology background"\n      width={800}\n      height={600}\n      priority\n    />\n  );\n}\n\`\`\`\n\n## Code Splitting\n\nUse dynamic imports for code splitting:\n\n\`\`\`javascript\nimport dynamic from 'next/dynamic';\n\nconst DynamicComponent = dynamic(() => import('../components/Heavy'), {\n  loading: () => <p>Loading...</p>,\n});\n\`\`\`\n\n## Conclusion\n\nPerformance optimization is an ongoing process. Monitor your Core Web Vitals and continuously improve.`,
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

/**
 * Instructions for manual migration
 */
function showMigrationInstructions() {
  console.log(`
📋 LocalStorage to Supabase Migration Instructions

This script helps you migrate your existing blog posts from localStorage to Supabase.

STEP 1: EXPORT YOUR POSTS
-----------------------------
Run: exportLocalStoragePosts()
This will download a JSON file with all your posts.

STEP 2: SET UP SUPABASE
------------------------
1. Go to supabase.com
2. Create a new project (or use existing)
3. Run the SQL from: /supabase/migrations/001_initial_schema.sql
4. Create a 'blog-images' storage bucket (public)
5. Create an admin user in Authentication
6. Copy your project URL and keys

STEP 3: ADD ENVIRONMENT VARIABLES
---------------------------------
Add to your .env.local:
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

STEP 4: RUN MIGRATION SCRIPT
-----------------------------
1. Ensure you're authenticated in Supabase
2. Run: npx tsx scripts/migrate-to-supabase.ts
3. Verify posts in Supabase dashboard

AVAILABLE FUNCTIONS
--------------------
- exportLocalStoragePosts()  : Export posts to JSON file
- reviewLocalStoragePosts()   : Review posts in console
- showMigrationInstructions() : Show these instructions

READY TO START?
----------------
Run: exportLocalStoragePosts()
  `);
}

// Auto-show instructions on load
showMigrationInstructions();

// Make functions available globally
window.exportLocalStoragePosts = exportLocalStoragePosts;
window.reviewLocalStoragePosts = reviewLocalStoragePosts;
window.showMigrationInstructions = showMigrationInstructions;
