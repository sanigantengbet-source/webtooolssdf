import React from 'react';
import { redirect } from 'next/navigation';
import { getAuthenticatedAdmin } from '@/lib/auth/admin-auth';
import { AdminLayoutClient } from '@/components/admin/admin-layout-client';

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getAuthenticatedAdmin();

  if (!admin) {
    redirect('/admin/login');
  }

  return (
    <AdminLayoutClient
      username={admin.profile.username}
      mustChangePassword={admin.profile.must_change_password}
    >
      {children}
    </AdminLayoutClient>
  );
}
