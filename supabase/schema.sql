-- 1. Create the profiles table
create table public.profiles (
  id uuid not null references auth.users on delete cascade primary key,
  updated_at timestamp with time zone,
  full_name text,
  avatar_url text,
  role text check (role in ('seeker', 'provider')) default 'seeker',
  
  constraint username_length check (char_length(full_name) >= 3)
);

-- 2. Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- 3. Create Policies
-- Allow anyone to view profiles (needed for job listings later)
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

-- Allow users to insert their own profile (mostly handled by trigger, but good for safety)
create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

-- Allow users to update their own profile
create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- 4. Create a Trigger to auto-create profile on Signup
-- This function runs every time a new user is created in auth.users
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, role)
  values (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url',
    'seeker' -- Default role is Seeker
  );
  return new;
end;
$$ language plpgsql security definer;

-- Bind the trigger to the auth.users table
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();