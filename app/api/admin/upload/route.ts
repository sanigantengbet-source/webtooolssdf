import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAdmin } from '@/lib/auth/admin-auth';
import { getServiceRoleSupabase } from '@/lib/supabase/service-role';
import { recordAuditLog } from '@/lib/security/rate-limit';

const ALLOWED_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/svg+xml',
];

const ALLOWED_EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp', 'svg'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(req: NextRequest) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getServiceRoleSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Database service unavailable' }, { status: 503 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'tools';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File exceeds 5MB size limit' }, { status: 400 });
    }

    const mimeType = file.type.toLowerCase();
    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      return NextResponse.json({ error: 'Unsupported file type. Only PNG, JPG, WEBP, and SVG allowed.' }, { status: 400 });
    }

    const originalName = file.name.toLowerCase();
    const extension = originalName.split('.').pop() || '';
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      return NextResponse.json({ error: 'Invalid file extension' }, { status: 400 });
    }

    // Read buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // SVG XSS check
    if (mimeType === 'image/svg+xml' || extension === 'svg') {
      const svgText = buffer.toString('utf-8');
      if (
        svgText.includes('<script') ||
        svgText.includes('javascript:') ||
        svgText.includes('onload=') ||
        svgText.includes('onerror=')
      ) {
        return NextResponse.json({ error: 'Potentially malicious SVG content detected.' }, { status: 400 });
      }
    }

    // Generate safe unique filename
    const cleanName = originalName.replace(/[^a-z0-9.]/g, '-').replace(/-+/g, '-');
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const fileName = `${folder}/${timestamp}-${randomStr}-${cleanName}`;

    // Upload to 'tool-assets' bucket
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('tool-assets')
      .upload(fileName, buffer, {
        contentType: mimeType,
        upsert: false,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('tool-assets')
      .getPublicUrl(uploadData.path);

    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
    await recordAuditLog({
      action: 'UPLOAD_ASSET',
      targetType: 'asset',
      targetId: uploadData.path,
      adminId: admin.user.id,
      metadata: { fileName, size: file.size, mimeType },
      clientIp,
    });

    return NextResponse.json({
      success: true,
      url: publicUrlData.publicUrl,
      path: uploadData.path,
    });
  } catch (error) {
    console.error('Error handling upload:', error);
    return NextResponse.json({ error: 'Internal server error during upload' }, { status: 500 });
  }
}
