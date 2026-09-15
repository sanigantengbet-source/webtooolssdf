import { z } from 'zod';

// Helper to normalize URLs (auto prepends https:// if protocol is omitted)
export const normalizeWebUrl = (val: unknown): string => {
  if (val === null || val === undefined) return '';
  let str = String(val).trim();
  if (!str) return '';
  if (!str.startsWith('http://') && !str.startsWith('https://') && !str.startsWith('/')) {
    str = `https://${str}`;
  }
  return str;
};

// Required website URL validator
const requiredWebsiteUrlSchema = z.preprocess(
  (val) => normalizeWebUrl(val),
  z
    .string()
    .min(1, 'Link web wajib diisi')
    .refine(
      (url) => {
        if (!url || url.trim() === '') return true; // Handled by min(1)
        try {
          const parsed = new URL(url, 'http://localhost');
          return parsed.protocol === 'https:' || parsed.protocol === 'http:' || url.startsWith('/');
        } catch {
          return false;
        }
      },
      { message: 'Link web harus berupa alamat URL yang valid (contoh: https://example.com)' }
    )
);

// URL validator ensuring only safe protocols (http/https) or optional/empty
export const safeUrlSchema = z.preprocess(
  (val) => normalizeWebUrl(val),
  z
    .string()
    .optional()
    .default('')
    .refine(
      (url) => {
        if (!url || url.trim() === '') return true;
        try {
          const parsed = new URL(url, 'http://localhost');
          return parsed.protocol === 'https:' || parsed.protocol === 'http:' || url.startsWith('/');
        } catch {
          return false;
        }
      },
      { message: 'URL harus berupa alamat web yang valid' }
    )
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
  name: z.preprocess(
    (val) => (val === null || val === undefined ? '' : String(val).trim()),
    z
      .string()
      .min(1, 'Nama tool wajib diisi')
      .max(100, 'Nama tool maksimal 100 karakter')
  ),
  slug: z.preprocess(
    (val) => (val === null || val === undefined ? '' : String(val).trim().toLowerCase()),
    z.string().optional().default('')
  ),
  short_description: z.preprocess(
    (val) => (val === null || val === undefined ? '' : String(val).trim()),
    z
      .string()
      .max(500, 'Deskripsi singkat tidak boleh melebihi 500 karakter')
      .optional()
      .default('')
  ),
  description: z.preprocess(
    (val) => (val === null || val === undefined ? '' : String(val).trim()),
    z.string().min(1, 'Deskripsi tool wajib diisi')
  ),
  website_url: requiredWebsiteUrlSchema,
  github_url: safeUrlSchema,
  documentation_url: safeUrlSchema,
  logo_url: safeUrlSchema,
  thumbnail_url: safeUrlSchema,
  status: z.preprocess(
    (val) => (val ? String(val) : 'active'),
    z.enum(['active', 'maintenance', 'coming_soon', 'archived']).optional().default('active')
  ),
  is_featured: z.preprocess(
    (val) => Boolean(val),
    z.boolean().optional().default(false)
  ),
  sort_order: z.preprocess(
    (val) => (val === undefined || val === null || val === '' ? 0 : Number(val)),
    z.number().int().optional().default(0)
  ),
  category_ids: z.preprocess(
    (val) => (Array.isArray(val) ? val : []),
    z.array(z.string()).optional().default([])
  ),
  tag_ids: z.preprocess(
    (val) => (Array.isArray(val) ? val : []),
    z.array(z.string()).optional().default([])
  ),
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
