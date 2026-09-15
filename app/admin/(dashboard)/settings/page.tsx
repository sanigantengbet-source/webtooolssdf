import React from 'react';
import { redirect } from 'next/navigation';
import { getAuthenticatedAdmin } from '@/lib/auth/admin-auth';
import { SettingsManager } from '@/components/admin/settings-manager';

export const revalidate = 0;

export default async function AdminSettingsPage() {
  const admin = await getAuthenticatedAdmin();

  if (!admin) {
    redirect('/admin/login');
  }

  return <SettingsManager profile={admin.profile} />;
}
