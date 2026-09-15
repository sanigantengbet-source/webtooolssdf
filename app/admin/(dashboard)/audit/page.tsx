import React from 'react';
import { getServiceRoleSupabase } from '@/lib/supabase/service-role';
import { AuditLogsViewer } from '@/components/admin/audit-logs-viewer';
import type { AuditLog } from '@/lib/types';

export const revalidate = 0;

async function getAuditLogs() {
  const supabase = getServiceRoleSupabase();
  if (!supabase) return [];

  try {
    const { data } = await supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    return (data || []) as AuditLog[];
  } catch (err) {
    console.error('Error fetching audit logs:', err);
    return [];
  }
}

export default async function AdminAuditPage() {
  const logs = await getAuditLogs();

  return <AuditLogsViewer initialLogs={logs} />;
}
