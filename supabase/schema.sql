-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Contacts table
create table public.contacts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  school text,
  job_title text,
  employer text,
  created_at timestamptz not null default now()
);

-- Interactions table
create table public.interactions (
  id uuid primary key default uuid_generate_v4(),
  contact_id uuid not null references public.contacts(id) on delete cascade,
  title text not null,
  notes text,
  rating integer check (rating >= 1 and rating <= 10),
  emoji text,
  interaction_date date not null,
  created_at timestamptz not null default now()
);

-- Row Level Security
alter table public.contacts enable row level security;
alter table public.interactions enable row level security;

-- Contacts policies
create policy "Users can view their own contacts"
  on public.contacts for select
  using (auth.uid() = user_id);

create policy "Users can insert their own contacts"
  on public.contacts for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own contacts"
  on public.contacts for update
  using (auth.uid() = user_id);

create policy "Users can delete their own contacts"
  on public.contacts for delete
  using (auth.uid() = user_id);

-- Interactions policies (via contact ownership)
create policy "Users can view interactions for their contacts"
  on public.interactions for select
  using (
    exists (
      select 1 from public.contacts
      where contacts.id = interactions.contact_id
        and contacts.user_id = auth.uid()
    )
  );

create policy "Users can insert interactions for their contacts"
  on public.interactions for insert
  with check (
    exists (
      select 1 from public.contacts
      where contacts.id = interactions.contact_id
        and contacts.user_id = auth.uid()
    )
  );

create policy "Users can update interactions for their contacts"
  on public.interactions for update
  using (
    exists (
      select 1 from public.contacts
      where contacts.id = interactions.contact_id
        and contacts.user_id = auth.uid()
    )
  );

create policy "Users can delete interactions for their contacts"
  on public.interactions for delete
  using (
    exists (
      select 1 from public.contacts
      where contacts.id = interactions.contact_id
        and contacts.user_id = auth.uid()
    )
  );
