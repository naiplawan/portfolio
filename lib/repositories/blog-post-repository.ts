import { BaseRepository } from './base-repository';
import { SupabaseClient } from '@supabase/supabase-js';
import {
  BlogPostFilters,
  BlogPostDto,
  CreateBlogPostInput,
  UpdateBlogPostInput,
  AuthorStats,
  BlogPostStatus,
  BlogPostCategory,
} from '@/lib/types/blog-types';
import { generateSlug } from '@/lib/utils/slug-utils';
import { calculateReadTimeFromTipTap } from '@/lib/utils/read-time-utils';

/**
 * Database row types for blog_posts table
 */
interface BlogPostRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: any; // TipTap JSON
  cover_image_url: string | null;
  author_id: string;
  status: BlogPostStatus;
  category: BlogPostCategory;
  featured: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  view_count: number;
  read_time: number;
}

/**
 * Blog post with relations (author, tags)
 */
interface BlogPostWithRelations extends BlogPostRow {
  tags: Array<{ tag: { id: string; name: string; slug: string; color: string } }>;
  author: { id: string; full_name: string | null; avatar_url: string | null };
}

/**
 * Blog Post Repository
 *
 * Handles all database operations for blog posts
 * Extends BaseRepository for common CRUD operations
 */
export class BlogPostRepository extends BaseRepository<BlogPostRow> {
  constructor(client: SupabaseClient) {
    super(client, 'blog_posts');
  }

  /**
   * Find post by slug with relations
   */
  async findBySlug(slug: string): Promise<BlogPostDto | null> {
    const { data, error } = await this.client
      .from('blog_posts')
      .select(`
        *,
        tags:post_tags(
          tag:tags(id, name, slug, color)
        ),
        author:profiles(id, full_name, avatar_url)
      `)
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw this.handleError(error);
    }

    return this.transformToDto(data as BlogPostWithRelations);
  }

  /**
   * Find post by ID with relations
   */
  async findByIdWithRelations(id: string): Promise<BlogPostDto | null> {
    const { data, error } = await this.client
      .from('blog_posts')
      .select(`
        *,
        tags:post_tags(
          tag:tags(id, name, slug, color)
        ),
        author:profiles(id, full_name, avatar_url)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw this.handleError(error);
    }

    return this.transformToDto(data as BlogPostWithRelations);
  }

  /**
   * Get published posts with filters
   */
  async findPublished(filters: BlogPostFilters = {}): Promise<BlogPostDto[]> {
    const { tag, category, search, limit = 50, offset = 0 } = filters;

    let query = this.client
      .from('blog_posts')
      .select(`
        *,
        tags:post_tags(
          tag:tags(id, name, slug, color)
        ),
        author:profiles(id, full_name, avatar_url)
      `, { count: 'exact' })
      .eq('status', 'published');

    // Apply filters
    if (category) {
      query = query.eq('category', category);
    }
    if (search) {
      query = query.textSearch('title', search);
    }

    query = query
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error } = await query;

    if (error) throw this.handleError(error);

    let posts = (data || []).map(this.transformToDto);

    // Filter by tag after fetching (PostgreSQL limitation with junction tables)
    if (tag) {
      posts = posts.filter(post =>
        post.tags.some(t => t.slug === tag)
      );
    }

    return posts;
  }

  /**
   * Get all posts for a specific author (admin view)
   */
  async findByAuthor(
    authorId: string,
    includeDrafts = true
  ): Promise<BlogPostDto[]> {
    let query = this.client
      .from('blog_posts')
      .select(`
        *,
        tags:post_tags(
          tag:tags(id, name, slug, color)
        ),
        author:profiles(id, full_name, avatar_url)
      `)
      .eq('author_id', authorId);

    if (!includeDrafts) {
      query = query.eq('status', 'published');
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) throw this.handleError(error);

    return (data || []).map(this.transformToDto);
  }

  /**
   * Get featured posts
   */
  async findFeatured(limit = 5): Promise<BlogPostDto[]> {
    const { data, error } = await this.client
      .from('blog_posts')
      .select(`
        *,
        tags:post_tags(
          tag:tags(id, name, slug, color)
        ),
        author:profiles(id, full_name, avatar_url)
      `)
      .eq('status', 'published')
      .eq('featured', true)
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) throw this.handleError(error);

    return (data || []).map(this.transformToDto);
  }

  /**
   * Create post with tags
   */
  async createWithTags(
    post: CreateBlogPostInput,
    authorId: string,
    tagNames: string[] = []
  ): Promise<BlogPostDto> {
    // Generate slug from title
    const slug = await this.generateUniqueSlug(post.title);

    // Calculate read time
    const readTime = calculateReadTimeFromTipTap(post.content);

    // Prepare post data
    const postData: Partial<BlogPostRow> = {
      title: post.title,
      slug,
      excerpt: post.excerpt || null,
      content: post.content,
      author_id: authorId,
      status: post.status || 'draft',
      category: post.category || 'technical',
      featured: post.featured || false,
      cover_image_url: post.coverImageUrl || null,
      read_time: readTime,
      published_at: post.status === 'published' ? new Date().toISOString() : null,
    };

    // Create post
    const { data: postDataResult, error: postError } = await this.client
      .from('blog_posts')
      .insert(postData)
      .select()
      .single();

    if (postError) throw this.handleError(postError);

    // Handle tags
    if (tagNames.length > 0) {
      await this.associateTags(postDataResult.id, tagNames);
    }

    // Fetch and return complete post
    const created = await this.findByIdWithRelations(postDataResult.id);
    if (!created) throw new Error('Failed to fetch created post');
    return created;
  }

  /**
   * Update post with tags
   */
  async updateWithTags(
    id: string,
    updates: UpdateBlogPostInput,
    authorId: string
  ): Promise<BlogPostDto> {
    // Verify ownership
    const existing = await this.findByIdWithRelations(id);
    if (!existing) throw new Error('Post not found');
    if (existing.author.id !== authorId) {
      throw new Error('You do not have permission to update this post');
    }

    // Prepare updates
    const updateData: Partial<BlogPostRow> = {};

    if (updates.title) updateData.title = updates.title;
    if (updates.excerpt !== undefined) updateData.excerpt = updates.excerpt;
    if (updates.content) {
      updateData.content = updates.content;
      updateData.read_time = calculateReadTimeFromTipTap(updates.content);
    }
    if (updates.status) {
      updateData.status = updates.status;
      // Set published_at if publishing for the first time
      if (updates.status === 'published' && !existing.publishedAt) {
        updateData.published_at = new Date().toISOString();
      }
    }
    if (updates.category) updateData.category = updates.category;
    if (updates.featured !== undefined) updateData.featured = updates.featured;
    if (updates.coverImageUrl !== undefined) {
      updateData.cover_image_url = updates.coverImageUrl;
    }

    // Update slug if title changed
    if (updates.title) {
      updateData.slug = await this.generateUniqueSlug(updates.title, id);
    }

    // Update post
    const { error: updateError } = await this.client
      .from('blog_posts')
      .update(updateData)
      .eq('id', id);

    if (updateError) throw this.handleError(updateError);

    // Update tags if provided
    if (updates.tags !== undefined) {
      // Delete existing tag associations
      await this.client
        .from('post_tags')
        .delete()
        .eq('post_id', id);

      // Add new tag associations
      if (updates.tags.length > 0) {
        await this.associateTags(id, updates.tags);
      }
    }

    // Fetch and return complete post
    const updated = await this.findByIdWithRelations(id);
    if (!updated) throw new Error('Failed to fetch updated post');
    return updated;
  }

  /**
   * Delete post (verify ownership first)
   */
  async deletePost(id: string, authorId: string): Promise<void> {
    // Verify ownership
    const existing = await this.findByIdWithRelations(id);
    if (!existing) throw new Error('Post not found');
    if (existing.author.id !== authorId) {
      throw new Error('You do not have permission to delete this post');
    }

    await this.delete(id);
  }

  /**
   * Get posts statistics for an author
   */
  async getStats(authorId: string): Promise<AuthorStats> {
    const { data, error } = await this.client
      .from('blog_posts')
      .select('status, featured')
      .eq('author_id', authorId);

    if (error) throw this.handleError(error);

    const stats: AuthorStats = {
      total: data?.length ?? 0,
      published: 0,
      drafts: 0,
      featured: 0,
    };

    for (const post of data || []) {
      if (post.status === 'published') stats.published++;
      if (post.status === 'draft') stats.drafts++;
      if (post.featured) stats.featured++;
    }

    return stats;
  }

  /**
   * Increment view count
   */
  async incrementViewCount(id: string): Promise<void> {
    // This is handled by trigger, but we can also do it manually if needed
    await this.client
      .from('blog_posts')
      .update({ view_count: (await this.findById(id))!.view_count + 1 } as any)
      .eq('id', id);
  }

  /**
   * Associate tags with a post
   */
  private async associateTags(postId: string, tagNames: string[]): Promise<void> {
    for (const tagName of tagNames) {
      // Find or create tag
      const tagSlug = tagName.toLowerCase().replace(/\s+/g, '-');

      let { data: tag } = await this.client
        .from('tags')
        .select()
        .eq('slug', tagSlug)
        .single();

      if (!tag) {
        const { data: newTag } = await this.client
          .from('tags')
          .insert({ name: tagName, slug: tagSlug })
          .select()
          .single();
        tag = newTag;
      }

      // Associate tag with post
      if (tag) {
        await this.client
          .from('post_tags')
          .upsert({ post_id: postId, tag_id: tag.id }, { onConflict: 'post_id,tag_id' });
      }
    }
  }

  /**
   * Generate unique slug (append number if exists)
   */
  private async generateUniqueSlug(title: string, postId?: string): Promise<string> {
    const baseSlug = generateSlug(title);
    let slug = baseSlug;
    let counter = 0;

    while (true) {
      const { data } = await this.client
        .from('blog_posts')
        .select('id,slug')
        .eq('slug', slug)
        .maybeSingle();

      if (!data || (postId && data.id === postId)) {
        return slug;
      }

      counter++;
      slug = `${baseSlug}-${counter}`;
    }
  }

  /**
   * Transform database row to DTO
   */
  private transformToDto(data: BlogPostWithRelations): BlogPostDto {
    return {
      id: data.id,
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt || '',
      content: data.content,
      author: {
        id: data.author.id,
        name: data.author.full_name || 'Anonymous',
        avatar: data.author.avatar_url,
      },
      coverImage: data.cover_image_url,
      tags: data.tags?.map((pt: any) => pt.tag) || [],
      category: data.category,
      status: data.status,
      featured: data.featured,
      publishedAt: data.published_at,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      readTime: data.read_time,
      viewCount: data.view_count || 0,
    };
  }
}
