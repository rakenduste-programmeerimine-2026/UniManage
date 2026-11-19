-- Events can be cancelled instead of being deleted, so they stay in the list with a label.
alter table public.uritus
  add column if not exists tuhistatud boolean not null default false;
