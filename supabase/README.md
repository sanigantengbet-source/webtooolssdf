# Supabase Setup Guide for Tool Collection

This guide explains how to initialize and configure Supabase for the **Tool Collection** production web application.

---

## 1. Create a Supabase Project

1. Go to [https://database.new](https://database.new) or sign in to your [Supabase Dashboard](https://app.supabase.com).
2. Click **New Project**.
3. Choose your organization, project name (e.g. `tool-collection`), database password, and region.
4. Wait for database provisioning to complete.

---

## 2. Execute `schema.sql`

1. In your Supabase Dashboard, navigate to the **SQL Editor** (left navigation).
2. Click **New Query**.
3. Copy the entire contents of `supabase/schema.sql` from this repository.
4. Paste into the SQL editor and click **Run**.
5. Verify that:
   - Tables (`profiles`, `categories`, `tools`, `tool_categories`, `tags`, `tool_tags`, `audit_logs`, `login_attempts`, `admin_settings`) are created.
   - Row Level Security (RLS) is enabled on each table.
   - The `tool-assets` storage bucket is created and set to public read with admin upload/delete policies.
   - Realtime publication `supabase_realtime` includes `tools`, `categories`, and junction tables.

---

## 3. Retrieve Environment Variables

In your Supabase project dashboard, navigate to **Project Settings** → **API**:

- **Project URL**: copy to `NEXT_PUBLIC_SUPABASE_URL`
- **anon / public key**: copy to `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **service_role secret** (reveal key): copy to `SUPABASE_SERVICE_ROLE_KEY`

> **Security Warning**: `SUPABASE_SERVICE_ROLE_KEY` is a secret that bypasses Row Level Security. Never commit it, never use the `NEXT_PUBLIC_` prefix, and never send it to the browser.

---

## 4. First-Time Admin Account Setup

The application provides a secure initialization mechanism.

### Option A: Using the In-App Setup Route (`/admin/setup`)

1. Start your local server or deploy to Vercel with your environment variables configured.
2. Navigate to `http://localhost:3000/admin/setup` (or your production URL).
3. If no admin exists in the database, the setup page will allow you to initialize the initial administrator account:
   - **Default Username**: `admin`
   - **Default Password**: `ChangeMe_123!@#`
   - *Or you can set your own custom secure password right during initialization.*
4. Upon first login with default credentials, you will be prompted to change your password immediately.
5. The setup endpoint and page automatically lock down once an admin exists, preventing any subsequent reuse.

### Option B: Manual Setup via Supabase Dashboard

1. In Supabase Dashboard, go to **Authentication** → **Users** → **Add User** → **Create User**.
2. Enter:
   - Email: `admin@yourdomain.com` (or any valid internal email)
   - Password: `ChangeMe_123!@#` (or your chosen password, min 12 chars with upper/lower/number/symbol)
   - Confirm email: checked
3. Go to **SQL Editor** and run:
   ```sql
   -- Link the user to the profiles table with username 'admin' and role 'admin'
   insert into public.profiles (id, username, role, must_change_password)
   values (
     'PASTE-AUTH-USER-UUID-HERE',
     'admin',
     'admin',
     true
   );
   ```

---

## 5. Enable Storage Bucket Public Access

The script `schema.sql` automatically creates the `tool-assets` bucket. You can verify it under **Storage** → **Buckets** in your Supabase dashboard. It should be public for reading uploaded tool logos and thumbnails.

---

## 6. Realtime Verification

In the Supabase Dashboard, under **Database** → **Replication**, verify that `tools` and `categories` tables are listed under the `supabase_realtime` publication.

---

## 7. Deploying to Vercel

1. Push your repository to GitHub.
2. Go to [Vercel](https://vercel.com) and click **Add New...** → **Project**.
3. Import your GitHub repository.
4. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your Supabase Anon Key
   - `SUPABASE_SERVICE_ROLE_KEY` = your Supabase Service Role Key
5. Click **Deploy**.
