/**
 * Blog Post Category Types
 */
export type BlogPostCategory = 'technical' | 'career' | 'tutorial' | 'thoughts';

/**
 * Blog Post Status Types
 */
export type BlogPostStatus = 'draft' | 'published' | 'archived';

/**
 * Blog Post Filters for queries
 */
export interface BlogPostFilters {
  tag?: string;
  category?: BlogPostCategory;
  search?: string;
  limit?: number;
  offset?: number;
  authorId?: string;
}

/**
 * Blog Post DTO (Data Transfer Object)
 * This is the main interface used throughout the application
 */
export interface BlogPostDto {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: any; // TipTap JSON format
  author: {
    id: string;
    name: string;
    avatar: string | null;
  };
  coverImage: string | null;
  tags: TagDto[];
  category: BlogPostCategory;
  status: BlogPostStatus;
  featured: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  readTime: number;
  viewCount: number;
}

/**
 * Create Blog Post Input
 */
export interface CreateBlogPostInput {
  title: string;
  excerpt?: string;
  content: any;
  tags?: string[];
  status?: BlogPostStatus;
  category?: BlogPostCategory;
  featured?: boolean;
  coverImageUrl?: string;
}

/**
 * Update Blog Post Input
 */
export interface UpdateBlogPostInput {
  title?: string;
  excerpt?: string;
  content?: string;
  tags?: string[];
  status?: BlogPostStatus;
  category?: BlogPostCategory;
  featured?: boolean;
  coverImageUrl?: string;
}

/**
 * Tag DTO
 */
export interface TagDto {
  id: string;
  name: string;
  slug: string;
  color: string;
}

/**
 * Media/Upload Result
 */
export interface MediaDto {
  id: string;
  url: string;
  path: string;
  filename: string;
  size: number;
  mimeType: string;
  altText?: string;
}

/**
 * Author Statistics
 */
export interface AuthorStats {
  total: number;
  published: number;
  drafts: number;
  featured: number;
}
