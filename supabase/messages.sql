-- 1. Update Jobs Table to support assignment
alter table public.jobs 
add column assigned_provider_id uuid references public.profiles(id);

-- Allow assigned providers to view jobs assigned to them
create policy "Assigned providers can view assigned jobs"
  on public.jobs for select
  using ( auth.uid() = assigned_provider_id );

-- 2. Create Messages Table
create table public.messages (
  id uuid not null default gen_random_uuid() primary key,
  created_at timestamp with time zone default now() not null,
  job_id uuid not null references public.jobs(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  content text not null check (char_length(content) > 0)
);

-- 3. Enable RLS
alter table public.messages enable row level security;

-- 4. Create Message Policies
-- Allow participants (Owner or Assigned Provider) to view messages
create policy "Participants can view messages"
  on public.messages for select
  using (
    exists (
      select 1 from public.jobs
      where jobs.id = messages.job_id
      and (jobs.owner_id = auth.uid() or jobs.assigned_provider_id = auth.uid())
    )
  );

-- Allow participants to insert messages
create policy "Participants can send messages"
  on public.messages for insert
  with check (
    auth.uid() = sender_id and
    exists (
      select 1 from public.jobs
      where jobs.id = messages.job_id
      and (jobs.owner_id = auth.uid() or jobs.assigned_provider_id = auth.uid())
    )
  );

-- 5. Realtime
-- Enable realtime for messages table (run this in SQL editor or enable via Dashboard > Database > Replication)
alter publication supabase_realtime add table public.messages;