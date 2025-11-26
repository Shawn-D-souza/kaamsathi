-- 1. Create Messages Table
create table public.messages (
  id uuid not null default gen_random_uuid() primary key,
  created_at timestamp with time zone default now() not null,
  job_id uuid not null references public.jobs(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  content text not null check (char_length(content) > 0)
);

-- 2. Enable RLS
alter table public.messages enable row level security;

-- 3. Create Message Policies
-- Allow access if you are the Owner OR an Accepted Bidder (Group Chat Logic)
create policy "Participants can view messages"
  on public.messages for select
  using (
    exists (
      select 1 from public.jobs
      where jobs.id = messages.job_id
      and (
        -- User is the Owner
        jobs.owner_id = auth.uid()
        or
        -- User is an Accepted Bidder (Hired)
        exists (
          select 1 from public.bids
          where bids.job_id = messages.job_id
          and bids.bidder_id = auth.uid()
          and bids.status = 'accepted'
        )
      )
    )
  );

create policy "Participants can send messages"
  on public.messages for insert
  with check (
    auth.uid() = sender_id 
    and
    exists (
      select 1 from public.jobs
      where jobs.id = messages.job_id
      and (
        -- User is the Owner
        jobs.owner_id = auth.uid()
        or
        -- User is an Accepted Bidder (Hired)
        exists (
          select 1 from public.bids
          where bids.job_id = messages.job_id
          and bids.bidder_id = auth.uid()
          and bids.status = 'accepted'
        )
      )
    )
  );

-- 4. Realtime
-- Enable realtime for messages table
alter publication supabase_realtime add table public.messages;