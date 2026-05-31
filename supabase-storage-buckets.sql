-- =============================================
-- Storage Buckets — Supabase Migration
-- Run this in the Supabase SQL editor.
-- Idempotent: safe to re-run; existing buckets are reconfigured in place.
-- =============================================
--
-- These buckets back the admin content uploads:
--   covers       — cover images for blogs, events, and whitepapers
--   whitepapers  — whitepaper PDF files
--
-- Uploads are performed browser -> Supabase Storage directly, authorized by a
-- one-time signed upload URL minted server-side with the service-role key
-- (see src/app/(admin)/whitepapers/actions.ts). Because the signed URL carries
-- its own authorization, NO RLS policy on storage.objects is required for
-- writes. Reads are public (getPublicUrl), hence public = true.
--
-- The whitepaper flow uploads files directly to storage instead of through a
-- Next.js Server Action, sidestepping the 1 MB Server Action body limit and
-- Vercel's 4.5 MB function-body cap.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'covers',
    'covers',
    true,
    5242880, -- 5 MB
    array['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
  ),
  (
    'whitepapers',
    'whitepapers',
    true,
    52428800, -- 50 MB
    array['application/pdf']
  )
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;
