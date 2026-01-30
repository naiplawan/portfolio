/**
 * Zod Validation Schemas for Blog CMS
 *
 * Provides comprehensive validation for blog-related forms
 */

import { z } from 'zod';

/**
 * Blog Post Categories
 */
export const blogPostCategories = ['technical', 'career', 'tutorial', 'thoughts'] as const;
export type BlogPostCategory = typeof blogPostCategories[number];

/**
 * Blog Post Statuses
 */
export const blogPostStatuses = ['draft', 'published', 'archived'] as const;
export type BlogPostStatus = typeof blogPostStatuses[number];

/**
 * Tag Schema
 */
export const tagSchema = z.object({
  id: z.string().uuid(),
  name: z.string()
    .min(1, 'Tag name is required')
    .max(50, 'Tag name must be 50 characters or less')
    .regex(/^[a-z0-9-]+$/, 'Tag name must contain only lowercase letters, numbers, and hyphens'),
  slug: z.string()
    .min(1, 'Tag slug is required')
    .max(50, 'Tag slug must be 50 characters or less')
    .regex(/^[a-z0-9-]+$/, 'Tag slug must contain only lowercase letters, numbers, and hyphens'),
  color: z.string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex color')
    .optional(),
});

/**
 * Create Tag Schema (for input)
 */
export const createTagSchema = z.object({
  name: z.string()
    .min(1, 'Tag name is required')
    .max(50, 'Tag name must be 50 characters or less')
    .regex(/^[a-z0-9-]+$/, 'Tag name must contain only lowercase letters, numbers, and hyphens'),
  color: z.string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex color')
    .optional(),
});

/**
 * Create Blog Post Schema
 */
export const createBlogPostSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters long')
    .max(200, 'Title must be 200 characters or less')
    .trim(),
  excerpt: z.string()
    .max(500, 'Excerpt must be 500 characters or less')
    .optional(),
  content: z.object({
    type: z.literal('doc'),
    content: z.array(z.any()).min(1, 'Content cannot be empty'),
  })
  .refine((data) => {
    // Check if content has actual text content (not just empty nodes)
    const hasContent = data.content.some((node: any) => {
      if (node.type === 'text' && node.content?.trim()) return true;
      if (node.type === 'paragraph' || node.type === 'heading') {
        return node.content?.some((child: any) => {
          if (typeof child === 'string' && child.trim()) return true;
          if (child?.text?.trim()) return true;
          return false;
        }) ?? false;
      }
      return false;
    });
    return hasContent;
  }, 'Content must contain at least some text'),
  tags: z.array(z.string()).min(1, 'At least one tag is required').max(10, 'Maximum 10 tags allowed'),
  status: z.enum(blogPostStatuses).default('draft'),
  category: z.enum(blogPostCategories).default('technical'),
  featured: z.boolean().default(false),
  coverImageUrl: z.string().url('Cover image must be a valid URL').optional().or(z.literal('')),
});

/**
 * Update Blog Post Schema
 */
export const updateBlogPostSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters long')
    .max(200, 'Title must be 200 characters or less')
    .trim()
    .optional(),
  excerpt: z.string()
    .max(500, 'Excerpt must be 500 characters or less')
    .optional(),
  content: z.object({
    type: z.literal('doc'),
    content: z.array(z.any()),
  })
  .optional(),
  tags: z.array(z.string()).min(1, 'At least one tag is required').max(10, 'Maximum 10 tags allowed').optional(),
  status: z.enum(blogPostStatuses).optional(),
  category: z.enum(blogPostCategories).optional(),
  featured: z.boolean().optional(),
  coverImageUrl: z.string().url('Cover image must be a valid URL').optional().or(z.literal('')),
});

/**
 * Blog Post Filters Schema
 */
export const blogPostFiltersSchema = z.object({
  tag: z.string().optional(),
  category: z.enum(blogPostCategories).optional(),
  search: z.string().max(100, 'Search query too long').optional(),
  limit: z.number().int().positive().max(100).default(20),
  offset: z.number().int().nonnegative().default(0),
  authorId: z.string().uuid().optional(),
});

/**
 * Auth Sign In Schema
 */
export const signInSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password is too long'),
});

/**
 * Auth Sign Up Schema
 */
export const signUpSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password is too long')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one lowercase letter, one uppercase letter, and one number'
    ),
  fullName: z.string()
    .min(1, 'Full name is required')
    .max(100, 'Full name is too long')
    .optional(),
});

/**
 * Auth Update Profile Schema
 */
export const updateProfileSchema = z.object({
  fullName: z.string()
    .min(1, 'Full name is required')
    .max(100, 'Full name is too long')
    .optional(),
  avatarUrl: z.string()
    .url('Invalid avatar URL')
    .optional(),
  bio: z.string()
    .max(500, 'Bio must be 500 characters or less')
    .optional(),
});

/**
 * Upload Cover Image Schema
 */
export const uploadCoverImageSchema = z.object({
  file: z.instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, 'File size must be 5MB or less')
    .refine((file) => ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type), {
      message: 'File must be a valid image (JPEG, PNG, WebP, or GIF)',
    }),
  postId: z.string().uuid().optional(),
});

/**
 * Delete Post Schema
 */
export const deletePostSchema = z.object({
  postId: z.string().uuid('Invalid post ID'),
  confirm: z.boolean().refine((val) => val === true, {
    message: 'You must confirm deletion',
  }),
});

/**
 * Slug Schema
 */
export const slugSchema = z.string()
  .min(1, 'Slug cannot be empty')
  .max(200, 'Slug is too long')
  .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens')
  .trim();

/**
 * Extract validation errors from ZodError
 */
export function extractValidationErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};

  error.issues.forEach((err) => {
    const path = err.path.join('.');
    errors[path] = err.message;
  });

  return errors;
}

/**
 * Type inference from schemas
 */
export type CreateTagInput = z.infer<typeof createTagSchema>;
export type CreateBlogPostInput = z.infer<typeof createBlogPostSchema>;
export type UpdateBlogPostInput = z.infer<typeof updateBlogPostSchema>;
export type BlogPostFilters = z.infer<typeof blogPostFiltersSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UploadCoverImageInput = z.infer<typeof uploadCoverImageSchema>;
export type DeletePostInput = z.infer<typeof deletePostSchema>;
