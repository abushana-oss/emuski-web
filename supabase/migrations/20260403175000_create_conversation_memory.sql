-- Conversation memory table for tracking lead collection progress
create table if not exists public.conversation_memory (
  id            uuid primary key default gen_random_uuid(),
  session_id    uuid not null unique,
  name          text,
  company       text,
  email         text,
  phone         text,
  last_step     text not null default 'name', -- 'name', 'company', 'email', 'phone', 'complete'
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Index for fast session lookup
create index if not exists conversation_memory_session_idx on public.conversation_memory (session_id);

-- Update timestamp trigger
create or replace function update_conversation_memory_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger conversation_memory_updated_at
  before update on public.conversation_memory
  for each row
  execute function update_conversation_memory_updated_at();

-- RLS policies
alter table public.conversation_memory enable row level security;

-- Allow anonymous users to manage their own conversation state
create policy "anon can manage own conversation"
  on public.conversation_memory
  for all
  to anon
  using (true)
  with check (true);