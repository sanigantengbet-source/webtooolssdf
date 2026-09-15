import { z } from 'zod';

// URL validator ensuring only safe protocols (http/https) or optional/empty
const safeUrlSchema = z
  .string()
  .trim()
  .optional()
  .or(z.literal(''))
  .refine(
    (url) => {
      if (!url || url.trim() === '') return true;
      try {
        const testUrl =
          url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/')
            ? url
            : `https://${url}`;
        const parsed = new URL(testUrl, 'http://localhost');
        return (
          parsed.protocol === 'https:' ||
          parsed.protocol === 'http:' ||
          url.startsWith('/')
        );
      } catch {
        return false;
      }
    },
    { message: 'URL must be a valid web address' }
  );

export const passwordPolicySchema = z
  .string()
  .min(6, 'Password must be at least 6 characters long');

export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username cannot exceed 50 characters'),
  password: z.string().min(1, 'Password is required'),
});

export const toolSchema = z.object({
  name: z
    .string()
    .trim()
    .max(100, 'Tool name must not exceed 100 characters')
    .optional()
    .default(''),
  slug: z
    .string()
    .trim()
    .max(100, 'Slug must not exceed 100 characters')
    .optional()
    .default(''),
  short_description: z
    .string()
    .trim()
    .max(500, 'Short description cannot exceed 500 characters')
    .optional()
    .default(''),
  description: z.string().trim().optional().default(''),
  website_url: safeUrlSchema.optional().default(''),
  github_url: safeUrlSchema.optional().default(''),
  documentation_url: safeUrlSchema.optional().default(''),
  logo_url: safeUrlSchema.optional().default(''),
  thumbnail_url: safeUrlSchema.optional().default(''),
  status: z
    .enum(['active', 'maintenance', 'coming_soon', 'archived'])
    .optional()
    .default('active'),
  is_featured: z.boolean().optional().default(false),
  sort_order: z.coerce.number().int().optional().default(0),
  category_ids: z.array(z.string()).optional().default([]),
  tag_ids: z.array(z.string()).optional().default([]),
});

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Category name must be at least 2 characters')
    .max(60, 'Category name cannot exceed 60 characters'),
  slug: z
    .string()
    .trim()
    .min(2, 'Slug must be at least 2 characters')
    .max(60, 'Slug cannot exceed 60 characters')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric and hyphens only'),
  description: z.string().trim().max(300, 'Description cannot exceed 300 characters').optional().default(''),
});

export const tagSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Tag name must be at least 1 character')
    .max(50, 'Tag name cannot exceed 50 characters'),
  slug: z
    .string()
    .trim()
    .min(1, 'Slug must be at least 1 character')
    .max(50, 'Slug cannot exceed 50 characters')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric and hyphens only'),
});

export const updateCredentialsSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(3, 'Username must be at least 3 characters')
      .max(50, 'Username cannot exceed 50 characters'),
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordPolicySchema.optional().or(z.literal('')),
    confirmPassword: z.string().optional().or(z.literal('')),
  })
  .refine(
    (data) => {
      if (data.newPassword && data.newPassword.length > 0) {
        return data.newPassword === data.confirmPassword;
      }
      return true;
    },
    {
      message: 'New password and confirmation do not match',
      path: ['confirmPassword'],
    }
  );
