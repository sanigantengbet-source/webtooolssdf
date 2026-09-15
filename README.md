# Tool Collection

Curated tools and projects directory built with Next.js 15, Tailwind CSS, and Supabase.

## Features
- **Public Directory**: Browse and search tools by category or keywords with real-time updates.
- **Admin Dashboard**: Secure management for adding, editing, and categorizing tools.
- **Supabase Integration**: Auth, Database (PostgreSQL), and Storage with Row-Level Security.

## Getting Started
1. Run `supabase/schema.sql` in your Supabase SQL editor.
2. Configure `.env.local` with your Supabase credentials:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Run `npm run dev` to start the local development server.
