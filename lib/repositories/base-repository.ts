import { SupabaseClient, PostgrestError } from '@supabase/supabase-js';

/**
 * Base Repository Class
 *
 * Provides common CRUD operations for all repositories
 * Implements Repository Pattern for clean data access abstraction
 */
export abstract class BaseRepository<T extends Record<string, any>> {
  constructor(
    protected readonly client: SupabaseClient,
    protected readonly tableName: string
  ) {}

  /**
   * Generic find by ID with type safety
   */
  async findById(id: string): Promise<T | null> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw this.handleError(error);
    return data;
  }

  /**
   * Find multiple records with optional filters
   */
  async findMany(
    filters?: Record<string, any>,
    options?: {
      limit?: number;
      offset?: number;
      orderBy?: { column: string; ascending?: boolean };
    }
  ): Promise<T[]> {
    let query = this.client.from(this.tableName).select('*');

    // Apply filters
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          query = query.eq(key, value);
        }
      });
    }

    // Apply pagination
    if (options?.limit) {
      const offset = options.offset || 0;
      query = query.range(offset, offset + options.limit - 1);
    }

    // Apply sorting
    if (options?.orderBy) {
      query = query.order(options.orderBy.column, {
        ascending: options.orderBy.ascending ?? false,
      });
    }

    const { data, error } = await query;

    if (error) throw this.handleError(error);
    return data || [];
  }

  /**
   * Create new record
   */
  async create(record: Partial<T>): Promise<T> {
    const { data, error } = await this.client
      .from(this.tableName)
      .insert(record)
      .select()
      .single();

    if (error) throw this.handleError(error);
    return data;
  }

  /**
   * Update record by ID
   */
  async update(id: string, updates: Partial<T>): Promise<T> {
    const { data, error } = await this.client
      .from(this.tableName)
      .update({ ...updates, updated_at: new Date().toISOString() } as any)
      .eq('id', id)
      .select()
      .single();

    if (error) throw this.handleError(error);
    return data;
  }

  /**
   * Delete record by ID
   */
  async delete(id: string): Promise<void> {
    const { error } = await this.client
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) throw this.handleError(error);
  }

  /**
   * Soft delete (update status to archived)
   */
  async softDelete(id: string): Promise<void> {
    await this.update(id, { status: 'archived' } as any);
  }

  /**
   * Count records with optional filters
   */
  async count(filters?: Record<string, any>): Promise<number> {
    let query = this.client
      .from(this.tableName)
      .select('*', { count: 'exact', head: true });

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          query = query.eq(key, value);
        }
      });
    }

    const { count, error } = await query;

    if (error) throw this.handleError(error);
    return count ?? 0;
  }

  /**
   * Check if record exists
   */
  async exists(id: string): Promise<boolean> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select('id')
      .eq('id', id)
      .single();

    return !error && !!data;
  }

  /**
   * Find records with text search
   */
  async search(searchTerm: string, column: string = 'title'): Promise<T[]> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select('*')
      .textSearch(column, searchTerm);

    if (error) throw this.handleError(error);
    return data || [];
  }

  /**
   * Standardized error handling
   * Converts Supabase errors to domain-specific errors
   */
  protected handleError(error: PostgrestError): Error {
    // Log error for monitoring
    console.error(`[Repository Error] ${this.tableName}:`, error);

    // Return domain-specific errors
    if (error.code === '23505') {
      return new Error('A record with this value already exists');
    }
    if (error.code === '23503') {
      return new Error('Referenced record does not exist');
    }
    if (error.code === '42501') {
      return new Error('You do not have permission to perform this action');
    }
    if (error.code === 'PGRST116') {
      return new Error('Record not found');
    }

    return new Error(error.message);
  }
}
