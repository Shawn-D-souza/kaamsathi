-- 1. Create Notifications Table
create table public.notifications (
  id uuid not null default gen_random_uuid() primary key,
  created_at timestamp with time zone default now() not null,
  user_id uuid not null references public.profiles(id) on delete cascade, -- The Recipient
  actor_id uuid references public.profiles(id) on delete set null,        -- The Sender
  
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

-- 3. RLS Policies

-- SELECT: Users view their own notifications
create policy "Users can view their own notifications"
  on public.notifications for select
  using ( auth.uid() = user_id );

-- UPDATE: Users can mark their notifications as read
create policy "Users can update their own notifications"
  on public.notifications for update
  using ( auth.uid() = user_id );

-- 4. AUTOMATION: Trigger to create notifications on new messages
create or replace function public.handle_new_message()
returns trigger as $$
declare
  v_job_owner_id uuid;
  v_recipient_id uuid;
begin
  -- Get Job Owner ID
  select owner_id into v_job_owner_id from public.jobs where id = new.job_id;

  if new.sender_id = v_job_owner_id then
    -- Case A: Owner sent message -> Notify Accepted Bidders
    for v_recipient_id in select bidder_id from public.bids where job_id = new.job_id and status = 'accepted'
    loop
      insert into public.notifications (
        user_id, actor_id, type, title, body, resource_id, resource_url
      ) values (
        v_recipient_id, 
        new.sender_id, 
        'message', 
        'New Message', -- UI can fetch sender name later
        substring(new.content from 1 for 50), 
        new.job_id, 
        '/messages/' || new.job_id
      );
    end loop;

  else
    -- Case B: Bidder sent message -> Notify Job Owner
    insert into public.notifications (
      user_id, actor_id, type, title, body, resource_id, resource_url
    ) values (
      v_job_owner_id, 
      new.sender_id, 
      'message', 
      'New Message', 
      substring(new.content from 1 for 50), 
      new.job_id, 
      '/messages/' || new.job_id
    );
  end if;

  return new;
end;
$$ language plpgsql security definer;

-- 5. Attach Trigger to Messages Table
drop trigger if exists on_new_message on public.messages;
create trigger on_new_message
  after insert on public.messages
  for each row execute procedure public.handle_new_message();

-- 6. Enable Realtime
alter publication supabase_realtime add table public.notifications;

-- 7. AUTOMATION: Trigger for Bids (New Bid & Bid Accepted)
create or replace function public.handle_bid_changes()
returns trigger as $$
declare
  v_job_owner_id uuid;
  v_job_title text;
begin
  -- Get Job Details (Owner & Title)
  select owner_id, title into v_job_owner_id, v_job_title
  from public.jobs
  where id = new.job_id;

  -- SCENARIO A: New Bid Created -> Notify Job Owner
  if (tg_op = 'INSERT') then
    insert into public.notifications (
      user_id, actor_id, type, title, body, resource_id, resource_url
    ) values (
      v_job_owner_id,           -- To: Job Owner
      new.bidder_id,            -- From: Bidder
      'bid',                    -- Type
      'New Bid Received',
      'You have received a new bid for ' || v_job_title,
      new.job_id,
      '/jobs/' || new.job_id    -- Link to the Job
    );
  end if;

  -- SCENARIO B: Bid Accepted -> Notify Provider
  if (tg_op = 'UPDATE' and old.status != 'accepted' and new.status = 'accepted') then
    insert into public.notifications (
      user_id, actor_id, type, title, body, resource_id, resource_url
    ) values (
      new.bidder_id,            -- To: The Provider
      v_job_owner_id,           -- From: Job Owner
      'job_update',             -- Type
      'Bid Accepted!',
      'Congratulations! Your bid for ' || v_job_title || ' has been accepted.',
      new.job_id,
      '/jobs/' || new.job_id    -- Link to the Job
    );
  end if;

  return new;
end;
$$ language plpgsql security definer;

-- 8. Attach Trigger to Bids Table
drop trigger if exists on_bid_changes on public.bids;
create trigger on_bid_changes
  after insert or update on public.bids
  for each row execute procedure public.handle_bid_changes();