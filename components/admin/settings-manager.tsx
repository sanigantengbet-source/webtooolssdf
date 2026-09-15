'use client';

import React, { useState } from 'react';
import { Shield, KeyRound, User, CheckCircle2, AlertCircle, Loader2, AlertTriangle } from 'lucide-react';
import type { AdminProfile } from '@/lib/types';

interface SettingsManagerProps {
  profile: AdminProfile;
}

export function SettingsManager({ profile }: SettingsManagerProps) {
  // Username form state
  const [username, setUsername] = useState(profile.username);
  const [isUpdatingUsername, setIsUpdatingUsername] = useState(false);
  const [usernameSuccess, setUsernameSuccess] = useState<string | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [mustChangePassword, setMustChangePassword] = useState(profile.must_change_password);

  // Handle username update
  const handleUpdateUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setUsernameError('Username cannot be empty.');
      return;
    }

    setIsUpdatingUsername(true);
    setUsernameSuccess(null);
    setUsernameError(null);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'change_username',
          newUsername: username.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setUsernameError(data.error || 'Failed to update username.');
      } else {
        setUsernameSuccess('Username updated successfully!');
      }
    } catch {
      setUsernameError('Network error while updating username.');
    } finally {
      setIsUpdatingUsername(false);
    }
  };

  // Handle password change
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      setPasswordError('Please provide your current password.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    // Client-side quick check
    if (newPassword.length < 12) {
      setPasswordError('Password must be at least 12 characters.');
      return;
    }

    setIsUpdatingPassword(true);
    setPasswordSuccess(null);
    setPasswordError(null);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'change_password',
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setPasswordError(data.error || 'Failed to change password.');
      } else {
        setPasswordSuccess('Password changed successfully! Default password flag has been cleared.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setMustChangePassword(false);
      }
    } catch {
      setPasswordError('Network error while changing password.');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Header */}
      <div className="pb-4 border-b border-[#eaeaea] dark:border-[#27272a]">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#171717] dark:text-[#ededed]">
          Account & Security Settings
        </h1>
        <p className="text-xs sm:text-sm text-[#666666] dark:text-[#a1a1a1] mt-1">
          Manage your administrator identity, authentication credentials, and access keys
        </p>
      </div>

      {/* Mandatory Password Change Banner */}
      {mustChangePassword && (
        <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs leading-relaxed">
              <p className="font-semibold text-sm">Default Credentials Detected</p>
              <p>
                Your account is currently using the initial setup password. For production security, you must update your password before carrying out live deployments.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Card */}
      <div className="rounded-lg border border-[#eaeaea] dark:border-[#27272a] bg-white dark:bg-[#111111] p-6">
        <div className="flex items-center gap-2.5 pb-3 mb-4 border-b border-[#eaeaea] dark:border-[#27272a]">
          <KeyRound className="h-4 w-4 text-zinc-500" />
          <h2 className="text-sm font-semibold text-[#171717] dark:text-[#ededed]">
            Change Password
          </h2>
        </div>

        {passwordSuccess && (
          <div className="mb-4 p-3 rounded bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{passwordSuccess}</span>
          </div>
        )}

        {passwordError && (
          <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500/20 text-xs text-red-700 dark:text-red-400 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{passwordError}</span>
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1">
              Current Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3 py-2 text-xs rounded border border-[#eaeaea] dark:border-[#27272a] bg-white dark:bg-[#181818] text-[#171717] dark:text-[#ededed] focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">
              New Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min 12 chars (upper, lower, digit, symbol)"
              className="w-full px-3 py-2 text-xs rounded border border-[#eaeaea] dark:border-[#27272a] bg-white dark:bg-[#181818] text-[#171717] dark:text-[#ededed] focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">
              Confirm New Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              className="w-full px-3 py-2 text-xs rounded border border-[#eaeaea] dark:border-[#27272a] bg-white dark:bg-[#181818] text-[#171717] dark:text-[#ededed] focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white font-mono"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isUpdatingPassword}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded bg-[#171717] text-white dark:bg-[#ededed] dark:text-black hover:opacity-90 disabled:opacity-50"
            >
              {isUpdatingPassword && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>Update Password</span>
            </button>
          </div>
        </form>
      </div>

      {/* Change Username Card */}
      <div className="rounded-lg border border-[#eaeaea] dark:border-[#27272a] bg-white dark:bg-[#111111] p-6">
        <div className="flex items-center gap-2.5 pb-3 mb-4 border-b border-[#eaeaea] dark:border-[#27272a]">
          <User className="h-4 w-4 text-zinc-500" />
          <h2 className="text-sm font-semibold text-[#171717] dark:text-[#ededed]">
            Administrator Username
          </h2>
        </div>

        {usernameSuccess && (
          <div className="mb-4 p-3 rounded bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{usernameSuccess}</span>
          </div>
        )}

        {usernameError && (
          <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500/20 text-xs text-red-700 dark:text-red-400 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{usernameError}</span>
          </div>
        )}

        <form onSubmit={handleUpdateUsername} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1">Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded border border-[#eaeaea] dark:border-[#27272a] bg-white dark:bg-[#181818] text-[#171717] dark:text-[#ededed] focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isUpdatingUsername}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded bg-[#171717] text-white dark:bg-[#ededed] dark:text-black hover:opacity-90 disabled:opacity-50"
            >
              {isUpdatingUsername && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>Save Username</span>
            </button>
          </div>
        </form>
      </div>

      {/* Security Architecture Info */}
      <div className="p-4 rounded-lg border border-[#eaeaea] dark:border-[#27272a] bg-[#fafafa] dark:bg-[#111111] text-xs text-[#666666] dark:text-[#a1a1a1] space-y-2">
        <div className="flex items-center gap-2 font-medium text-[#171717] dark:text-[#ededed]">
          <Shield className="h-4 w-4" />
          <span>Security Architecture & RLS Safeguards</span>
        </div>
        <p>
          Authentication sessions are protected by HTTP-only cookies, SameSite lax policies, and server-side cryptographic validation via Supabase SSR.
        </p>
        <p>
          All password changes and authentication attempts are audited and logged with client fingerprints to defend against credential abuse.
        </p>
      </div>
    </div>
  );
}
