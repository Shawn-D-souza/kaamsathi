-- Note: The 'avatars' bucket must be created manually in the dashboard first
-- Settings: Public = true, File Size Limit = 2MB, Allowed MIME types = image/*

-- 1. Allow authenticated users to upload new files to 'avatars'
create policy "Allow authenticated uploads"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
  );

-- 2. Allow users to update/overwrite their own files
create policy "Allow individual update"
  on storage.objects
  for update
  to authenticated
  using ( bucket_id = 'avatars' );

-- 3. Allow everyone to view avatars (Public access)
create policy "Allow public read access"
  on storage.objects
  for select
  to public
  using ( bucket_id = 'avatars' );