-- ============================================================================
-- TOOL COLLECTION SUPABASE DATABASE SCHEMA
-- Production-Ready SQL Schema with RLS, Triggers, Realtime, & Storage Policies
-- ============================================================================

-- 1. Enable Required Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- 2. Helper function to check if current user is an admin
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid()
    and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- 3. Automatic updated_at trigger function
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ============================================================================
-- 4. TABLE DEFINITIONS
-- ============================================================================

-- 4.1 Profiles Table (Linked to auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  role text not null default 'member' check (role in ('admin', 'member')),
  must_change_password boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4.2 Categories Table
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4.3 Tools Table
create table if not exists public.tools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  short_description text not null default '',
  description text not null default '',
  logo_url text default '',
  thumbnail_url text default '',
  website_url text not null,
  github_url text default '',
  documentation_url text default '',
  status text not null default 'active' check (status in ('active', 'maintenance', 'coming_soon', 'archived')),
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4.4 Tool Categories Junction Table
create table if not exists public.tool_categories (
  tool_id uuid not null references public.tools(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete cascade,
  primary key (tool_id, category_id)
);

-- 4.5 Tags Table
create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  slug text unique not null,
  created_at timestamptz not null default now()
);

-- 4.6 Tool Tags Junction Table
create table if not exists public.tool_tags (
  tool_id uuid not null references public.tools(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  primary key (tool_id, tag_id)
);

-- 4.7 Audit Logs Table
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references auth.users(id) on delete set null,
  action text not null,
  target_type text not null,
  target_id text default '',
  metadata jsonb default '{}'::jsonb,
  ip_hash text default '',
  created_at timestamptz not null default now()
);

-- 4.8 Login Attempts Table (Brute Force Protection)
create table if not exists public.login_attempts (
  id uuid primary key default gen_random_uuid(),
  username text not null,
  ip_hash text not null,
  success boolean not null default false,
  created_at timestamptz not null default now()
);

-- 4.9 Admin Settings Table
create table if not exists public.admin_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- 5. PERFORMANCE INDEXES
-- ============================================================================

create index if not exists idx_tools_slug on public.tools(slug);
create index if not exists idx_tools_status on public.tools(status);
create index if not exists idx_tools_is_featured on public.tools(is_featured);
create index if not exists idx_tools_updated_at on public.tools(updated_at desc);
create index if not exists idx_tools_sort_order on public.tools(sort_order asc);
create index if not exists idx_categories_slug on public.categories(slug);
create index if not exists idx_profiles_username on public.profiles(username);
create index if not exists idx_login_attempts_username on public.login_attempts(username);
create index if not exists idx_login_attempts_ip_hash on public.login_attempts(ip_hash);
create index if not exists idx_login_attempts_created_at on public.login_attempts(created_at desc);
create index if not exists idx_audit_logs_created_at on public.audit_logs(created_at desc);
create index if not exists idx_audit_logs_action on public.audit_logs(action);

-- ============================================================================
-- 6. TRIGGERS FOR UPDATED_AT
-- ============================================================================

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.handle_updated_at();

drop trigger if exists set_categories_updated_at on public.categories;
create trigger set_categories_updated_at
before update on public.categories
for each row execute function public.handle_updated_at();

drop trigger if exists set_tools_updated_at on public.tools;
create trigger set_tools_updated_at
before update on public.tools
for each row execute function public.handle_updated_at();

drop trigger if exists set_admin_settings_updated_at on public.admin_settings;
create trigger set_admin_settings_updated_at
before update on public.admin_settings
for each row execute function public.handle_updated_at();

-- ============================================================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.tools enable row level security;
alter table public.tool_categories enable row level security;
alter table public.tags enable row level security;
alter table public.tool_tags enable row level security;
alter table public.audit_logs enable row level security;
alter table public.login_attempts enable row level security;
alter table public.admin_settings enable row level security;

-- 7.1 Profiles Policies
drop policy if exists "Profiles are viewable by authenticated admins or self" on public.profiles;
create policy "Profiles are viewable by authenticated admins or self"
on public.profiles for select
using (auth.uid() = id or public.is_admin());

drop policy if exists "Profiles updateable by authenticated admins or self" on public.profiles;
create policy "Profiles updateable by authenticated admins or self"
on public.profiles for update
using (auth.uid() = id or public.is_admin());

-- 7.2 Categories Policies
-- Public can view all categories
drop policy if exists "Categories are viewable by everyone" on public.categories;
create policy "Categories are viewable by everyone"
on public.categories for select
using (true);

-- Admins can insert/update/delete categories
drop policy if exists "Admins can insert categories" on public.categories;
create policy "Admins can insert categories"
on public.categories for insert
with check (public.is_admin());

drop policy if exists "Admins can update categories" on public.categories;
create policy "Admins can update categories"
on public.categories for update
using (public.is_admin());

drop policy if exists "Admins can delete categories" on public.categories;
create policy "Admins can delete categories"
on public.categories for delete
using (public.is_admin());

-- 7.3 Tools Policies
-- Public can view non-archived tools (or all tools if active/maintenance/coming_soon)
drop policy if exists "Tools are viewable by everyone or admin" on public.tools;
create policy "Tools are viewable by everyone or admin"
on public.tools for select
using (status != 'archived' or public.is_admin());

-- Admins can insert/update/delete tools
drop policy if exists "Admins can insert tools" on public.tools;
create policy "Admins can insert tools"
on public.tools for insert
with check (public.is_admin());

drop policy if exists "Admins can update tools" on public.tools;
create policy "Admins can update tools"
on public.tools for update
using (public.is_admin());

drop policy if exists "Admins can delete tools" on public.tools;
create policy "Admins can delete tools"
on public.tools for delete
using (public.is_admin());

-- 7.4 Tool Categories Junction Policies
drop policy if exists "Tool categories viewable by everyone" on public.tool_categories;
create policy "Tool categories viewable by everyone"
on public.tool_categories for select
using (true);

drop policy if exists "Admins can manage tool categories insert" on public.tool_categories;
create policy "Admins can manage tool categories insert"
on public.tool_categories for insert
with check (public.is_admin());

drop policy if exists "Admins can manage tool categories delete" on public.tool_categories;
create policy "Admins can manage tool categories delete"
on public.tool_categories for delete
using (public.is_admin());

-- 7.5 Tags & Tool Tags Policies
drop policy if exists "Tags viewable by everyone" on public.tags;
create policy "Tags viewable by everyone"
on public.tags for select
using (true);

drop policy if exists "Admins can manage tags insert" on public.tags;
create policy "Admins can manage tags insert"
on public.tags for insert
with check (public.is_admin());

drop policy if exists "Admins can manage tags update" on public.tags;
create policy "Admins can manage tags update"
on public.tags for update
using (public.is_admin());

drop policy if exists "Admins can manage tags delete" on public.tags;
create policy "Admins can manage tags delete"
on public.tags for delete
using (public.is_admin());

drop policy if exists "Tool tags viewable by everyone" on public.tool_tags;
create policy "Tool tags viewable by everyone"
on public.tool_tags for select
using (true);

drop policy if exists "Admins can manage tool tags insert" on public.tool_tags;
create policy "Admins can manage tool tags insert"
on public.tool_tags for insert
with check (public.is_admin());

drop policy if exists "Admins can manage tool tags delete" on public.tool_tags;
create policy "Admins can manage tool tags delete"
on public.tool_tags for delete
using (public.is_admin());

-- 7.6 Audit Logs Policies (Admins only)
drop policy if exists "Audit logs viewable only by admins" on public.audit_logs;
create policy "Audit logs viewable only by admins"
on public.audit_logs for select
using (public.is_admin());

-- 7.7 Admin Settings Policies
drop policy if exists "Admin settings viewable only by admins" on public.admin_settings;
create policy "Admin settings viewable only by admins"
on public.admin_settings for select
using (public.is_admin());

drop policy if exists "Admin settings modifiable only by admins" on public.admin_settings;
create policy "Admin settings modifiable only by admins"
on public.admin_settings for all
using (public.is_admin());

-- ============================================================================
-- 8. STORAGE BUCKET & POLICIES (tool-assets)
-- ============================================================================

-- Create bucket 'tool-assets' if it does not exist
insert into storage.buckets (id, name, public)
values ('tool-assets', 'tool-assets', true)
on conflict (id) do update set public = true;

-- Bucket RLS policies
drop policy if exists "Public Access for tool-assets" on storage.objects;
create policy "Public Access for tool-assets"
on storage.objects for select
using (bucket_id = 'tool-assets');

drop policy if exists "Admin insert on tool-assets" on storage.objects;
create policy "Admin insert on tool-assets"
on storage.objects for insert
with check (bucket_id = 'tool-assets' and public.is_admin());

drop policy if exists "Admin update on tool-assets" on storage.objects;
create policy "Admin update on tool-assets"
on storage.objects for update
using (bucket_id = 'tool-assets' and public.is_admin());

drop policy if exists "Admin delete on tool-assets" on storage.objects;
create policy "Admin delete on tool-assets"
on storage.objects for delete
using (bucket_id = 'tool-assets' and public.is_admin());

-- ============================================================================
-- 9. SUPABASE REALTIME REPLICATION
-- ============================================================================

do $$
begin
  if not exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    create publication supabase_realtime;
  end if;
end $$;

alter publication supabase_realtime add table public.tools;
alter publication supabase_realtime add table public.categories;
alter publication supabase_realtime add table public.tool_categories;
alter publication supabase_realtime add table public.tags;
alter publication supabase_realtime add table public.tool_tags;

-- ============================================================================
-- 10. INITIAL SEED DATA
-- ============================================================================

insert into public.categories (name, slug, description)
values
  ('Web Tools', 'web-tools', 'Web-based applications and online services'),
  ('Developer', 'developer', 'Tools, libraries, and resources for software developers'),
  ('Design', 'design', 'Design assets, typography tools, and UI generators'),
  ('Productivity', 'productivity', 'Utilities to streamline workflow and task management'),
  ('Media', 'media', 'Audio, video, image converters, and media manipulation tools'),
  ('Utilities', 'utilities', 'System helpers, calculators, and quick daily utilities'),
  ('Other', 'other', 'Miscellaneous tools and experiments')
on conflict (slug) do nothing;

insert into public.tags (name, slug)
values
  ('Next.js', 'nextjs'),
  ('React', 'react'),
  ('TypeScript', 'typescript'),
  ('Supabase', 'supabase'),
  ('Vercel', 'vercel'),
  ('Tailwind', 'tailwind'),
  ('Go', 'go'),
  ('Python', 'python'),
  ('API', 'api'),
  ('AI', 'ai'),
  ('Open Source', 'open-source')
on conflict (slug) do nothing;

insert into public.admin_settings (key, value)
values ('general', '{"site_name": "Tool Collection", "allow_registration": false}'::jsonb)
on conflict (key) do nothing;
