-- New participant without explicit points gets the role's default points (osalusroll.vaikepunktid).
create or replace function public.osalus_vaikepunktid()
returns trigger
language plpgsql
as $$
begin
  if new.saadud_punktid is null then
    select vaikepunktid into new.saadud_punktid
    from public.osalusroll
    where id = new.osalusroll_id;
  end if;
  return new;
end;
$$;

drop trigger if exists osalus_vaikepunktid on public.osalus;
create trigger osalus_vaikepunktid
  before insert on public.osalus
  for each row execute function public.osalus_vaikepunktid();
