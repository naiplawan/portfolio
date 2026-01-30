import { MediaRepository } from '@/lib/repositories/media-repository';
import { MediaDto } from '@/lib/types/blog-types';
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Upload options
 */
export interface UploadOptions {
  postId?: string;
  altText?: string;
  folder?: string;
  maxSize?: number; // in bytes
  allowedTypes?: string[];
}

/**
 * Multiple upload result
 */
export interface MultipleUploadResult {
  successful: MediaDto[];
  failed: Array<{ file: string; error: string }>;
  total: number;
  successCount: number;
  failedCount: number;
}

/**
 * Upload Service
 *
 * Handles file uploads with validation and business logic
 */
export class UploadService {
  constructor(private readonly mediaRepo: MediaRepository) {}

  /**
   * Upload single image with validation
   *
   * @param file - File to upload
   * @param uploaderId - User ID of the uploader
   * @param options - Upload options
   * @returns Uploaded media DTO
   */
  async uploadImage(
    file: File,
    uploaderId: string,
    options: UploadOptions = {}
  ): Promise<MediaDto> {
    // Validate file
    this.validateFile(file, options);

    try {
      // Upload and create database record
      const media = await this.mediaRepo.uploadAndCreate(
        file,
        uploaderId,
        {
          postId: options.postId,
          altText: options.altText,
          folder: options.folder || 'blog-images',
        }
      );

      return media;
    } catch (error) {
      throw new Error(
        `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Upload multiple images
   *
   * @param files - Files to upload
   * @param uploaderId - User ID of the uploader
   * @param options - Upload options (applied to all files)
   * @returns Upload result with successful and failed uploads
   */
  async uploadImages(
    files: File[],
    uploaderId: string,
    options: UploadOptions = {}
  ): Promise<MultipleUploadResult> {
    const results = await Promise.allSettled(
      files.map(file => this.uploadImage(file, uploaderId, options))
    );

    const successful: MediaDto[] = [];
    const failed: Array<{ file: string; error: string }> = [];

    for (const result of results) {
      if (result.status === 'fulfilled') {
        successful.push(result.value);
      } else {
        failed.push({
          file: 'unknown',
          error: result.reason instanceof Error ? result.reason.message : 'Unknown error',
        });
      }
    }

    return {
      successful,
      failed,
      total: files.length,
      successCount: successful.length,
      failedCount: failed.length,
    };
  }

  /**
   * Upload cover image for a blog post
   *
   * @param file - Cover image file
   * @param uploaderId - User ID of the uploader
   * @param postId - Post ID to associate with
   * @returns Public URL of uploaded image
   */
  async uploadCoverImage(
    file: File,
    uploaderId: string,
    postId?: string
  ): Promise<string> {
    const media = await this.uploadImage(file, uploaderId, {
      postId,
      folder: 'blog-covers',
      altText: `Cover image for ${postId ? 'post' : 'blog'}`,
    });

    return media.url;
  }

  /**
   * Delete media file
   *
   * @param mediaId - Media record ID
   * @param folder - Storage folder name
   */
  async deleteMedia(mediaId: string, folder = 'blog-images'): Promise<void> {
    await this.mediaRepo.deleteMedia(mediaId, folder);
  }

  /**
   * Delete multiple media files
   *
   * @param mediaIds - Array of media record IDs
   * @param folder - Storage folder name
   */
  async deleteMediaMultiple(
    mediaIds: string[],
    folder = 'blog-images'
  ): Promise<{ deleted: number; failed: number }> {
    let deleted = 0;
    let failed = 0;

    for (const id of mediaIds) {
      try {
        await this.deleteMedia(id, folder);
        deleted++;
      } catch (error) {
        console.error(`Failed to delete media ${id}:`, error);
        failed++;
      }
    }

    return { deleted, failed };
  }

  /**
   * Get media for a post
   *
   * @param postId - Post ID
   * @returns Array of media DTOs
   */
  async getPostMedia(postId: string): Promise<MediaDto[]> {
    return await this.mediaRepo.findByPost(postId);
  }

  /**
   * Get media uploaded by a user
   *
   * @param uploaderId - User ID
   * @returns Array of media DTOs
   */
  async getUserMedia(uploaderId: string): Promise<MediaDto[]> {
    return await this.mediaRepo.findByUploader(uploaderId);
  }

  /**
   * Update media metadata
   *
   * @param mediaId - Media record ID
   * @param updates - Fields to update
   * @returns Updated media DTO
   */
  async updateMedia(
    mediaId: string,
    updates: { altText?: string; postId?: string }
  ): Promise<MediaDto> {
    return await this.mediaRepo.updateMedia(mediaId, updates);
  }

  /**
   * Validate file before upload
   *
   * @param file - File to validate
   * @param options - Validation options
   * @throws Error if validation fails
   */
  private validateFile(file: File, options: UploadOptions): void {
    // Check file size
    const maxSize = options.maxSize || 5 * 1024 * 1024; // 5MB default
    if (file.size > maxSize) {
      throw new Error(
        `File size exceeds ${this.mediaRepo.formatFileSize(maxSize)} limit`
      );
    }

    // Check file type
    const allowedTypes = options.allowedTypes || [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg+xml',
    ];

    if (!allowedTypes.includes(file.type)) {
      throw new Error(`File type ${file.type} is not allowed`);
    }

    // Check if file is actually an image
    if (!this.mediaRepo.isImage(file.type)) {
      throw new Error('Only image files are allowed');
    }
  }

  /**
   * Get file size in human-readable format
   *
   * @param bytes - File size in bytes
   * @returns Formatted string
   */
  formatFileSize(bytes: number): string {
    return this.mediaRepo.formatFileSize(bytes);
  }

  /**
   * Check if file is an image
   *
   * @param file - File to check
   * @returns True if image
   */
  isImage(file: File): boolean {
    return this.mediaRepo.isImage(file.type);
  }

  /**
   * Get file extension
   *
   * @param filename - File name
   * @returns File extension
   */
  getFileExtension(filename: string): string {
    return this.mediaRepo.getFileExtension(filename);
  }
}

/**
 * Factory function to create UploadService with dependencies
 *
 * @param client - Supabase client
 * @returns UploadService instance
 */
export function createUploadService(client: SupabaseClient): UploadService {
  const mediaRepo = new MediaRepository(client);
  return new UploadService(mediaRepo);
}
