export type ToolStatus = 'active' | 'maintenance' | 'coming_soon' | 'archived';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  tool_count?: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at?: string;
  tool_count?: number;
}

export interface Tool {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  logo_url?: string;
  thumbnail_url?: string;
  website_url: string;
  github_url?: string;
  documentation_url?: string;
  status: ToolStatus;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  categories?: Category[];
  tags?: Tag[];
}

export interface ToolCategoryJunction {
  tool_id: string;
  category_id: string;
}

export interface ToolTagJunction {
  tool_id: string;
  tag_id: string;
}

export interface AdminProfile {
  id: string;
  username: string;
  role: 'admin' | 'member';
  must_change_password: boolean;
  created_at: string;
  updated_at: string;
}

export type AuditAction =
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILED'
  | 'LOGOUT'
  | 'CREATE_TOOL'
  | 'UPDATE_TOOL'
  | 'DELETE_TOOL'
  | 'CREATE_CATEGORY'
  | 'UPDATE_CATEGORY'
  | 'DELETE_CATEGORY'
  | 'CREATE_TAG'
  | 'UPDATE_TAG'
  | 'DELETE_TAG'
  | 'CHANGE_USERNAME'
  | 'CHANGE_PASSWORD'
  | 'UPLOAD_ASSET'
  | 'DELETE_ASSET'
  | 'BOOTSTRAP_ADMIN';

export interface AuditLog {
  id: string;
  admin_id: string | null;
  action: AuditAction;
  target_type: string;
  target_id?: string;
  metadata?: Record<string, unknown>;
  ip_hash?: string;
  client_ip?: string;
  created_at: string;
}

export interface LoginAttempt {
  id: string;
  username: string;
  ip_hash: string;
  success: boolean;
  created_at: string;
}

export interface DashboardStats {
  totalTools: number;
  activeTools: number;
  maintenanceTools: number;
  comingSoonTools: number;
  archivedTools: number;
  totalCategories: number;
  totalTags: number;
  featuredTools: number;
}
