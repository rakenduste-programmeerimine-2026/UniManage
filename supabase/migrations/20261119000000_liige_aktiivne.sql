-- Members can be marked inactive instead of being deleted, so their history stays.
alter table public.liige
  add column if not exists aktiivne boolean not null default true;
