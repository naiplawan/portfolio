# Blog CMS Deployment Guide

This guide will walk you through deploying the portfolio blog CMS with Supabase and Vercel.

## Prerequisites

- Node.js 18+ and npm/pnpm
- A Supabase account (free tier works)
- A Vercel account (free tier works)
- Git repository (GitHub, GitLab, or Bitbucket)

## Step 1: Set Up Supabase Project

### 1.1 Create a New Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click **"New Project"**
3. Enter project details:
   - **Name:** `portfolio-blog` (or your preferred name)
   - **Database Password:** Generate a strong password (save it securely!)
   - **Region:** Choose a region closest to your users
4. Click **"Create new project"**
5. Wait for the project to be provisioned (1-2 minutes)

### 1.2 Get Your Supabase Credentials

1. Go to **Project Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key
   - **service_role** key (keep this secret!)

### 1.3 Run Database Migration

1. In Supabase dashboard, go to **SQL Editor**
2. Copy and paste the entire contents of `supabase/migrations/001_initial_schema.sql`
3. Click **"Run"** to execute the migration

This will create:
- `profiles` table (user profiles)
- `blog_posts` table (blog posts with TipTap content)
- `tags` table (blog post tags)
- `post_tags` junction table (many-to-many relationship)
- `media` table (file uploads)
- `post_views` table (analytics)
- Row Level Security (RLS) policies
- Indexes for performance

### 1.4 Configure Storage (for Cover Images)

1. Go to **Storage** in the left sidebar
2. Create a new bucket:
   - **Name:** `blog-covers`
   - **Public bucket:** Toggle ON (for public access to images)
3. Create another bucket:
   - **Name:** `blog-images`
   - **Public bucket:** Toggle ON

### 1.5 Configure Storage RLS Policies

Run these SQL commands in the SQL Editor:

```sql
-- Allow public access to blog-covers bucket
CREATE POLICY "Public Access Blog Covers"
ON storage.objects FOR SELECT
TO anon
USING (bucket_id = 'blog-covers');

CREATE POLICY "Public Upload Blog Covers"
ON storage.objects FOR INSERT
TO anon
WITH CHECK (bucket_id = 'blog-covers');

CREATE POLICY "Public Update Blog Covers"
ON storage.objects FOR UPDATE
TO anon
WITH CHECK (bucket_id = 'blog-covers');

-- Allow public access to blog-images bucket
CREATE POLICY "Public Access Blog Images"
ON storage.objects FOR SELECT
TO anon
USING (bucket_id = 'blog-images');

CREATE POLICY "Public Upload Blog Images"
ON storage.objects FOR INSERT
TO anon
WITH CHECK (bucket_id = 'blog-images');

CREATE POLICY "Public Update Blog Images"
ON storage.objects FOR UPDATE
TO anon
WITH CHECK (bucket_id = 'blog-images');
```

## Step 2: Configure Environment Variables

### 2.1 Create `.env.local` File

Create a new file `.env.local` in the project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

Replace the placeholder values with your actual Supabase credentials.

### 2.2 Verify `.env.local` is in `.gitignore`

The `.gitignore` should include `.env.local` to prevent committing secrets. Verify it's there:

```bash
grep ".env.local" .gitignore
```

If not found, add it:

```bash
echo ".env.local" >> .gitignore
echo ".env*.local" >> .gitignore
```

## Step 3: Deploy to Vercel

### 3.1 Install Vercel CLI (Optional)

```bash
npm install -g vercel
```

### 3.2 Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Import your Git repository:
   - Connect your GitHub/GitLab/Bitbucket account
   - Select the portfolio repository
   - Click **"Import"**
4. Configure project settings:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./`
   - **Build Command:** `npm run build` (or `pnpm build` if using pnpm)
   - **Output Directory:** `.next`
5. **Environment Variables:**
   - Add your Supabase environment variables:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`
6. Click **"Deploy"**

### 3.3 Wait for Deployment

Vercel will build and deploy your application. This typically takes 1-2 minutes.

Once deployed, you'll get a URL like: `https://your-project.vercel.app`

## Step 4: Post-Deployment Configuration

### 4.1 Test the Application

1. Visit your deployed Vercel URL
2. Navigate to `/blog/manage`
3. You should see the login page (no posts yet)

### 4.2 Create Your First User

1. Click **"Sign Up"** on the login page
2. Enter your email and password
3. You'll receive a confirmation email (check spam folder)
4. Click the confirmation link to verify your account

### 4.3 Enable Auth Provider (if needed)

If auto-confirmation doesn't work, in Supabase dashboard:

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Under **Email Templates**, you can customize the confirmation email
4. **Important:** Enable **Email Confirmations** toggle if you want email verification

### 4.4 Create Your First Blog Post

1. After logging in, you'll see the blog management dashboard
2. Click **"New Post"**
3. Fill in the details:
   - **Title:** Your blog post title
   - **Excerpt:** Brief summary (shows on listing page)
   - **Content:** Write your post using the TipTap editor
   - **Tags:** Add tags (e.g., "React", "TypeScript", "Tutorial")
   - **Category:** Choose a category
   - **Featured:** Toggle for featured posts
   - **Cover Image:** Upload a cover image
4. Click **"Save as Draft"** or **"Publish"**

### 4.5 View Your Blog

1. Navigate to `/blog`
2. You should see your published post(s)
3. Click on a post to view the full content

## Step 5: Customization

### 5.1 Update Site Metadata

Edit `app/layout.tsx` to update:

```typescript
export const metadata = {
  metadataBase: new URL('https://your-domain.vercel.app'),
  title: {
    default: 'Your Name - Fullstack Developer',
    template: '%s | Your Name'
  },
  // ... other metadata
};
```

### 5.2 Update Profile Information

Your user profile is automatically created when you sign up. To add a bio or avatar:

1. In Supabase dashboard, go to **Table Editor**
2. Select the `profiles` table
3. Find your user row
4. Update:
   - `full_name`: Your display name
   - `bio`: Short bio about yourself
   - `avatar_url`: URL to your avatar image

### 5.3 Customize the Editor

The TipTap editor can be customized in `components/blog/editor/editor-extensions.ts`:

- Add/remove formatting options
- Change toolbar styling
- Add custom extensions
- Configure syntax highlighting for code blocks

### 5.4 Styling

The blog uses Tailwind CSS and shadcn/ui components. You can customize:

- **Colors:** Edit `tailwind.config.ts`
- **Components:** Modify files in `components/ui/`
- **Layout:** Edit `app/layout.tsx` and page components

## Troubleshooting

### Build Errors

**Error: "Cannot find module '@supabase/supabase-js'"**
```bash
npm install @supabase/supabase-js @supabase/ssr
```

**Error: "Type errors"**
```bash
npm run build
```
Fix any TypeScript errors shown.

### Runtime Errors

**Error: "Invalid API Key"**
- Verify your `.env.local` has the correct Supabase credentials
- Restart the dev server after updating env vars

**Error: "Row level security policy violated"**
- Make sure you've run the database migration
- Check RLS policies in Supabase dashboard

### Authentication Issues

**Email not being sent**
- Check Email Templates in Supabase dashboard
- Make sure Email provider is enabled
- Try resending the confirmation email

**Can't log in**
- Verify user is created in Supabase dashboard (Authentication → Users)
- Check if email is confirmed
- Try resetting password

### Images Not Uploading

**Storage errors**
- Verify storage buckets are created
- Check RLS policies on storage buckets
- Make sure bucket is public

**CORS errors**
- Add your Vercel domain to Supabase allowed origins:
  - Go to **Project Settings** → **API** → **CORS**
  - Add your domain: `https://your-domain.vercel.app`

## Performance Optimization

### Database Indexes

The migration file includes essential indexes. For high-traffic sites, consider:

```sql
-- Add index for published posts with featured status
CREATE INDEX IF NOT EXISTS idx_published_featured
ON public.blog_posts(status, featured)
WHERE status = 'published';

-- Add index for recent posts
CREATE INDEX IF NOT EXISTS idx_recent_posts
ON public.blog_posts(published_at DESC)
WHERE status = 'published';
```

### Caching

React Query is configured with 5-minute stale time. For production:

- Consider using ISR (Incremental Static Regeneration) for blog pages
- Enable Supabase Edge Functions for global distribution
- Use CDN for static assets

## Maintenance

### Regular Backups

Supabase automatically backs up your database. Configure additional backups in:

**Project Settings** → **Database** → **Backups**

### Monitoring

- Use Supabase dashboard to monitor database usage
- Check Vercel Analytics for site performance
- Monitor error rates with error tracking (e.g., Sentry)

## Next Steps

After deployment:

1. **Test thoroughly** - Create posts, edit, delete, test all features
2. **Set up analytics** - Add Google Analytics or Plausible
3. **SEO optimization** - Add sitemap, robots.txt, meta tags
4. **Performance** - Run Lighthouse audits and optimize
5. **Security** - Regular dependency updates, security audits

## Support

If you encounter issues:

1. Check the [Supabase Documentation](https://supabase.com/docs)
2. Check the [Next.js Documentation](https://nextjs.org/docs)
3. Review the code in this repository
4. Open an issue on GitHub

---

**Congratulations!** Your blog CMS is now live! 🎉
