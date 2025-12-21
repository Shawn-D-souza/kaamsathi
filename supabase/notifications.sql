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