import { BaseRepository } from './base-repository';
import { SupabaseClient } from '@supabase/supabase-js';
import { TagDto } from '@/lib/types/blog-types';

/**
 * Database row type for tags table
 */
interface TagRow {
  id: string;
  name: string;
  slug: string;
  color: string;
  created_at: string;
}

/**
 * Tag Repository
 *
 * Handles all database operations for tags
 */
export class TagRepository extends BaseRepository<TagRow> {
  constructor(client: SupabaseClient) {
    super(client, 'tags');
  }

  /**
   * Find tag by slug
   */
  async findBySlug(slug: string): Promise<TagDto | null> {
    const { data, error } = await this.client
      .from('tags')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw this.handleError(error);
    }

    return this.transformToDto(data);
  }

  /**
   * Find tag by name
   */
  async findByName(name: string): Promise<TagDto | null> {
    const { data, error } = await this.client
      .from('tags')
      .select('*')
      .eq('name', name)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw this.handleError(error);
    }

    return this.transformToDto(data);
  }

  /**
   * Find or create tag by name
   */
  async findOrCreate(name: string, color?: string): Promise<TagDto> {
    // First try to find existing tag
    let tag = await this.findByName(name);

    if (!tag) {
      // Create new tag
      const slug = this.generateSlug(name);
      const newTag = await this.create({
        name,
        slug,
        color: color || '#3B82F6',
      });

      tag = this.transformToDto(newTag);
    }

    return tag;
  }

  /**
   * Get all tags
   */
  async getAll(): Promise<TagDto[]> {
    const { data, error } = await this.client
      .from('tags')
      .select('*')
      .order('name');

    if (error) throw this.handleError(error);
    return (data || []).map(this.transformToDto);
  }

  /**
   * Get all tags with post counts
   */
  async getAllWithCounts(): Promise<Array<TagDto & { postCount: number }>> {
    const { data, error } = await this.client
      .from('tags')
      .select(`
        *,
        post_tags(count)
      `)
      .order('name');

    if (error) throw this.handleError(error);

    return (data || []).map((tag: any) => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      color: tag.color,
      postCount: tag.post_tags?.[0]?.count || 0,
    }));
  }

  /**
   * Get popular tags (most used)
   */
  async getPopular(limit = 20): Promise<Array<TagDto & { postCount: number }>> {
    const { data, error } = await this.client
      .from('tags')
      .select(`
        *,
        post_tags(count)
      `)
      .order('name')
      .limit(limit);

    if (error) throw this.handleError(error);

    // Sort by post count
    const tags = (data || []).map((tag: any) => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      color: tag.color,
      postCount: tag.post_tags?.[0]?.count || 0,
    }));

    return tags.sort((a, b) => b.postCount - a.postCount);
  }

  /**
   * Get tags for a specific post
   */
  async getByPost(postId: string): Promise<TagDto[]> {
    const { data, error } = await this.client
      .from('post_tags')
      .select(`
        tag:tags(*)
      `)
      .eq('post_id', postId);

    if (error) throw this.handleError(error);

    return (data || []).map((pt: any) => this.transformToDto(pt.tag));
  }

  /**
   * Update tag
   */
  async updateTag(id: string, updates: Partial<Pick<TagDto, 'name' | 'color'>>): Promise<TagDto> {
    const updateData: Partial<TagRow> = {};

    if (updates.name) {
      updateData.name = updates.name;
      updateData.slug = this.generateSlug(updates.name);
    }
    if (updates.color) {
      updateData.color = updates.color;
    }

    const updated = await this.update(id, updateData);
    return this.transformToDto(updated);
  }

  /**
   * Delete tag (also removes all post associations)
   */
  async deleteTag(id: string): Promise<void> {
    // Delete post associations first (handled by ON DELETE CASCADE)
    await this.delete(id);
  }

  /**
   * Generate slug from name
   */
  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  /**
   * Transform database row to DTO
   */
  private transformToDto(data: TagRow): TagDto {
    return {
      id: data.id,
      name: data.name,
      slug: data.slug,
      color: data.color,
    };
  }
}
