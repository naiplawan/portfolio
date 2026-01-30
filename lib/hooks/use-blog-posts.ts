'use client';

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { BlogService } from '@/lib/services/blog.service';
import {
  BlogPostDto,
  BlogPostFilters,
  CreateBlogPostInput,
  UpdateBlogPostInput,
  AuthorStats,
} from '@/lib/types/blog-types';
import { toast } from 'sonner';

/**
 * Query keys for blog-related queries
 */
export const blogKeys = {
  all: ['blog'] as const,
  posts: () => [...blogKeys.all, 'posts'] as const,
  post: (slug: string) => [...blogKeys.all, 'post', slug] as const,
  postById: (id: string) => [...blogKeys.all, 'post', id] as const,
  featured: (limit = 5) => [...blogKeys.all, 'featured', limit] as const,
  author: (authorId: string) => [...blogKeys.all, 'author', authorId] as const,
  stats: (authorId: string) => [...blogKeys.all, 'stats', authorId] as const,
  tags: () => [...blogKeys.all, 'tags'] as const,
  popularTags: (limit = 20) => [...blogKeys.all, 'tags', 'popular', limit] as const,
  search: (query: string) => [...blogKeys.all, 'search', query] as const,
  related: (postId: string) => [...blogKeys.all, 'related', postId] as const,
} as const;

/**
 * Hook for fetching published blog posts
 *
 * @param filters - Query filters
 * @param options - React Query options
 */
export function useBlogPosts(
  filters: BlogPostFilters = {},
  options?: Partial<UseQueryOptions<BlogPostDto[]>>
) {
  return useQuery({
    queryKey: [...blogKeys.posts(), filters],
    queryFn: async () => {
      const service = new BlogService(null as any, null as any);
      return await service.getPublishedPosts(filters);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

/**
 * Hook for fetching a single blog post by slug
 *
 * @param slug - Post slug
 * @param options - React Query options
 */
export function useBlogPost(
  slug: string,
  options?: Partial<UseQueryOptions<BlogPostDto | null>>
) {
  return useQuery({
    queryKey: blogKeys.post(slug),
    queryFn: async () => {
      const service = new BlogService(null as any, null as any);
      return await service.getPostBySlug(slug);
    },
    enabled: !!slug,
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
}

/**
 * Hook for fetching a single blog post by ID
 *
 * @param id - Post ID
 * @param options - React Query options
 */
export function useBlogPostById(
  id: string,
  options?: Partial<UseQueryOptions<BlogPostDto | null>>
) {
  return useQuery({
    queryKey: blogKeys.postById(id),
    queryFn: async () => {
      const service = new BlogService(null as any, null as any);
      return await service.getPostById(id);
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
    ...options,
  });
}

/**
 * Hook for fetching featured blog posts
 *
 * @param limit - Maximum number of posts
 * @param options - React Query options
 */
export function useFeaturedPosts(limit = 5, options?: Partial<UseQueryOptions<BlogPostDto[]>>) {
  return useQuery({
    queryKey: blogKeys.featured(limit),
    queryFn: async () => {
      const service = new BlogService(null as any, null as any);
      return await service.getFeaturedPosts(limit);
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
    ...options,
  });
}

/**
 * Hook for fetching author's posts (admin view)
 *
 * @param authorId - Author's user ID
 * @param includeDrafts - Whether to include drafts
 * @param options - React Query options
 */
export function useAuthorPosts(
  authorId: string,
  includeDrafts = true,
  options?: Partial<UseQueryOptions<BlogPostDto[]>>
) {
  return useQuery({
    queryKey: [...blogKeys.author(authorId), includeDrafts],
    queryFn: async () => {
      const service = new BlogService(null as any, null as any);
      return await service.getAuthorPosts(authorId, includeDrafts);
    },
    enabled: !!authorId,
    staleTime: 2 * 60 * 1000, // 2 minutes (more frequent for admin)
    ...options,
  });
}

/**
 * Hook for fetching author statistics
 *
 * @param authorId - Author's user ID
 * @param options - React Query options
 */
export function useAuthorStats(
  authorId: string,
  options?: Partial<UseQueryOptions<AuthorStats>>
) {
  return useQuery({
    queryKey: blogKeys.stats(authorId),
    queryFn: async () => {
      const service = new BlogService(null as any, null as any);
      return await service.getAuthorStats(authorId);
    },
    enabled: !!authorId,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

/**
 * Hook for creating a blog post
 */
export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ input, authorId }: { input: CreateBlogPostInput; authorId: string }) => {
      const service = new BlogService(null as any, null as any);
      return await service.createPost(input, authorId);
    },
    onSuccess: (_data, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: blogKeys.author(variables.authorId) });
      queryClient.invalidateQueries({ queryKey: blogKeys.posts() });

      toast.success('Post created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create post: ${error.message}`);
    },
  });
}

/**
 * Hook for updating a blog post
 */
export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, input, authorId }: { id: string; input: UpdateBlogPostInput; authorId: string }) => {
      const service = new BlogService(null as any, null as any);
      return await service.updatePost(id, input, authorId);
    },
    onSuccess: (_data, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: blogKeys.post(_data.slug) });
      queryClient.invalidateQueries({ queryKey: blogKeys.postById(_data.id) });
      queryClient.invalidateQueries({ queryKey: blogKeys.author(variables.authorId) });
      queryClient.invalidateQueries({ queryKey: blogKeys.posts() });

      toast.success('Post updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update post: ${error.message}`);
    },
  });
}

/**
 * Hook for deleting a blog post
 */
export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, authorId }: { id: string; authorId: string }) => {
      const service = new BlogService(null as any, null as any);
      return await service.deletePost(id, authorId);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: blogKeys.author(variables.authorId) });
      queryClient.invalidateQueries({ queryKey: blogKeys.posts() });

      toast.success('Post deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete post: ${error.message}`);
    },
  });
}

/**
 * Hook for fetching all tags
 */
export function useTags(options?: Partial<UseQueryOptions<Array<{ id: string; name: string; slug: string; color: string; postCount?: number }>>>) {
  return useQuery({
    queryKey: blogKeys.tags(),
    queryFn: async () => {
      const service = new BlogService(null as any, null as any);
      return await service.getAllTags();
    },
    staleTime: 10 * 60 * 1000,
    ...options,
  });
}

/**
 * Hook for fetching popular tags
 */
export function usePopularTags(limit = 20, options?: Partial<UseQueryOptions<Array<{ id: string; name: string; slug: string; color: string; postCount: number }>>>) {
  return useQuery({
    queryKey: blogKeys.popularTags(limit),
    queryFn: async () => {
      const service = new BlogService(null as any, null as any);
      return await service.getPopularTags(limit);
    },
    staleTime: 15 * 60 * 1000,
    ...options,
  });
}

/**
 * Hook for searching posts
 */
export function useSearchPosts(searchTerm: string, limit = 20) {
  return useQuery({
    queryKey: blogKeys.search(searchTerm),
    queryFn: async () => {
      const service = new BlogService(null as any, null as any);
      return await service.searchPosts(searchTerm, limit);
    },
    enabled: searchTerm.length > 2,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook for fetching related posts
 */
export function useRelatedPosts(postId: string, limit = 4) {
  return useQuery({
    queryKey: blogKeys.related(postId),
    queryFn: async () => {
      const service = new BlogService(null as any, null as any);
      return await service.getRelatedPosts(postId, limit);
    },
    enabled: !!postId,
    staleTime: 10 * 60 * 1000,
  });
}
