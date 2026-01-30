/**
 * Migration Script: LocalStorage to Supabase
 *
 * This script migrates existing blog posts from localStorage to Supabase database
 * It converts Markdown content to TipTap JSON format
 *
 * Usage:
 * 1. Set up your Supabase project and run the schema migration
 * 2. Add environment variables to .env.local
 * 3. Run: npx tsx scripts/migrate-to-supabase.ts
 */

import { createClient } from '@supabase/supabase-js';
import { BlogPost } from '../lib/blog';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role for admin operations

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Default blog posts from localStorage
 */
const DEFAULT_BLOG_POSTS: BlogPost[] = [
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

/**
 * Convert Markdown to TipTap JSON format
 * This is a simplified converter - for production use a proper markdown parser
 */
function markdownToTipTap(markdown: string): any {
  // Split into lines
  const lines = markdown.split('\n');
  const content: any[] = [];

  let inCodeBlock = false;
  let codeLanguage = '';
  let codeContent = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code block detection
    if (line.startsWith('```')) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeLanguage = line.slice(3).trim();
        codeContent = '';
      } else {
        // End code block
        content.push({
          type: 'codeBlock',
          content: codeContent.trim(),
          attrs: { language: codeLanguage || 'text' }
        });
        inCodeBlock = false;
        codeContent = '';
      }
      continue;
    }

    if (inCodeBlock) {
      codeContent += line + '\n';
      continue;
    }

    // Headers
    if (line.startsWith('#')) {
      const level = line.match(/^#+/)?.[0].length || 1;
      const text = line.replace(/^#+\s*/, '');
      content.push({
        type: 'heading',
        attrs: { level },
        content: [{ type: 'text', text }]
      });
      continue;
    }

    // Horizontal rule
    if (line.match(/^---+$/)) {
      content.push({
        type: 'horizontalRule',
      });
      continue;
    }

    // Lists
    if (line.match(/^\s*[-*]\s+/)) {
      const text = line.replace(/^\s*[-*]\s+/, '');
      content.push({
        type: 'bulletList',
        content: [{
          type: 'listItem',
          content: [{
            type: 'paragraph',
            content: [{ type: 'text', text }]
          }]
        }]
      });
      continue;
    }

    // Numbered lists
    if (line.match(/^\s*\d+\.\s+/)) {
      const text = line.replace(/^\s*\d+\.\s+/, '');
      content.push({
        type: 'orderedList',
        content: [{
          type: 'listItem',
          content: [{
            type: 'paragraph',
            content: [{ type: 'text', text }]
          }]
        }]
      });
      continue;
    }

    // Blockquotes
    if (line.startsWith('>')) {
      const text = line.replace(/^>\s*/, '');
      content.push({
        type: 'blockquote',
        content: [{
          type: 'paragraph',
          content: [{ type: 'text', text }]
        }]
      });
      continue;
    }

    // Regular paragraph
    if (line.trim()) {
      // Handle inline code
      const inlineCodeRegex = /`([^`]+)`/g;
      const textNode: any = {
        type: 'paragraph',
        content: []
      };

      let lastIndex = 0;
      let match;
      while ((match = inlineCodeRegex.exec(line)) !== null) {
        // Add text before code
        if (match.index > lastIndex) {
          const text = line.slice(lastIndex, match.index);
          textNode.content.push({ type: 'text', text });
        }
        // Add code
        textNode.content.push({
          type: 'text',
          marks: [{ type: 'code' }],
          text: match[1]
        });
        lastIndex = inlineCodeRegex.lastIndex;
      }
      // Add remaining text
      if (lastIndex < line.length) {
        textNode.content.push({ type: 'text', text: line.slice(lastIndex) });
      }

      content.push(textNode);
    }
  }

  return {
    type: 'doc',
    content
  };
}

/**
 * Get or create author profile
 */
async function getOrCreateAuthor(authorName: string, authorEmail: string) {
  // First, try to find existing user by email
  const { data: existingUser } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', authorEmail)
    .single();

  if (existingUser) {
    return existingUser;
  }

  // Create a new user (this requires admin privileges)
  // For now, we'll use a placeholder author ID
  console.warn(`Author ${authorName} (${authorEmail}) not found in profiles table`);
  console.warn('Please create this user in Supabase Auth first');
  console.warn('Using a placeholder author ID for migration...');

  // Try to get any existing admin user
  const { data: adminUser } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'admin')
    .limit(1)
    .single();

  if (adminUser) {
    return adminUser;
  }

  throw new Error('No admin user found. Please create a user in Supabase Auth first.');
}

/**
 * Migrate a single blog post
 */
async function migratePost(post: BlogPost, authorId: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Convert markdown to TipTap JSON
    const content = markdownToTipTap(post.content);

    // Create post
    const { data: newPost, error: postError } = await supabase
      .from('blog_posts')
      .insert({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content,
        author_id: authorId,
        status: post.status,
        featured: post.featured,
        category: 'technical', // Default category
        read_time: post.readTime,
        published_at: post.publishedAt,
        created_at: post.publishedAt, // Use publishedAt as created_at for old posts
        updated_at: post.updatedAt,
      })
      .select('id')
      .single();

    if (postError) throw postError;

    // Handle tags
    if (post.tags && post.tags.length > 0) {
      for (const tagName of post.tags) {
        // Find or create tag
        const tagSlug = tagName.toLowerCase().replace(/\s+/g, '-');

        let { data: tag } = await supabase
          .from('tags')
          .select('*')
          .eq('slug', tagSlug)
          .single();

        if (!tag) {
          const { data: newTag } = await supabase
            .from('tags')
            .insert({ name: tagName, slug: tagSlug })
            .select('*')
            .single();
          tag = newTag;
        }

        // Associate tag with post
        if (tag && newPost) {
          await supabase
            .from('post_tags')
            .upsert({
              post_id: newPost.id,
              tag_id: tag.id,
            }, { onConflict: 'post_id,tag_id' });
        }
      }
    }

    console.log(`✅ Migrated: "${post.title}"`);
    return { success: true };
  } catch (error) {
    console.error(`❌ Failed to migrate "${post.title}":`, error);
    return { success: true, error: String(error) };
  }
}

/**
 * Main migration function
 */
async function migrate() {
  console.log('🚀 Starting migration from localStorage to Supabase...\n');

  // Get author info
  const authorName = DEFAULT_BLOG_POSTS[0]?.author || 'Rachaphol Naiplawan';
  const authorEmail = 'admin@portfolio.com'; // Default admin email

  console.log(`📝 Getting author profile for: ${authorName}`);
  const author = await getOrCreateAuthor(authorName, authorEmail);
  console.log(`✅ Using author: ${author.full_name || author.email}\n`);

  // Migrate each post
  const results = [];
  for (const post of DEFAULT_BLOG_POSTS) {
    const result = await migratePost(post, author.id);
    results.push({ post: post.title, ...result });
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Migration Summary:');
  console.log('='.repeat(50));
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  console.log(`Total posts: ${results.length}`);
  console.log(`✅ Successful: ${successful.length}`);
  console.log(`❌ Failed: ${failed.length}`);

  if (failed.length > 0) {
    console.log('\nFailed posts:');
    failed.forEach(f => console.log(`  - ${f.post}: ${f.error}`));
  }

  console.log('\n✨ Migration complete!');
  console.log('\nNext steps:');
  console.log('1. Verify posts in Supabase database');
  console.log('2. Update your blog pages to use Supabase data');
  console.log('3. Test the blog listing and detail pages');
}

// Run migration
migrate().catch(console.error);
