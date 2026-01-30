'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UploadService, UploadOptions, MultipleUploadResult } from '@/lib/services/upload.service';
import { MediaDto } from '@/lib/types/blog-types';
import { toast } from 'sonner';

/**
 * Query keys for upload-related queries
 */
export const uploadKeys = {
  all: ['upload'] as const,
  postMedia: (postId: string) => [...uploadKeys.all, 'post', postId] as const,
  userMedia: (userId: string) => [...uploadKeys.all, 'user', userId] as const,
} as const;

/**
 * Hook for uploading a single image
 */
export function useUploadImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ file, uploaderId, options }: { file: File; uploaderId: string; options?: UploadOptions }) => {
      const service = new UploadService(null as any);
      return await service.uploadImage(file, uploaderId, options);
    },
    onSuccess: (_data, variables) => {
      // Invalidate relevant queries
      if (variables.options?.postId) {
        queryClient.invalidateQueries({ queryKey: uploadKeys.postMedia(variables.options.postId) });
      }
      queryClient.invalidateQueries({ queryKey: uploadKeys.userMedia(variables.uploaderId) });

      toast.success('Image uploaded successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to upload image: ${error.message}`);
    },
  });
}

/**
 * Hook for uploading multiple images
 */
export function useUploadImages() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ files, uploaderId, options }: { files: File[]; uploaderId: string; options?: UploadOptions }) => {
      const service = new UploadService(null as any);
      return await service.uploadImages(files, uploaderId, options);
    },
    onSuccess: (result: MultipleUploadResult, variables) => {
      // Invalidate relevant queries
      if (variables.options?.postId) {
        queryClient.invalidateQueries({ queryKey: uploadKeys.postMedia(variables.options.postId) });
      }
      queryClient.invalidateQueries({ queryKey: uploadKeys.userMedia(variables.uploaderId) });

      if (result.successCount > 0) {
        toast.success(`${result.successCount} image${result.successCount > 1 ? 's' : ''} uploaded successfully`);
      }
      if (result.failedCount > 0) {
        toast.error(`${result.failedCount} image${result.failedCount > 1 ? 's' : ''} failed to upload`);
      }
    },
    onError: (error: Error) => {
      toast.error(`Failed to upload images: ${error.message}`);
    },
  });
}

/**
 * Hook for uploading a cover image
 */
export function useUploadCoverImage() {
  return useMutation({
    mutationFn: async ({ file, uploaderId, postId }: { file: File; uploaderId: string; postId?: string }) => {
      const service = new UploadService(null as any);
      return await service.uploadCoverImage(file, uploaderId, postId);
    },
    onSuccess: () => {
      toast.success('Cover image uploaded successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to upload cover image: ${error.message}`);
    },
  });
}

/**
 * Hook for deleting media
 */
export function useDeleteMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ mediaId, folder }: { mediaId: string; folder?: string }) => {
      const service = new UploadService(null as any);
      return await service.deleteMedia(mediaId, folder);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: uploadKeys.all });
      toast.success('Media deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete media: ${error.message}`);
    },
  });
}

/**
 * Hook for deleting multiple media files
 */
export function useDeleteMediaMultiple() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ mediaIds, folder }: { mediaIds: string[]; folder?: string }) => {
      const service = new UploadService(null as any);
      return await service.deleteMediaMultiple(mediaIds, folder);
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: uploadKeys.all });

      if (result.deleted > 0) {
        toast.success(`${result.deleted} media file${result.deleted > 1 ? 's' : ''} deleted`);
      }
      if (result.failed > 0) {
        toast.error(`${result.failed} file${result.failed > 1 ? 's' : ''} failed to delete`);
      }
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete media: ${error.message}`);
    },
  });
}

/**
 * Hook for fetching post media
 */
export function usePostMedia(postId: string) {
  return useQuery({
    queryKey: uploadKeys.postMedia(postId),
    queryFn: async (): Promise<MediaDto[]> => {
      const service = new UploadService(null as any);
      return await service.getPostMedia(postId);
    },
    enabled: !!postId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook for fetching user media
 */
export function useUserMedia(userId: string) {
  return useQuery({
    queryKey: uploadKeys.userMedia(userId),
    queryFn: async (): Promise<MediaDto[]> => {
      const service = new UploadService(null as any);
      return await service.getUserMedia(userId);
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook for updating media metadata
 */
export function useUpdateMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ mediaId, updates }: { mediaId: string; updates: { altText?: string; postId?: string } }) => {
      const service = new UploadService(null as any);
      return await service.updateMedia(mediaId, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: uploadKeys.all });
      toast.success('Media updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update media: ${error.message}`);
    },
  });
}
