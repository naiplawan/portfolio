-- =====================================================
-- SUPABASE DATABASE SCHEMA FOR BLOG CMS
-- =====================================================
-- Run this in Supabase SQL Editor to set up your database
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PROFILES TABLE (extends Supabase auth.users)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'author' CHECK (role IN ('admin', 'author', 'viewer')),
  bio TEXT,
  website TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- BLOG POSTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content JSONB NOT NULL, -- TipTap JSON format
  cover_image_url TEXT,
  author_id UUID REFERENCES public.profiles ON DELETE SET NULL NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  category TEXT DEFAULT 'technical' CHECK (category IN ('technical', 'career', 'tutorial', 'thoughts')),
  featured BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  view_count INTEGER DEFAULT 0,
  read_time INTEGER DEFAULT 5
);

-- =====================================================
-- TAGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.tags (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  color TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- POST_TAGS JUNCTION TABLE (Many-to-Many)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.post_tags (
  post_id UUID REFERENCES public.blog_posts ON DELETE CASCADE NOT NULL,
  tag_id UUID REFERENCES public.tags ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (post_id, tag_id)
);

-- =====================================================
-- MEDIA TABLE (File Upload Tracking)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.media (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  filename TEXT NOT NULL,
  file_path TEXT UNIQUE NOT NULL, -- Supabase Storage path
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  uploader_id UUID REFERENCES public.profiles ON DELETE SET NULL NOT NULL,
  post_id UUID REFERENCES public.blog_posts ON DELETE SET NULL,
  alt_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ANALYTICS TABLE (Optional - for views tracking)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.post_views (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID REFERENCES public.blog_posts ON DELETE CASCADE,
  viewer_ip TEXT,
  viewer_user_agent TEXT,
  viewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES (Performance Optimization)
-- =====================================================

-- Blog posts indexes
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON public.blog_posts(featured) WHERE featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_blog_posts_author ON public.blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON public.blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON public.blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_search ON public.blog_posts USING gin(to_tsvector('english', title || ' ' || COALESCE(excerpt, '')));

-- Tags indexes
CREATE INDEX IF NOT EXISTS idx_post_tags_post ON public.post_tags(post_id);
CREATE INDEX IF NOT EXISTS idx_post_tags_tag ON public.post_tags(tag_id);

-- Media indexes
CREATE INDEX IF NOT EXISTS idx_media_post ON public.media(post_id);
CREATE INDEX IF NOT EXISTS idx_media_uploader ON public.media(uploader_id);

-- Analytics indexes
CREATE INDEX IF NOT EXISTS idx_post_views_post ON public.post_views(post_id);

-- =====================================================
-- FUNCTIONS & TRIGGERS (Automated Workflows)
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON public.blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_view_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.blog_posts
  SET view_count = view_count + 1
  WHERE id = NEW.post_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS increment_post_view_count ON public.post_views;
CREATE TRIGGER increment_post_view_count
  AFTER INSERT ON public.post_views
  FOR EACH ROW
  EXECUTE FUNCTION increment_view_count();

-- Function to generate unique slug
CREATE OR REPLACE FUNCTION generate_unique_slug(post_title TEXT, post_id UUID DEFAULT NULL)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  base_slug := lower(regexp_replace(post_title, '[^a-zA-Z0-9\s-]', '', 'g'));
  base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
  base_slug := regexp_replace(base_slug, '-+', '-', 'g');
  base_slug := trim(both '-' from base_slug);

  final_slug := base_slug;

  WHILE EXISTS (SELECT 1 FROM public.blog_posts WHERE slug = final_slug AND (post_id IS NULL OR id != post_id)) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;

  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_views ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- BLOG POSTS POLICIES
DROP POLICY IF EXISTS "Published posts are viewable by everyone" ON public.blog_posts;
CREATE POLICY "Published posts are viewable by everyone"
  ON public.blog_posts FOR SELECT
  USING (status = 'published');

DROP POLICY IF EXISTS "Authors can view their own posts" ON public.blog_posts;
CREATE POLICY "Authors can view their own posts"
  ON public.blog_posts FOR SELECT
  USING (auth.uid() = author_id);

DROP POLICY IF EXISTS "Authors can create posts" ON public.blog_posts;
CREATE POLICY "Authors can create posts"
  ON public.blog_posts FOR INSERT
  WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Authors can update their own posts" ON public.blog_posts;
CREATE POLICY "Authors can update their own posts"
  ON public.blog_posts FOR UPDATE
  USING (auth.uid() = author_id);

DROP POLICY IF EXISTS "Authors can delete their own posts" ON public.blog_posts;
CREATE POLICY "Authors can delete their own posts"
  ON public.blog_posts FOR DELETE
  USING (auth.uid() = author_id);

DROP POLICY IF EXISTS "Admins can do anything" ON public.blog_posts;
CREATE POLICY "Admins can do anything"
  ON public.blog_posts FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- TAGS POLICIES
DROP POLICY IF EXISTS "Tags are viewable by everyone" ON public.tags;
CREATE POLICY "Tags are viewable by everyone"
  ON public.tags FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can create tags" ON public.tags;
CREATE POLICY "Authenticated users can create tags"
  ON public.tags FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- POST_TAGS POLICIES
DROP POLICY IF EXISTS "Post tags are viewable by everyone" ON public.post_tags;
CREATE POLICY "Post tags are viewable by everyone"
  ON public.post_tags FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.blog_posts
      WHERE blog_posts.id = post_tags.post_id AND blog_posts.status = 'published'
    )
  );

DROP POLICY IF EXISTS "Authors can manage their post tags" ON public.post_tags;
CREATE POLICY "Authors can manage their post tags"
  ON public.post_tags FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.blog_posts
      WHERE blog_posts.id = post_tags.post_id AND blog_posts.author_id = auth.uid()
    )
  );

-- MEDIA POLICIES
DROP POLICY IF EXISTS "Media for published posts is public" ON public.media;
CREATE POLICY "Media for published posts is public"
  ON public.media FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.blog_posts
      WHERE blog_posts.id = media.post_id AND blog_posts.status = 'published'
    )
  );

DROP POLICY IF EXISTS "Uploaders can view their own media" ON public.media;
CREATE POLICY "Uploaders can view their own media"
  ON public.media FOR SELECT
  USING (auth.uid() = uploader_id);

DROP POLICY IF EXISTS "Authenticated users can upload media" ON public.media;
CREATE POLICY "Authenticated users can upload media"
  ON public.media FOR INSERT
  WITH CHECK (auth.uid() = uploader_id);

DROP POLICY IF EXISTS "Uploaders can update their own media" ON public.media;
CREATE POLICY "Uploaders can update their own media"
  ON public.media FOR UPDATE
  USING (auth.uid() = uploader_id);

DROP POLICY IF EXISTS "Uploaders can delete their own media" ON public.media;
CREATE POLICY "Uploaders can delete their own media"
  ON public.media FOR DELETE
  USING (auth.uid() = uploader_id);

-- POST_VIEWS POLICIES
DROP POLICY IF EXISTS "Anyone can create post views" ON public.post_views;
CREATE POLICY "Anyone can create post views"
  ON public.post_views FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authors can view views for their posts" ON public.post_views;
CREATE POLICY "Authors can view views for their posts"
  ON public.post_views FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.blog_posts
      WHERE blog_posts.id = post_views.post_id AND blog_posts.author_id = auth.uid()
    )
  );

-- =====================================================
-- STORAGE BUCKETS (for file uploads)
-- =====================================================
-- Run these in Supabase Storage dashboard or uncomment to run via SQL
-- Note: Storage policies are configured in the Supabase dashboard

-- Create blog-images bucket (do this in Supabase Storage dashboard)
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('blog-images', 'blog-images', true)
-- ON CONFLICT (id) DO UPDATE SET public = true;

-- =====================================================
-- SEED DATA (Optional - for development)
-- =====================================================

-- Insert initial tags
INSERT INTO public.tags (name, slug, color) VALUES
  ('React', 'react', '#61DAFB'),
  ('Next.js', 'nextjs', '#000000'),
  ('TypeScript', 'typescript', '#3178C6'),
  ('Web Development', 'web-development', '#3B82F6'),
  ('Performance', 'performance', '#10B981'),
  ('Career', 'career', '#F59E0B'),
  ('Tutorial', 'tutorial', '#8B5CF6'),
  ('AI', 'ai', '#EC4899')
ON CONFLICT (name) DO NOTHING;
