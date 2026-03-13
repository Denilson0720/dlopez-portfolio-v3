-- Enable moddatetime extension for auto-updating updated_at
create extension if not exists moddatetime schema extensions;

create table posts (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  slug          text not null unique,
  summary       text,
  body          jsonb not null default '{}',
  category      text not null check (category in ('tech', 'random')),
  status        text not null default 'draft' check (status in ('draft', 'published')),
  pinned        boolean not null default false,
  thumbnail_url text,
  published_at  timestamptz,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- Indexes
create index idx_posts_status on posts(status);
create index idx_posts_pinned on posts(pinned);
create index idx_posts_slug on posts(slug);
create index idx_posts_published_at on posts(published_at desc);
create index idx_posts_category on posts(category);

-- Auto-update updated_at on every row change
create trigger handle_updated_at
  before update on posts
  for each row
  execute procedure extensions.moddatetime(updated_at);
