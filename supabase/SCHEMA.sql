-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Difficulty Enum
create type difficulty_level as enum ('Easy', 'Medium', 'Hard');

-- Problems Table
create table problems (
  id bigint primary key generated always as identity,
  problem_number int unique not null,
  name text not null,
  statement text not null, -- Rich text
  tags_company text[] default '{}',
  tags_type text[] default '{}',
  difficulty difficulty_level not null default 'Easy',
  answer_hint text,
  editorial text, -- Rich text, gated for premium
  is_premium boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Profiles Table (linked to auth.users)
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  username text unique,
  email text unique,
  streak_count int default 0,
  max_streak int default 0,
  is_premium boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- User Activity (Solved Problems)
create table user_activity (
  id bigint primary key generated always as identity,
  user_id uuid references auth.users on delete cascade,
  problem_id bigint references problems on delete cascade,
  solved_at timestamptz default now(),
  unique(user_id, problem_id)
);

-- User Bookmarks
create table user_bookmarks (
  id bigint primary key generated always as identity,
  user_id uuid references auth.users on delete cascade,
  problem_id bigint references problems on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, problem_id)
);

-- RLS Policies (Row Level Security)
alter table problems enable row level security;
alter table profiles enable row level security;
alter table user_activity enable row level security;
alter table user_bookmarks enable row level security;

-- Problems: Everyone can read
create policy "Public problems are viewable by everyone" on problems
  for select using (true);

-- Profiles: Users can read their own profile
create policy "Users can view their own profile" on profiles
  for select using (auth.uid() = id);

-- User Activity: Users can read and insert their own activity
create policy "Users can view their own activity" on user_activity
  for select using (auth.uid() = user_id);

create policy "Users can record their own activity" on user_activity
  for insert with check (auth.uid() = user_id);

-- User Bookmarks: Users can manage their own bookmarks
create policy "Users can manage their own bookmarks" on user_bookmarks
  for all using (auth.uid() = user_id);
