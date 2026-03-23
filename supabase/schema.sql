-- ══════════════════════════════════════════════════════════════
-- AADHYA PLATFORM - Database Schema
-- Run this in Supabase SQL Editor to set up your database
-- ══════════════════════════════════════════════════════════════

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── PROFILES (extends Supabase auth.users) ──
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  phone text,
  avatar_url text,
  plan text default 'free' check (plan in ('free', 'premium', 'pro')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ── EVENTS ──
create type event_type as enum (
  'cradle_ceremony', 'housewarming', 'birthday', 'wedding',
  'engagement', 'baby_shower', 'anniversary', 'graduation',
  'corporate', 'festival', 'other'
);

create type event_status as enum ('draft', 'published', 'archived');

create table public.events (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  slug text unique not null,
  title text not null,
  subtitle text,
  type event_type default 'other',
  status event_status default 'draft',
  date date not null,
  time text default '10:00 AM',
  end_time text,
  venue text,
  address text,
  city text,
  lat numeric,
  lng numeric,
  description text,
  description_te text,
  cover_image text,
  theme jsonb default '{"primary":"#8B1A1A","accent":"#D4A574","background":"#FFF8F0"}',
  language text default 'en',
  settings jsonb default '{
    "showCountdown": true,
    "showTimeline": true,
    "showGuestList": true,
    "showWishes": true,
    "showGallery": true,
    "showDirections": true,
    "showRegistry": true,
    "showWeather": true,
    "envelopeAnimation": true,
    "confettiOnRsvp": true,
    "allowPlusOnes": true,
    "collectDietary": true,
    "guestCanSeeGuestList": true
  }',
  custom_domain text,
  og_image text,
  max_guests integer,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ── TIMELINE ITEMS ──
create table public.timeline_items (
  id uuid default uuid_generate_v4() primary key,
  event_id uuid references public.events(id) on delete cascade not null,
  time text not null,
  title text not null,
  description text,
  icon text default 'clock',
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- ── RSVPs ──
create type rsvp_status as enum ('yes', 'no', 'maybe');

create table public.rsvps (
  id uuid default uuid_generate_v4() primary key,
  event_id uuid references public.events(id) on delete cascade not null,
  name text not null,
  email text,
  phone text,
  status rsvp_status not null,
  adults integer default 1,
  kids integer default 0,
  dietary text default 'No restrictions',
  message text,
  rsvp_date timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ── COMMENTS / WISHES ──
create table public.comments (
  id uuid default uuid_generate_v4() primary key,
  event_id uuid references public.events(id) on delete cascade not null,
  name text not null,
  text text not null,
  avatar text,
  created_at timestamptz default now()
);

-- ── PHOTOS ──
create table public.photos (
  id uuid default uuid_generate_v4() primary key,
  event_id uuid references public.events(id) on delete cascade not null,
  url text not null,
  thumbnail_url text,
  uploaded_by text,
  caption text,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- ── REGISTRY ITEMS ──
create table public.registry_items (
  id uuid default uuid_generate_v4() primary key,
  event_id uuid references public.events(id) on delete cascade not null,
  name text not null,
  description text,
  url text,
  icon text default 'gift',
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- ── CO-HOSTS ──
create table public.co_hosts (
  id uuid default uuid_generate_v4() primary key,
  event_id uuid references public.events(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  permissions jsonb default '{"canEditEvent": true, "canManageGuests": true, "canSendMessages": false}',
  created_at timestamptz default now(),
  unique(event_id, user_id)
);

-- ══════════════════════════════════════════════════════════════
-- INDEXES
-- ══════════════════════════════════════════════════════════════
create index idx_events_user_id on public.events(user_id);
create index idx_events_slug on public.events(slug);
create index idx_events_status on public.events(status);
create index idx_rsvps_event_id on public.rsvps(event_id);
create index idx_rsvps_status on public.rsvps(status);
create index idx_comments_event_id on public.comments(event_id);
create index idx_photos_event_id on public.photos(event_id);
create index idx_timeline_event_id on public.timeline_items(event_id);

-- ══════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- ══════════════════════════════════════════════════════════════
alter table public.profiles enable row level security;
alter table public.events enable row level security;
alter table public.timeline_items enable row level security;
alter table public.rsvps enable row level security;
alter table public.comments enable row level security;
alter table public.photos enable row level security;
alter table public.registry_items enable row level security;
alter table public.co_hosts enable row level security;

-- Profiles: users can read/update their own profile
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Events: owners can CRUD, anyone can read published events
create policy "Anyone can view published events" on public.events for select using (status = 'published');
create policy "Owners can view own events" on public.events for select using (auth.uid() = user_id);
create policy "Owners can create events" on public.events for insert with check (auth.uid() = user_id);
create policy "Owners can update own events" on public.events for update using (auth.uid() = user_id);
create policy "Owners can delete own events" on public.events for delete using (auth.uid() = user_id);

-- Timeline: linked to event visibility
create policy "Anyone can view timeline of published events" on public.timeline_items for select
  using (exists (select 1 from public.events where id = event_id and (status = 'published' or user_id = auth.uid())));
create policy "Owners can manage timeline" on public.timeline_items for all
  using (exists (select 1 from public.events where id = event_id and user_id = auth.uid()));

-- RSVPs: anyone can create (no auth needed for guests), owners can read all
create policy "Anyone can RSVP to published events" on public.rsvps for insert
  with check (exists (select 1 from public.events where id = event_id and status = 'published'));
create policy "Owners can view RSVPs" on public.rsvps for select
  using (exists (select 1 from public.events where id = event_id and user_id = auth.uid()));
create policy "Public RSVP read for guest list" on public.rsvps for select
  using (exists (select 1 from public.events where id = event_id and status = 'published'
    and (settings->>'guestCanSeeGuestList')::boolean = true));

-- Comments: anyone can create and read on published events
create policy "Anyone can view comments on published events" on public.comments for select
  using (exists (select 1 from public.events where id = event_id and status = 'published'));
create policy "Anyone can add comments to published events" on public.comments for insert
  with check (exists (select 1 from public.events where id = event_id and status = 'published'));
create policy "Owners can manage comments" on public.comments for all
  using (exists (select 1 from public.events where id = event_id and user_id = auth.uid()));

-- Photos: same pattern
create policy "Anyone can view photos of published events" on public.photos for select
  using (exists (select 1 from public.events where id = event_id and status = 'published'));
create policy "Owners can manage photos" on public.photos for all
  using (exists (select 1 from public.events where id = event_id and user_id = auth.uid()));

-- Registry: public read, owner manage
create policy "Anyone can view registry of published events" on public.registry_items for select
  using (exists (select 1 from public.events where id = event_id and status = 'published'));
create policy "Owners can manage registry" on public.registry_items for all
  using (exists (select 1 from public.events where id = event_id and user_id = auth.uid()));

-- Co-hosts
create policy "Co-hosts can view their entries" on public.co_hosts for select
  using (user_id = auth.uid() or exists (select 1 from public.events where id = event_id and user_id = auth.uid()));
create policy "Owners can manage co-hosts" on public.co_hosts for all
  using (exists (select 1 from public.events where id = event_id and user_id = auth.uid()));

-- ══════════════════════════════════════════════════════════════
-- FUNCTIONS & TRIGGERS
-- ══════════════════════════════════════════════════════════════

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Auto-update updated_at timestamp
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at before update on public.profiles
  for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.events
  for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.rsvps
  for each row execute function public.update_updated_at();

-- Generate unique slug from title
create or replace function public.generate_slug(title text)
returns text as $$
declare
  base_slug text;
  final_slug text;
  counter integer := 0;
begin
  base_slug := lower(regexp_replace(title, '[^a-zA-Z0-9]+', '-', 'g'));
  base_slug := trim(both '-' from base_slug);
  final_slug := base_slug;
  while exists (select 1 from public.events where slug = final_slug) loop
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  end loop;
  return final_slug;
end;
$$ language plpgsql;

-- ══════════════════════════════════════════════════════════════
-- STORAGE BUCKETS
-- ══════════════════════════════════════════════════════════════
-- Run these separately in Supabase Dashboard > Storage:
-- 1. Create bucket "event-covers" (public)
-- 2. Create bucket "event-photos" (public)
-- 3. Create bucket "avatars" (public)
