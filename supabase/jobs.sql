-- 1. Create the jobs table
create table public.jobs (
  id uuid not null default gen_random_uuid() primary key,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text not null,
  budget numeric not null check (budget > 0),
  deadline timestamp with time zone not null,
  category text not null,
  status text not null check (status in ('open', 'in_progress', 'completed')) default 'open',
  
  -- Location Features
  is_remote boolean not null default false,
  location geography(Point),
  radius_meters integer check (radius_meters > 0)
);

-- 2. Enable Row Level Security (RLS)
alter table public.jobs enable row level security;

-- 3. Create Policies

-- SELECT: Anyone can view 'open' jobs (Public Marketplace)
create policy "Open jobs are viewable by everyone"
  on public.jobs for select
  using ( status = 'open' );

-- SELECT: Owners can view ALL their own jobs (Drafts, In Progress, etc.)
create policy "Users can view their own jobs"
  on public.jobs for select
  using ( auth.uid() = owner_id );

-- INSERT: Only users with 'seeker' role can insert jobs
create policy "Seekers can insert jobs"
  on public.jobs for insert
  with check (
    auth.uid() = owner_id and
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'seeker'
    )
  );

-- UPDATE: Owners can update their own jobs
create policy "Users can update their own jobs"
  on public.jobs for update
  using ( auth.uid() = owner_id );

-- DELETE: Owners can delete their own jobs
create policy "Users can delete their own jobs"
  on public.jobs for delete
  using ( auth.uid() = owner_id );

-- 4. Create Indexes for Performance
create index jobs_owner_id_idx on public.jobs (owner_id);
create index jobs_status_idx on public.jobs (status);
create index jobs_created_at_idx on public.jobs (created_at desc);
-- Geospatial Index for Radius Search
create index jobs_location_idx on public.jobs using GIST (location);