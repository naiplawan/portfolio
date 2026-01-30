/**
 * React Hooks - Barrel Exports
 *
 * Exports all custom hooks for easy importing
 */

// Blog posts hooks
export {
  useBlogPosts,
  useBlogPost,
  useBlogPostById,
  useFeaturedPosts,
  useAuthorPosts,
  useAuthorStats,
  useCreatePost,
  useUpdatePost,
  useDeletePost,
  useTags,
  usePopularTags,
  useSearchPosts,
  useRelatedPosts,
  blogKeys,
} from './use-blog-posts';

// Upload hooks
export {
  useUploadImage,
  useUploadImages,
  useUploadCoverImage,
  useDeleteMedia,
  useDeleteMediaMultiple,
  usePostMedia,
  useUserMedia,
  useUpdateMedia,
  uploadKeys,
} from './use-upload';

// Auth hooks
export {
  useSupabaseAuth,
  useCurrentUser,
  useCurrentSession,
  authKeys,
} from './use-auth';
