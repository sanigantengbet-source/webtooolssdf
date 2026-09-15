import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { recordAuditLog } from '@/lib/security/rate-limit';

export async function POST(req: NextRequest) {
  const supabase = await getServerSupabase();
  if (supabase) {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.auth.signOut();

    if (user) {
      await recordAuditLog({
        action: 'LOGOUT',
        targetType: 'auth',
        targetId: user.id,
        adminId: user.id,
        clientIp: req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1',
      });
    }
  }

  return NextResponse.json({ success: true });
}
