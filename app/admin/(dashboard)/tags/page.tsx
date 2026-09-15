import React from 'react';
import { getServiceRoleSupabase } from '@/lib/supabase/service-role';
import { TagsManager } from '@/components/admin/tags-manager';
import type { Tag } from '@/lib/types';

export const revalidate = 0;

async function getTags() {
  const supabase = getServiceRoleSupabase();
  if (!supabase) return [];

  try {
    const { data } = await supabase.from('tags').select('*').order('name', { ascending: true });
    return (data || []) as Tag[];
  } catch (err) {
    console.error('Error fetching tags:', err);
    return [];
  }
}

export default async function AdminTagsPage() {
  const tags = await getTags();

  return <TagsManager initialTags={tags} />;
}
