import { z } from 'zod';

// URL validator ensuring only safe protocols (http/https)
const safeUrlSchema = z
  .string()
  .trim()
  .refine(
    (url) => {
      if (!url) return true;
      try {
        const parsed = new URL(url);
        return parsed.protocol === 'https:' || parsed.protocol === 'http:';
      } catch {
        return false;
      }
    },
    { message: 'URL must start with http:// or https://' }
  );

export const passwordPolicySchema = z
  .string()
  .min(12, 'Password must be at least 12 characters long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

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
    .min(2, 'Tool name must be at least 2 characters')
    .max(100, 'Tool name must not exceed 100 characters'),
  slug: z
    .string()
    .trim()
    .min(2, 'Slug must be at least 2 characters')
    .max(100, 'Slug must not exceed 100 characters')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric and hyphens only'),
  short_description: z
    .string()
    .trim()
    .max(255, 'Short description cannot exceed 255 characters'),
  description: z.string().trim().min(5, 'Full description is required'),
  website_url: safeUrlSchema.refine((url) => Boolean(url && url.length > 0), {
    message: 'A valid website URL is required',
  }),
  github_url: safeUrlSchema.optional().or(z.literal('')),
  documentation_url: safeUrlSchema.optional().or(z.literal('')),
  logo_url: safeUrlSchema.optional().or(z.literal('')),
  thumbnail_url: safeUrlSchema.optional().or(z.literal('')),
  status: z.enum(['active', 'maintenance', 'coming_soon', 'archived'], {
    message: 'Invalid status selected',
  }),
  is_featured: z.boolean().default(false),
  sort_order: z.coerce.number().int().default(0),
  category_ids: z.array(z.string().uuid()).default([]),
  tag_ids: z.array(z.string().uuid()).default([]),
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
