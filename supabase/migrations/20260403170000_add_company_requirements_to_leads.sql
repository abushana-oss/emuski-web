-- Add name, company name, phone, and requirements fields to leads table
alter table public.leads 
add column if not exists name text not null default '',
add column if not exists company text not null default '',
add column if not exists phone text not null default '',
add column if not exists requirements text not null default '';

-- Index for company field for reporting
create index if not exists leads_company_idx on public.leads (company);