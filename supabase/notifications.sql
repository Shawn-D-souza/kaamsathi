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
  metadata jsonb default '{}'::jsonb -- Stores flags like {"push": true, "email": false}
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

-- 4. HELPER: Get Notification Preferences
-- Returns JSONB like {"push": true, "email": false} for a specific type
create or replace function public.get_notification_flags(
  p_user_id uuid, 
  p_type text
)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_prefs jsonb;
  v_default jsonb := '{"push": true, "email": true}'; -- Default if not set
begin
  select preferences->'notifications'->p_type 
  into v_prefs 
  from public.profiles 
  where id = p_user_id;

  return coalesce(v_prefs, v_default);
end;
$$;

-- 5. AUTOMATION: Trigger to create notifications on new messages
create or replace function public.handle_new_message()
returns trigger as $$
declare
  v_job_owner_id uuid;
  v_recipient_id uuid;
  v_flags jsonb;
begin
  -- Get Job Owner ID
  select owner_id into v_job_owner_id from public.jobs where id = new.job_id;

  if new.sender_id = v_job_owner_id then
    -- Case A: Owner sent message -> Notify Accepted Bidders
    for v_recipient_id in select bidder_id from public.bids where job_id = new.job_id and status = 'accepted'
    loop
      v_flags := public.get_notification_flags(v_recipient_id, 'messages');

      insert into public.notifications (
        user_id, actor_id, type, title, body, resource_id, resource_url, metadata
      ) values (
        v_recipient_id, 
        new.sender_id, 
        'message', 
        'New Message', 
        substring(new.content from 1 for 50), 
        new.job_id, 
        '/messages/' || new.job_id,
        v_flags
      );
    end loop;

  else
    -- Case B: Bidder sent message -> Notify Job Owner
    v_flags := public.get_notification_flags(v_job_owner_id, 'messages');

    insert into public.notifications (
      user_id, actor_id, type, title, body, resource_id, resource_url, metadata
    ) values (
      v_job_owner_id, 
      new.sender_id, 
      'message', 
      'New Message', 
      substring(new.content from 1 for 50), 
      new.job_id, 
      '/messages/' || new.job_id,
      v_flags
    );
  end if;

  return new;
end;
$$ language plpgsql security definer;

-- 6. AUTOMATION: Trigger to create notifications on new bids
create or replace function public.handle_new_bid()
returns trigger as $$
declare
  v_job_owner_id uuid;
  v_job_title text;
  v_flags jsonb;
begin
  -- Get Job Details
  select owner_id, title into v_job_owner_id, v_job_title 
  from public.jobs 
  where id = new.job_id;

  -- Fetch Owner Preferences for 'bids'
  v_flags := public.get_notification_flags(v_job_owner_id, 'bids');

  insert into public.notifications (
    user_id, actor_id, type, title, body, resource_id, resource_url, metadata
  ) values (
    v_job_owner_id,
    new.bidder_id,
    'bid',
    'New Bid Received',
    'You received a bid of ' || new.amount || ' for ' || v_job_title,
    new.job_id,
    '/jobs/' || new.job_id || '/bids',
    v_flags
  );

  return new;
end;
$$ language plpgsql security definer;

-- 7. AUTOMATION: Trigger to create notifications on job status updates
create or replace function public.handle_job_status_update()
returns trigger as $$
declare
  v_recipient_id uuid;
  v_flags jsonb;
  v_msg_body text;
begin
  -- Only run if status changed
  if old.status is distinct from new.status then
    
    if new.status = 'completed' then
      v_msg_body := 'Job "' || new.title || '" has been marked as completed.';
    elsif new.status = 'in_progress' then
      v_msg_body := 'Job "' || new.title || '" has started.';
    else
      return new; -- Ignore other status changes for now
    end if;

    -- Notify all ACCEPTED bidders
    for v_recipient_id in select bidder_id from public.bids where job_id = new.id and status = 'accepted'
    loop
      v_flags := public.get_notification_flags(v_recipient_id, 'job_updates');

      insert into public.notifications (
        user_id, actor_id, type, title, body, resource_id, resource_url, metadata
      ) values (
        v_recipient_id,
        new.owner_id,
        'job_update',
        'Job Update',
        v_msg_body,
        new.id,
        '/jobs/' || new.id,
        v_flags
      );
    end loop;
  end if;

  return new;
end;
$$ language plpgsql security definer;

-- 8. Attach Triggers to Tables
-- Note: These tables (messages, bids, jobs) must exist before running this.

drop trigger if exists on_new_message on public.messages;
create trigger on_new_message
  after insert on public.messages
  for each row execute procedure public.handle_new_message();

drop trigger if exists on_new_bid on public.bids;
create trigger on_new_bid
  after insert on public.bids
  for each row execute procedure public.handle_new_bid();

drop trigger if exists on_job_status_update on public.jobs;
create trigger on_job_status_update
  after update on public.jobs
  for each row execute procedure public.handle_job_status_update();

-- 9. Enable Realtime
-- This allows the frontend (Bell Icon) to listen to new rows in this table
alter publication supabase_realtime add table public.notifications;