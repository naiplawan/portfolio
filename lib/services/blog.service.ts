import {
  BlogPostFilters,
  BlogPostDto,
  CreateBlogPostInput,
  UpdateBlogPostInput,
  AuthorStats,
} from '@/lib/types/blog-types';
import { BlogPostRepository } from '@/lib/repositories/blog-post-repository';
import { TagRepository } from '@/lib/repositories/tag-repository';
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Blog Service
 *
 * Contains business logic for blog operations
 * Coordinates between repositories to handle complex operations
 */
export class BlogService {
  constructor(
    private readonly blogPostRepo: BlogPostRepository,
    private readonly tagRepo: TagRepository
  ) {}

  /**
   * Get published posts with business logic
   *
   * @param filters - Query filters
   * @returns Array of published blog posts
   */
  async getPublishedPosts(filters: BlogPostFilters = {}): Promise<BlogPostDto[]> {
    const posts = await this.blogPostRepo.findPublished(filters);

    // Business logic: Add any computed fields or transformations here
    return posts;
  }

  /**
   * Get featured posts
   *
   * @param limit - Maximum number of posts to return
   * @returns Array of featured posts
   */
  async getFeaturedPosts(limit = 5): Promise<BlogPostDto[]> {
    return await this.blogPostRepo.findFeatured(limit);
  }

  /**
   * Get single post by slug
   *
   * @param slug - Post slug
   * @returns Blog post or null if not found
   */
  async getPostBySlug(slug: string): Promise<BlogPostDto | null> {
    const post = await this.blogPostRepo.findBySlug(slug);

    if (post) {
      // Increment view count asynchronously (don't await)
      this.blogPostRepo.incrementViewCount(post.id).catch(console.error);
    }

    return post;
  }

  /**
   * Get single post by ID
   *
   * @param id - Post ID
   * @returns Blog post or null if not found
   */
  async getPostById(id: string): Promise<BlogPostDto | null> {
    return await this.blogPostRepo.findByIdWithRelations(id);
  }

  /**
   * Get all posts for an author (admin view)
   *
   * @param authorId - Author's user ID
   * @param includeDrafts - Whether to include draft posts
   * @returns Array of author's posts
   */
  async getAuthorPosts(
    authorId: string,
    includeDrafts = true
  ): Promise<BlogPostDto[]> {
    return await this.blogPostRepo.findByAuthor(authorId, includeDrafts);
  }

  /**
   * Create new blog post
   *
   * @param input - Post data
   * @param authorId - Author's user ID
   * @returns Created blog post
   * @throws Error if validation fails
   */
  async createPost(
    input: CreateBlogPostInput,
    authorId: string
  ): Promise<BlogPostDto> {
    // Validate input
    this.validatePostInput(input);

    // Handle tags - find or create
    const tagNames = input.tags || [];

    // Create post with tags
    const post = await this.blogPostRepo.createWithTags(
      input,
      authorId,
      tagNames
    );

    return post;
  }

  /**
   * Update blog post
   *
   * @param id - Post ID
   * @param input - Updated post data
   * @param authorId - Author's user ID (for permission check)
   * @returns Updated blog post
   * @throws Error if validation fails or permission denied
   */
  async updatePost(
    id: string,
    input: UpdateBlogPostInput,
    authorId: string
  ): Promise<BlogPostDto> {
    // Validate input
    if (input.title) {
      if (!input.title.trim()) {
        throw new Error('Title is required');
      }
      if (input.title.length > 200) {
        throw new Error('Title must be less than 200 characters');
      }
    }

    if (input.excerpt && input.excerpt.length > 500) {
      throw new Error('Excerpt must be less than 500 characters');
    }

    // Update post
    const post = await this.blogPostRepo.updateWithTags(id, input, authorId);

    return post;
  }

  /**
   * Delete blog post
   *
   * @param id - Post ID
   * @param authorId - Author's user ID (for permission check)
   * @throws Error if permission denied
   */
  async deletePost(id: string, authorId: string): Promise<void> {
    await this.blogPostRepo.deletePost(id, authorId);
  }

  /**
   * Get author statistics
   *
   * @param authorId - Author's user ID
   * @returns Author statistics
   */
  async getAuthorStats(authorId: string): Promise<AuthorStats> {
    return await this.blogPostRepo.getStats(authorId);
  }

  /**
   * Get all tags
   *
   * @returns Array of all tags
   */
  async getAllTags(): Promise<Array<{ id: string; name: string; slug: string; color: string; postCount?: number }>> {
    return await this.tagRepo.getAllWithCounts();
  }

  /**
   * Get popular tags
   *
   * @param limit - Maximum number of tags to return
   * @returns Array of popular tags with post counts
   */
  async getPopularTags(limit = 20): Promise<Array<{ id: string; name: string; slug: string; color: string; postCount: number }>> {
    return await this.tagRepo.getPopular(limit);
  }

  /**
   * Get posts by tag
   *
   * @param tagSlug - Tag slug
   * @param limit - Maximum number of posts to return
   * @returns Array of posts with the specified tag
   */
  async getPostsByTag(tagSlug: string, limit = 20): Promise<BlogPostDto[]> {
    // Get all published posts
    const posts = await this.blogPostRepo.findPublished({ limit });

    // Filter by tag
    return posts.filter(post =>
      post.tags.some(tag => tag.slug === tagSlug)
    );
  }

  /**
   * Search posts
   *
   * @param searchTerm - Search query
   * @param limit - Maximum number of results
   * @returns Array of matching posts
   */
  async searchPosts(searchTerm: string, limit = 20): Promise<BlogPostDto[]> {
    return await this.blogPostRepo.findPublished({
      search: searchTerm,
      limit,
    });
  }

  /**
   * Get related posts (posts with same tags)
   *
   * @param postId - Current post ID
   * @param limit - Maximum number of related posts
   * @returns Array of related posts
   */
  async getRelatedPosts(postId: string, limit = 4): Promise<BlogPostDto[]> {
    const post = await this.getPostById(postId);
    if (!post) return [];

    const tagSlugs = post.tags.map(t => t.slug);

    // Get all published posts
    const allPosts = await this.blogPostRepo.findPublished();

    // Find posts with matching tags (excluding current post)
    const related = allPosts
      .filter(p => p.id !== postId)
      .map(p => ({
        post: p,
        matchingTags: p.tags.filter(t => tagSlugs.includes(t.slug)).length,
      }))
      .filter(p => p.matchingTags > 0)
      .sort((a, b) => b.matchingTags - a.matchingTags)
      .slice(0, limit)
      .map(p => p.post);

    return related;
  }

  /**
   * Validate post input
   *
   * @param input - Post input data
   * @throws Error if validation fails
   */
  private validatePostInput(input: CreateBlogPostInput): void {
    if (!input.title?.trim()) {
      throw new Error('Title is required');
    }
    if (!input.content) {
      throw new Error('Content is required');
    }
    if (input.title.length > 200) {
      throw new Error('Title must be less than 200 characters');
    }
    if (input.excerpt && input.excerpt.length > 500) {
      throw new Error('Excerpt must be less than 500 characters');
    }
  }
}

/**
 * Factory function to create BlogService with dependencies
 *
 * @param client - Supabase client
 * @returns BlogService instance
 */
export function createBlogService(client: SupabaseClient): BlogService {
  const blogPostRepo = new BlogPostRepository(client);
  const tagRepo = new TagRepository(client);

  return new BlogService(blogPostRepo, tagRepo);
}
