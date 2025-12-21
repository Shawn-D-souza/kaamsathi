-- 1. Create Notifications Table
create table public.notifications (
  id uuid not null default gen_random_uuid() primary key,
  created_at timestamp with time zone default now() not null,
  user_id uuid not null references public.profiles(id) on delete cascade, -- The Recipient
  actor_id uuid references public.profiles(id) on delete set null,        -- The Sender/Trigger
  
  type text not null check (type in ('message', 'bid', 'job_update', 'system')),
  title text not null,
  body text not null,
  
  resource_id uuid, -- Link to Job or Chat
  resource_url text, -- Deep link (e.g., /jobs/123)
  
  is_read boolean default false not null,
  metadata jsonb default '{}'::jsonb
);

-- 2. Enable RLS
alter table public.notifications enable row level security;

-- 3. Policies

-- SELECT: Users view their own notifications
create policy "Users can view their own notifications"
  on public.notifications for select
  using ( auth.uid() = user_id );

-- UPDATE: Users can mark their notifications as read
create policy "Users can update their own notifications"
  on public.notifications for update
  using ( auth.uid() = user_id );

-- INSERT: Usually handled by Server/Edge Functions, but we allow self-triggering for testing if needed
-- Ideally, disable client-side inserts in production or restrict heavily.