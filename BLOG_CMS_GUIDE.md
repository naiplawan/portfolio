# Blog CMS Quick Reference

## Common Tasks

### Create a Blog Post

1. Navigate to `/blog/manage`
2. Click **"New Post"**
3. Fill in:
   - **Title:** Post title
   - **Excerpt:** Brief summary
   - **Content:** Use TipTap editor to write your post
   - **Tags:** Add relevant tags
   - **Category:** Select category
   - **Cover Image:** Upload cover image (optional)
4. Click **"Save as Draft"** or **"Publish"**

### Edit a Blog Post

1. Go to `/blog/manage`
2. Find the post you want to edit
3. Click the **Edit** button (pencil icon)
4. Make your changes
5. Click **"Save"**

### Delete a Blog Post

1. Go to `/blog/manage`
2. Find the post you want to delete
3. Click the **Delete** button (trash icon)
4. Confirm deletion

### View Blog Analytics

The admin dashboard shows:
- Total posts
- Published posts
- Draft posts
- Featured posts

## TipTap Editor Guide

The TipTap editor supports:

### Text Formatting
- **Bold:** `Ctrl+B` or click **B** icon
- **Italic:** `Ctrl+I` or click **I** icon
- **Strikethrough:** Click **S** icon
- **Code:** `Ctrl+E` or click **</>** icon

### Headings
- **H1:** Click **H1** icon
- **H2:** Click **H2** icon
- **H3:** Click **H3** icon

### Lists
- **Bullet List:** Click list icon
- **Numbered List:** Click numbered list icon

### Other Elements
- **Blockquote:** Click quote icon
- **Code Block:** Click `</>` icon
- **Link:** Click link icon
- **Image:** Click image icon or drag & drop

### Keyboard Shortcuts
- `Ctrl+B`: Bold
- `Ctrl+I`: Italic
- `Ctrl+E`: Code
- `Ctrl+Z`: Undo
- `Ctrl+Y` or `Ctrl+Shift+Z`: Redo

## Database Schema Reference

### Tables

#### `profiles`
- `id`: UUID (primary key)
- `email`: User email
- `full_name`: Display name
- `avatar_url`: Avatar image URL
- `bio`: User biography
- `role`: User role (admin/author/viewer)

#### `blog_posts`
- `id`: UUID (primary key)
- `slug`: URL-friendly unique identifier
- `title`: Post title
- `excerpt`: Post summary
- `content`: TipTap JSON content
- `cover_image_url`: Cover image URL
- `author_id`: Foreign key to profiles
- `status`: 'draft' | 'published' | 'archived'
- `category`: Post category
- `featured`: Boolean flag
- `published_at`: Publication date
- `view_count`: View counter
- `read_time`: Estimated read time (minutes)

#### `tags`
- `id`: UUID (primary key)
- `name`: Tag name
- `slug`: URL-friendly tag identifier
- `color`: Tag color (hex)

#### `post_tags`
- Junction table for blog_posts ↔ tags relationship

## Environment Variables

Required variables in `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Useful Commands

### Development
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run linter
```

### Database
```bash
# Run migration (via Supabase SQL Editor)
# Copy contents of: supabase/migrations/001_initial_schema.sql
```

### Git
```bash
git add .
git commit -m "Your message"
git push origin main
```

## Troubleshooting

### Build Fails
1. Clear cache: `rm -rf .next`
2. Reinstall: `rm -rf node_modules && npm install`
3. Rebuild: `npm run build`

### Supabase Connection Error
1. Check `.env.local` has correct values
2. Verify Supabase project is active
3. Check network/firewall settings

### Auth Not Working
1. Check Auth is enabled in Supabase
2. Verify email confirmation settings
3. Check user exists in Supabase dashboard

### Images Not Uploading
1. Verify storage buckets are created
2. Check RLS policies on buckets
3. Ensure buckets are public

## API Reference

### Blog Hooks (from `@/lib/hooks`)

```typescript
// Fetch blog posts
const { data: posts, isLoading } = useBlogPosts({ limit: 10 });

// Fetch single post
const { data: post } = useBlogPost('post-slug');

// Fetch featured posts
const { data: featured } = useFeaturedPosts(5);

// Fetch user's posts
const { data: myPosts } = useAuthorPosts(userId, true);

// Create post
const { mutate: createPost } = useCreatePost();

// Update post
const { mutate: updatePost } = useUpdatePost();

// Delete post
const { mutate: deletePost } = useDeletePost();
```

### Auth Hooks

```typescript
// Get auth state
const { user, session, loading, signIn, signUp, signOut } = useSupabaseAuth();

// Check if authenticated
const isAuthenticated = !!user;
```

## Styling Guide

### Components Used

- **shadcn/ui:** Pre-built accessible components
- **Tailwind CSS:** Utility-first CSS
- **Framer Motion:** Animation library

### Customizing Styles

1. **Colors:** Edit `tailwind.config.ts`
2. **Components:** Modify files in `components/ui/`
3. **Layout:** Edit `app/layout.tsx`

### Editor Styling

The TipTap editor styles are in `components/blog/editor/TipTapEditor.tsx`:

```css
/* Editor prose styling */
.ProseMirror p { margin-bottom: 1em; }
.ProseMirror h1 { font-size: 2em; }
/* ... more styles */
```

## SEO Best Practices

1. **Meta Tags:** Each blog post has meta tags for SEO
2. **Sitemap:** Automatically generated at `/sitemap.xml`
3. **Robots.txt:** Configure in `public/robots.txt`
4. **Open Graph:** Social media sharing cards
5. **Structured Data:** JSON-LD schema in layout

## Performance Tips

1. **Images:** Optimize cover images before uploading
2. **Content:** Keep TipTap content concise
3. **Caching:** React Query caches for 5 minutes
4. **CDN:** Vercel provides automatic CDN
5. **Database:** Supabase provides built-in caching

## Security Checklist

- ✅ Row Level Security (RLS) enabled
- ✅ Service role key never exposed to client
- ✅ Email confirmation required
- ✅ Protected routes for admin operations
- ✅ Input validation on all forms
- ✅ XSS protection (TipTap sanitizes content)
- ✅ SQL injection protection (Supabase prepared statements)

## Support

- **Documentation:** See `DEPLOYMENT.md` for detailed setup
- **Issues:** Open an issue on GitHub
- **Supabase:** https://supabase.com/docs
- **Next.js:** https://nextjs.org/docs

---

**Happy Blogging!** 📝
