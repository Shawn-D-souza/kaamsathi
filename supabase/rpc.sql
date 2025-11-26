-- Function to fetch relevant jobs for a provider
-- 1. Returns all Remote Jobs
-- 2. Returns Local Jobs where the job's radius overlaps with any of the provider's zones
create or replace function get_relevant_jobs(p_provider_id uuid)
returns setof jobs
language sql
security definer
as $$
  select distinct j.*
  from jobs j
  -- Join with provider locations to find overlaps (only if job is local)
  left join provider_locations pl on pl.provider_id = p_provider_id
  where 
    j.status = 'open' 
    and (
      -- Condition A: Job is Remote (Show to everyone)
      j.is_remote = true
      or
      -- Condition B: Job is Local AND overlaps with one of the provider's zones
      (
        j.is_remote = false 
        and pl.id is not null -- Ensures provider has at least one zone
        and st_dwithin(j.location, pl.location, j.radius_meters)
      )
    )
  order by j.created_at desc;
$$;