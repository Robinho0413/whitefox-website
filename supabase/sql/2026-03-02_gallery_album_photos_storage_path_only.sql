-- Gallery photos model: store only storage_path (no image_url column)
-- Safe to run multiple times.

create extension if not exists pgcrypto;

create table if not exists public.album_photos (
  id uuid primary key default gen_random_uuid(),
  album_id uuid not null references public.albums(id) on delete cascade,
  storage_path text not null unique,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists album_photos_album_id_idx
  on public.album_photos(album_id);

create index if not exists album_photos_sort_idx
  on public.album_photos(album_id, sort_order, created_at);

alter table public.album_photos enable row level security;

drop policy if exists "album_photos_public_read" on public.album_photos;
drop policy if exists "album_photos_admin_insert" on public.album_photos;
drop policy if exists "album_photos_admin_update" on public.album_photos;
drop policy if exists "album_photos_admin_delete" on public.album_photos;

-- Public read for website gallery
create policy "album_photos_public_read"
on public.album_photos
for select
to anon, authenticated
using (true);

-- Admin-only write (based on profiles.is_admin)
create policy "album_photos_admin_insert"
on public.album_photos
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.is_admin = true
  )
);

create policy "album_photos_admin_update"
on public.album_photos
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.is_admin = true
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.is_admin = true
  )
);

create policy "album_photos_admin_delete"
on public.album_photos
for delete
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.is_admin = true
  )
);

-- Storage policies for bucket: gallery
drop policy if exists "gallery_bucket_public_read" on storage.objects;
drop policy if exists "gallery_bucket_admin_insert" on storage.objects;
drop policy if exists "gallery_bucket_admin_update" on storage.objects;
drop policy if exists "gallery_bucket_admin_delete" on storage.objects;

-- Keep SELECT public for website image display
create policy "gallery_bucket_public_read"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'gallery');

-- Admin-only upload/update/delete in gallery bucket
create policy "gallery_bucket_admin_insert"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'gallery'
  and exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.is_admin = true
  )
);

create policy "gallery_bucket_admin_update"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'gallery'
  and exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.is_admin = true
  )
)
with check (
  bucket_id = 'gallery'
  and exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.is_admin = true
  )
);

create policy "gallery_bucket_admin_delete"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'gallery'
  and exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.is_admin = true
  )
);
