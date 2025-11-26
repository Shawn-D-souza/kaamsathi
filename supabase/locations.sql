-- 1. Enable PostGIS extension for geospatial calculations
create extension if not exists postgis schema extensions;

-- 2. Create 'provider_locations' table
-- This stores the "Zones" a provider operates in.
create table public.provider_locations (
  id uuid not null default gen_random_uuid() primary key,
  provider_id uuid not null references public.profiles(id) on delete cascade,
  location geography(Point) not null,
  radius_meters integer not null check (radius_meters > 0),
  created_at timestamp with time zone default now() not null
);

-- 3. Enable Row Level Security (RLS)
alter table public.provider_locations enable row level security;

-- 4. Create Policies for Provider Locations
-- Providers can fully manage their own zones.
create policy "Providers can view their own zones"
  on public.provider_locations for select
  using ( auth.uid() = provider_id );

create policy "Providers can insert their own zones"
  on public.provider_locations for insert
  with check ( auth.uid() = provider_id );

create policy "Providers can update their own zones"
  on public.provider_locations for update
  using ( auth.uid() = provider_id );

create policy "Providers can delete their own zones"
  on public.provider_locations for delete
  using ( auth.uid() = provider_id );

-- 5. Create Geospatial Indexes for fast filtering
create index provider_locations_location_idx on public.provider_locations using GIST (location);