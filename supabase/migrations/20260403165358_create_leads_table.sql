-- AI widget lead capture table
create table if not exists public.leads (
  id            uuid primary key default gen_random_uuid(),
  email         text not null,
  session_id    uuid not null,
  message_count integer not null default 0,
  source        text not null default 'ai-widget',
  page_url      text,
  created_at    timestamptz not null default now(),
  contacted_at  timestamptz
);

-- Indexes
create index if not exists leads_email_idx on public.leads (email);
create index if not exists leads_created_at_idx on public.leads (created_at desc);

-- RLS
alter table public.leads enable row level security;

-- Anon users can insert (widget submits leads without auth)
create policy "anon can insert leads"
  on public.leads for insert
  to anon
  with check (true);

-- Only authenticated team members can read/update
create policy "authenticated can select leads"
  on public.leads for select
  to authenticated
  using (true);

create policy "authenticated can update leads"
  on public.leads for update
  to authenticated
  using (true);