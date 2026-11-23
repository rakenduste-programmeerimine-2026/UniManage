-- Only logged-in users (board members) can read and change data. Anonymous visitors see nothing.
-- Turn off "Allow new users to sign up" in Supabase Auth, otherwise anyone can make an account.
do $$
declare
  t text;
begin
  foreach t in array array[
    'roll', 'urituse_liik', 'osalusroll', 'eelarve', 'liige',
    'juhatuseliikmesus', 'uritus', 'osalus', 'kulu'
  ] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists sisselogitud on public.%I', t);
    execute format(
      'create policy sisselogitud on public.%I for all to authenticated using (true) with check (true)', t
    );
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
  end loop;
end $$;
