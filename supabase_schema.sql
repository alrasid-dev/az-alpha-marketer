-- تشغيل هذا الاستعلام بـ Supabase SQL Editor (اختياري - لتفادي تكرار المحتوى فقط)

create table if not exists marketing_posts (
  id uuid default gen_random_uuid() primary key,
  tweet_text text not null,
  theme_type text,
  tweet_id text,
  created_at timestamp with time zone default now()
);

create index if not exists idx_marketing_posts_created_at
  on marketing_posts (created_at desc);
