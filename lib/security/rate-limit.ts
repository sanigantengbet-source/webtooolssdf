import crypto from 'crypto';
import { getServiceRoleSupabase } from '../supabase/service-role';

export function hashIp(ip: string): string {
  if (!ip) return 'unknown';
  return crypto.createHash('sha256').update(`salt_tool_collection_${ip}`).digest('hex').substring(0, 32);
}

// In-memory fallback tracking for fast-path / serverless container life
interface MemoryAttempt {
  count: number;
  lastAttempt: number;
}
const memoryStore = new Map<string, MemoryAttempt>();

function getProgressiveLockoutSeconds(failedCount: number): number {
  if (failedCount < 5) return 0;
  if (failedCount === 5) return 30; // 30 seconds
  if (failedCount === 6) return 120; // 2 minutes
  if (failedCount === 7) return 600; // 10 minutes
  return 1800; // 30 minutes for 8+ failures
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds?: number;
  message?: string;
  failedAttempts?: number;
}

export async function checkLoginRateLimit(username: string, clientIp: string): Promise<RateLimitResult> {
  const ipHash = hashIp(clientIp);
  const normalizedUsername = username.toLowerCase().trim();
  const supabase = getServiceRoleSupabase();

  const now = Date.now();
  const windowMs = 30 * 60 * 1000; // 30 minutes
  const windowIso = new Date(now - windowMs).toISOString();

  // 1. Primary: Check Supabase database table `login_attempts`
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('login_attempts')
        .select('created_at, success')
        .or(`username.eq.${normalizedUsername},ip_hash.eq.${ipHash}`)
        .gte('created_at', windowIso)
        .order('created_at', { ascending: false });

      if (!error && data) {
        // Calculate consecutive failed attempts since last success
        let consecutiveFailures = 0;
        let mostRecentFailureTime = 0;

        for (const attempt of data) {
          if (attempt.success) {
            break; // Stop counting failures once we hit a successful login
          }
          consecutiveFailures++;
          if (!mostRecentFailureTime) {
            mostRecentFailureTime = new Date(attempt.created_at).getTime();
          }
        }

        const lockoutSeconds = getProgressiveLockoutSeconds(consecutiveFailures);
        if (lockoutSeconds > 0 && mostRecentFailureTime > 0) {
          const elapsedSeconds = Math.floor((now - mostRecentFailureTime) / 1000);
          const remainingLockout = lockoutSeconds - elapsedSeconds;

          if (remainingLockout > 0) {
            return {
              allowed: false,
              retryAfterSeconds: remainingLockout,
              failedAttempts: consecutiveFailures,
              message: `Too many failed attempts. Temporary lockout in effect. Please try again in ${remainingLockout} seconds.`,
            };
          }
        }
      }
    } catch {
      // Fallback to memory store if query fails
    }
  }

  // 2. Fallback in-memory check
  const memKey = `${ipHash}_${normalizedUsername}`;
  const memData = memoryStore.get(memKey);
  if (memData) {
    const elapsedSeconds = Math.floor((now - memData.lastAttempt) / 1000);
    const lockoutSeconds = getProgressiveLockoutSeconds(memData.count);
    const remainingLockout = lockoutSeconds - elapsedSeconds;

    if (remainingLockout > 0) {
      return {
        allowed: false,
        retryAfterSeconds: remainingLockout,
        failedAttempts: memData.count,
        message: `Too many failed attempts. Please wait ${remainingLockout} seconds.`,
      };
    }

    if (now - memData.lastAttempt > windowMs) {
      memoryStore.delete(memKey);
    }
  }

  return { allowed: true };
}

export async function recordLoginAttempt(
  username: string,
  clientIp: string,
  success: boolean
): Promise<void> {
  const ipHash = hashIp(clientIp);
  const normalizedUsername = username.toLowerCase().trim();
  const supabase = getServiceRoleSupabase();
  const now = Date.now();

  // Update memory store
  const memKey = `${ipHash}_${normalizedUsername}`;
  if (success) {
    memoryStore.delete(memKey);
  } else {
    const existing = memoryStore.get(memKey) || { count: 0, lastAttempt: now };
    memoryStore.set(memKey, {
      count: existing.count + 1,
      lastAttempt: now,
    });
  }

  // Persist to Supabase DB
  if (supabase) {
    try {
      await supabase.from('login_attempts').insert({
        username: normalizedUsername,
        ip_hash: ipHash,
        success,
      });
    } catch {
      // Silent error handling for attempt recording
    }
  }
}

export async function recordAuditLog(params: {
  action: string;
  targetType: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
  adminId?: string | null;
  clientIp?: string;
}): Promise<void> {
  const supabase = getServiceRoleSupabase();
  if (!supabase) return;

  try {
    await supabase.from('audit_logs').insert({
      admin_id: params.adminId || null,
      action: params.action,
      target_type: params.targetType,
      target_id: params.targetId || '',
      metadata: params.metadata || {},
      ip_hash: params.clientIp ? hashIp(params.clientIp) : 'internal',
    });
  } catch (err) {
    console.error('Failed to write audit log:', err);
  }
}
