import { BaseRepository } from './base-repository';
import { SupabaseClient } from '@supabase/supabase-js';
import { MediaDto } from '@/lib/types/blog-types';

/**
 * Database row type for media table
 */
interface MediaRow {
  id: string;
  filename: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  uploader_id: string;
  post_id: string | null;
  alt_text: string | null;
  created_at: string;
}

/**
 * Upload result from Supabase Storage
 */
export interface UploadResult {
  path: string;
  fullPath: string;
  url: string;
}

/**
 * Media Repository
 *
 * Handles all database operations for media and file uploads
 */
export class MediaRepository extends BaseRepository<MediaRow> {
  constructor(client: SupabaseClient) {
    super(client, 'media');
  }

  /**
   * Upload file to Supabase Storage
   *
   * @param file - The file to upload
   * @param uploaderId - ID of the user uploading the file
   * @param folder - Storage folder name (default: 'blog-images')
   * @returns Upload result with public URL
   */
  async uploadFile(
    file: File,
    uploaderId: string,
    folder = 'blog-images'
  ): Promise<UploadResult> {
    // Validate file
    this.validateFile(file);

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${uploaderId}/${fileName}`;

    const { data, error } = await this.client.storage
      .from(folder)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = this.client.storage
      .from(folder)
      .getPublicUrl(data.path);

    return {
      path: data.path,
      fullPath: data.fullPath,
      url: urlData.publicUrl,
    };
  }

  /**
   * Upload multiple files
   *
   * @param files - Array of files to upload
   * @param uploaderId - ID of the user uploading the files
   * @param folder - Storage folder name
   * @returns Array of upload results
   */
  async uploadFiles(
    files: File[],
    uploaderId: string,
    folder = 'blog-images'
  ): Promise<UploadResult[]> {
    const results: UploadResult[] = [];

    for (const file of files) {
      try {
        const result = await this.uploadFile(file, uploaderId, folder);
        results.push(result);
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
        // Continue with other files
      }
    }

    return results;
  }

  /**
   * Create media record in database after upload
   *
   * @param uploadResult - Result from uploadFile()
   * @param file - Original file that was uploaded
   * @param uploaderId - ID of the user who uploaded
   * @param postId - Optional post ID to associate with
   * @param altText - Optional alt text for accessibility
   * @returns Created media record
   */
  async createMediaRecord(
    uploadResult: UploadResult,
    file: File,
    uploaderId: string,
    postId?: string,
    altText?: string
  ): Promise<MediaDto> {
    const mediaRecord: Partial<MediaRow> = {
      filename: file.name,
      file_path: uploadResult.path,
      file_size: file.size,
      mime_type: file.type,
      uploader_id: uploaderId,
      post_id: postId || null,
      alt_text: altText || null,
    };

    const created = await this.create(mediaRecord);
    return this.transformToDto(created, uploadResult.url);
  }

  /**
   * Upload file and create database record in one operation
   *
   * @param file - The file to upload
   * @param uploaderId - ID of the user uploading
   * @param options - Optional parameters (postId, altText, folder)
   * @returns Media DTO with public URL
   */
  async uploadAndCreate(
    file: File,
    uploaderId: string,
    options?: {
      postId?: string;
      altText?: string;
      folder?: string;
    }
  ): Promise<MediaDto> {
    const uploadResult = await this.uploadFile(
      file,
      uploaderId,
      options?.folder || 'blog-images'
    );

    return await this.createMediaRecord(
      uploadResult,
      file,
      uploaderId,
      options?.postId,
      options?.altText
    );
  }

  /**
   * Delete file from storage and database
   *
   * @param id - Media record ID
   * @param folder - Storage folder name
   */
  async deleteMedia(id: string, folder = 'blog-images'): Promise<void> {
    // Get media record first
    const media = await this.findById(id);
    if (!media) throw new Error('Media not found');

    // Delete from storage
    const { error: storageError } = await this.client.storage
      .from(folder)
      .remove([media.file_path]);

    if (storageError) {
      console.error('Storage delete error:', storageError);
    }

    // Delete from database
    await this.delete(id);
  }

  /**
   * Delete multiple media files
   *
   * @param ids - Array of media record IDs
   * @param folder - Storage folder name
   */
  async deleteMediaMultiple(ids: string[], folder = 'blog-images'): Promise<void> {
    for (const id of ids) {
      try {
        await this.deleteMedia(id, folder);
      } catch (error) {
        console.error(`Failed to delete media ${id}:`, error);
      }
    }
  }

  /**
   * Get media by post
   *
   * @param postId - Post ID
   * @returns Array of media DTOs
   */
  async findByPost(postId: string): Promise<MediaDto[]> {
    const { data, error } = await this.client
      .from('media')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: false });

    if (error) throw this.handleError(error);

    return (data || []).map(m => this.transformToDtoWithUrl(m));
  }

  /**
   * Get media by uploader
   *
   * @param uploaderId - User ID
   * @returns Array of media DTOs
   */
  async findByUploader(uploaderId: string): Promise<MediaDto[]> {
    const { data, error } = await this.client
      .from('media')
      .select('*')
      .eq('uploader_id', uploaderId)
      .order('created_at', { ascending: false });

    if (error) throw this.handleError(error);

    return (data || []).map(m => this.transformToDtoWithUrl(m));
  }

  /**
   * Update media record
   *
   * @param id - Media record ID
   * @param updates - Fields to update
   * @returns Updated media DTO
   */
  async updateMedia(
    id: string,
    updates: { altText?: string }
  ): Promise<MediaDto> {
    const updateData: Partial<MediaRow> = {};

    if (updates.altText !== undefined) {
      updateData.alt_text = updates.altText;
    }

    const updated = await this.update(id, updateData);
    return this.transformToDtoWithUrl(updated);
  }

  /**
   * Validate file before upload
   *
   * @param file - File to validate
   * @throws Error if validation fails
   */
  private validateFile(file: File): void {
    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error(`File size exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit`);
    }

    // Check file type
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg+xml',
    ];

    if (!allowedTypes.includes(file.type)) {
      throw new Error(`File type ${file.type} is not allowed`);
    }
  }

  /**
   * Transform database row to DTO with URL
   *
   * @param data - Database row
   * @returns Media DTO with public URL
   */
  private transformToDtoWithUrl(data: MediaRow): MediaDto {
    const url = this.client.storage
      .from('blog-images')
      .getPublicUrl(data.file_path).data.publicUrl;

    return this.transformToDto(data, url);
  }

  /**
   * Transform database row to DTO
   *
   * @param data - Database row
   * @param url - Optional public URL (will be generated if not provided)
   * @returns Media DTO
   */
  private transformToDto(data: MediaRow, url?: string): MediaDto {
    const publicUrl = url || this.client.storage
      .from('blog-images')
      .getPublicUrl(data.file_path).data.publicUrl;

    return {
      id: data.id,
      url: publicUrl,
      path: data.file_path,
      filename: data.filename,
      size: data.file_size,
      mimeType: data.mime_type,
      altText: data.alt_text || undefined,
    };
  }

  /**
   * Format file size for display
   *
   * @param bytes - File size in bytes
   * @returns Formatted string (e.g., "1.5 MB")
   */
  formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  /**
   * Get file extension from filename
   *
   * @param filename - File name
   * @returns File extension (e.g., "jpg")
   */
  getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || '';
  }

  /**
   * Check if file is an image
   *
   * @param mimeType - MIME type
   * @returns True if image
   */
  isImage(mimeType: string): boolean {
    return mimeType.startsWith('image/');
  }

  /**
   * Check if file is a video
   *
   * @param mimeType - MIME type
   * @returns True if video
   */
  isVideo(mimeType: string): boolean {
    return mimeType.startsWith('video/');
  }
}
