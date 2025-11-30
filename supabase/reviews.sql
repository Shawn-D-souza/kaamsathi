-- 1. Create the Reviews Table
create table public.reviews (
  id uuid not null default gen_random_uuid() primary key,
  created_at timestamp with time zone default now() not null,
  
  -- Links to the specific job contract
  job_id uuid not null references public.jobs(id) on delete cascade,
  
  -- Who wrote the review (The Seeker)
  reviewer_id uuid not null references public.profiles(id) on delete cascade,
  
  -- Who is being reviewed (The Provider)
  reviewee_id uuid not null references public.profiles(id) on delete cascade,
  
  -- 1 to 5 Stars
  rating integer not null check (rating >= 1 and rating <= 5),
  
  -- Optional comment
  comment text check (char_length(comment) <= 1000),
  
  -- Constraint: A Seeker can only review a specific Provider once per Job.
  unique(job_id, reviewer_id, reviewee_id)
);

-- 2. Enable Row Level Security (RLS)
alter table public.reviews enable row level security;

-- 3. Create Policies

-- READ: Everyone can read reviews (Public Trust)
create policy "Reviews are public" 
  on public.reviews for select 
  using (true);

-- INSERT: Only the Job Owner (Seeker) can write a review
create policy "Job owners can review hired providers"
  on public.reviews for insert
  with check (
    -- The user inserting must be the 'reviewer'
    auth.uid() = reviewer_id 
    and
    -- The user must effectively be the owner of the job
    exists (
        select 1 from public.jobs 
        where id = job_id 
        and owner_id = auth.uid()
    )
    and
    -- The person being reviewed must actually be a bidder on that job
    exists (
        select 1 from public.bids
        where job_id = reviews.job_id
        and bidder_id = reviews.reviewee_id
        and status = 'accepted'
    )
  );

-- 4. Performance Indexes
create index reviews_reviewee_id_idx on public.reviews (reviewee_id);
create index reviews_job_id_idx on public.reviews (job_id);