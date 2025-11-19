-- 1. Create bids table
create table public.bids (
  id uuid not null default gen_random_uuid() primary key,
  created_at timestamp with time zone default now() not null,
  job_id uuid not null references public.jobs(id) on delete cascade,
  bidder_id uuid not null references public.profiles(id) on delete cascade,
  amount numeric not null check (amount > 0),
  status text not null check (status in ('pending', 'accepted', 'rejected')) default 'pending',
  
  -- Prevent multiple bids from same provider on same job
  unique(job_id, bidder_id)
);

-- 2. Enable RLS
alter table public.bids enable row level security;

-- 3. Policies

-- SELECT: 
-- Seekers can see bids on their own jobs
create policy "Seekers can view bids on their jobs"
  on public.bids for select
  using ( 
    exists (
      select 1 from public.jobs
      where jobs.id = bids.job_id
      and jobs.owner_id = auth.uid()
    )
  );

-- Providers can see their own bids
create policy "Providers can view their own bids"
  on public.bids for select
  using ( bidder_id = auth.uid() );

-- INSERT: Only providers can place bids
create policy "Providers can insert bids"
  on public.bids for insert
  with check (
    auth.uid() = bidder_id and
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'provider'
    )
  );

-- 4. Indexes
create index bids_job_id_idx on public.bids (job_id);
create index bids_bidder_id_idx on public.bids (bidder_id);