import React from 'react';
import { getServiceRoleSupabase } from '@/lib/supabase/service-role';
import { CategoriesManager } from '@/components/admin/categories-manager';
import type { Category } from '@/lib/types';

export const revalidate = 0;

async function getCategories() {
  const supabase = getServiceRoleSupabase();
  if (!supabase) return [];

  try {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });
    return (data || []) as Category[];
  } catch (err) {
    console.error('Error fetching categories:', err);
    return [];
  }
}

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return <CategoriesManager initialCategories={categories} />;
}
