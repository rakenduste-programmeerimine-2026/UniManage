-- Demo data. Run once on an empty database (Supabase SQL editor, or `supabase db push --include-seed`).
-- Rows are linked by name/email, not by id. Needs migration 20261123000000_id_identity.
begin;

do $$
begin
  if exists (select 1 from public.liige) then
    raise exception 'Seed: tabelis liige on juba andmeid, seed jääb vahele.';
  end if;
end $$;

-- Lookup tables (skip names that already exist)
insert into public.roll (nimetus)
select v.n from (values ('Esimees'), ('Aseesimees'), ('Laekur'), ('Sekretär'), ('Kommunikatsioonijuht')) v(n)
where not exists (select 1 from public.roll r where r.nimetus = v.n);

insert into public.urituse_liik (nimetus)
select v.n from (values ('Pidu'), ('Koolitus'), ('Heategevus'), ('Sport'), ('Koosolek')) v(n)
where not exists (select 1 from public.urituse_liik r where r.nimetus = v.n);

insert into public.osalusroll (nimetus, vaikepunktid)
select v.n, v.p from (values ('Korraldaja', 10), ('Abiline', 5), ('Osaleja', 2)) v(n, p)
where not exists (select 1 from public.osalusroll r where r.nimetus = v.n);

insert into public.eelarve (aasta, kogusumma)
select v.a, v.s from (values (2025, 4000), (2026, 5000)) v(a, s)
where not exists (select 1 from public.eelarve e where e.aasta = v.a);

insert into public.liige (eesnimi, perekonnanimi, email, liitumise_kp, aktiivne) values
  ('Mari',    'Tamm',     'mari.tamm@demo.ee',     '2024-09-05', true),
  ('Jaan',    'Kask',     'jaan.kask@demo.ee',     '2024-09-05', true),
  ('Liisa',   'Saar',     'liisa.saar@demo.ee',    '2024-10-12', true),
  ('Karl',    'Mägi',     'karl.magi@demo.ee',     '2025-02-01', true),
  ('Anna',    'Lepp',     'anna.lepp@demo.ee',     '2025-03-15', true),
  ('Oskar',   'Rebane',   'oskar.rebane@demo.ee',  '2025-09-03', true),
  ('Kertu',   'Ilves',    'kertu.ilves@demo.ee',   '2025-09-03', true),
  ('Markus',  'Pärn',     'markus.parn@demo.ee',   '2025-11-20', true),
  ('Helena',  'Kuusk',    'helena.kuusk@demo.ee',  '2026-02-10', true),
  ('Rasmus',  'Oja',      'rasmus.oja@demo.ee',    '2026-09-04', true),
  ('Triin',   'Valk',     'triin.valk@demo.ee',    '2026-09-04', true),
  ('Siim',    'Kivi',     'siim.kivi@demo.ee',     '2024-09-05', false);

-- Board: previous term ended 2025-08-31, current term has no end date
insert into public.juhatuseliikmesus (liige_id, roll_id, algus_kp, lopp_kp)
select l.id, r.id, v.algus::date, v.lopp::date
from (values
  ('siim.kivi@demo.ee',   'Esimees',              '2024-09-01', '2025-08-31'),
  ('mari.tamm@demo.ee',   'Laekur',               '2024-09-01', '2025-08-31'),
  ('jaan.kask@demo.ee',   'Sekretär',             '2024-09-01', '2025-08-31'),
  ('mari.tamm@demo.ee',   'Esimees',              '2025-09-01', null),
  ('liisa.saar@demo.ee',  'Aseesimees',           '2025-09-01', null),
  ('karl.magi@demo.ee',   'Laekur',               '2025-09-01', null),
  ('anna.lepp@demo.ee',   'Sekretär',             '2025-09-01', null),
  ('kertu.ilves@demo.ee', 'Kommunikatsioonijuht', '2026-01-15', null)
) v(email, roll, algus, lopp)
join public.liige l on l.email = v.email
join public.roll r on r.nimetus = v.roll;

insert into public.uritus (nimi, kuupaev, koht, liik_id, tuhistatud)
select v.nimi, v.kp::date, v.koht, ul.id, v.tuh
from (values
  ('Rebaste ristimine 2025',  '2025-09-26', 'Aula',          'Pidu',       false),
  ('Juhatuse koolitus',       '2025-10-18', 'Ruum A-101',    'Koolitus',   false),
  ('Toidupangakogumine',      '2025-11-29', 'Kaubanduskeskus','Heategevus', false),
  ('Jõulupidu 2025',          '2025-12-17', 'Aula',          'Pidu',       false),
  ('Talvine korvpalliturniir','2026-02-14', 'Spordisaal',    'Sport',      false),
  ('Üldkoosolek',             '2026-03-12', 'Ruum A-101',    'Koosolek',   false),
  ('Kevadball',               '2026-04-24', 'Kultuurikeskus','Pidu',       true),
  ('Rebaste ristimine 2026',  '2026-09-25', 'Aula',          'Pidu',       false),
  ('Esinemiskoolitus',        '2026-10-22', 'Ruum B-204',    'Koolitus',   false),
  ('Jõulupidu 2026',          '2026-12-16', 'Aula',          'Pidu',       false)
) v(nimi, kp, koht, liik, tuh)
join public.urituse_liik ul on ul.nimetus = v.liik;

-- saadud_punktid is filled from osalusroll.vaikepunktid by the osalus_vaikepunktid trigger
insert into public.osalus (liige_id, uritus_id, osalusroll_id)
select l.id, u.id, r.id
from (values
  ('mari.tamm@demo.ee',    'Rebaste ristimine 2025',   'Korraldaja'),
  ('liisa.saar@demo.ee',   'Rebaste ristimine 2025',   'Abiline'),
  ('jaan.kask@demo.ee',    'Rebaste ristimine 2025',   'Osaleja'),
  ('oskar.rebane@demo.ee', 'Rebaste ristimine 2025',   'Osaleja'),
  ('kertu.ilves@demo.ee',  'Rebaste ristimine 2025',   'Osaleja'),
  ('anna.lepp@demo.ee',    'Juhatuse koolitus',        'Korraldaja'),
  ('mari.tamm@demo.ee',    'Juhatuse koolitus',        'Osaleja'),
  ('karl.magi@demo.ee',    'Juhatuse koolitus',        'Osaleja'),
  ('liisa.saar@demo.ee',   'Juhatuse koolitus',        'Osaleja'),
  ('karl.magi@demo.ee',    'Toidupangakogumine',       'Korraldaja'),
  ('oskar.rebane@demo.ee', 'Toidupangakogumine',       'Abiline'),
  ('kertu.ilves@demo.ee',  'Toidupangakogumine',       'Abiline'),
  ('liisa.saar@demo.ee',   'Jõulupidu 2025',           'Korraldaja'),
  ('mari.tamm@demo.ee',    'Jõulupidu 2025',           'Abiline'),
  ('jaan.kask@demo.ee',    'Jõulupidu 2025',           'Osaleja'),
  ('markus.parn@demo.ee',  'Jõulupidu 2025',           'Osaleja'),
  ('oskar.rebane@demo.ee', 'Talvine korvpalliturniir', 'Korraldaja'),
  ('markus.parn@demo.ee',  'Talvine korvpalliturniir', 'Abiline'),
  ('karl.magi@demo.ee',    'Talvine korvpalliturniir', 'Osaleja'),
  ('mari.tamm@demo.ee',    'Üldkoosolek',              'Korraldaja'),
  ('anna.lepp@demo.ee',    'Üldkoosolek',              'Abiline'),
  ('helena.kuusk@demo.ee', 'Üldkoosolek',              'Osaleja'),
  ('jaan.kask@demo.ee',    'Üldkoosolek',              'Osaleja'),
  ('kertu.ilves@demo.ee',  'Rebaste ristimine 2026',   'Korraldaja'),
  ('helena.kuusk@demo.ee', 'Rebaste ristimine 2026',   'Abiline'),
  ('rasmus.oja@demo.ee',   'Rebaste ristimine 2026',   'Osaleja'),
  ('triin.valk@demo.ee',   'Rebaste ristimine 2026',   'Osaleja'),
  ('anna.lepp@demo.ee',    'Esinemiskoolitus',         'Korraldaja'),
  ('triin.valk@demo.ee',   'Esinemiskoolitus',         'Osaleja'),
  ('rasmus.oja@demo.ee',   'Esinemiskoolitus',         'Osaleja')
) v(email, uritus, roll)
join public.liige l on l.email = v.email
join public.uritus u on u.nimi = v.uritus
join public.osalusroll r on r.nimetus = v.roll;

-- Manual points correction, so the activity table shows one
update public.osalus set saadud_punktid = 15
where liige_id = (select id from public.liige where email = 'mari.tamm@demo.ee')
  and uritus_id = (select id from public.uritus where nimi = 'Rebaste ristimine 2025');

insert into public.kulu (uritus_id, eelarve_id, summa, kirjeldus, kuupaev)
select u.id, e.id, v.summa, v.kirjeldus, v.kp::date
from (values
  ('Rebaste ristimine 2025',   2025, 450.00, 'Toit ja jook',          '2025-09-24'),
  ('Rebaste ristimine 2025',   2025, 180.50, 'Kaunistused',           '2025-09-22'),
  ('Juhatuse koolitus',        2025, 300.00, 'Koolitaja tasu',        '2025-10-18'),
  ('Toidupangakogumine',       2025,  45.90, 'Kotid ja sildid',       '2025-11-27'),
  ('Jõulupidu 2025',           2025, 820.00, 'DJ ja helitehnika',     '2025-12-10'),
  ('Jõulupidu 2025',           2025, 610.40, 'Toitlustus',            '2025-12-17'),
  ('Talvine korvpalliturniir', 2026, 120.00, 'Auhinnad',              '2026-02-12'),
  ('Üldkoosolek',              2026,  60.00, 'Kohvipaus',             '2026-03-12'),
  ('Kevadball',                2026, 500.00, 'Saali broneeringu tasu','2026-03-01'),
  ('Rebaste ristimine 2026',   2026, 520.00, 'Toit ja jook',          '2026-09-23'),
  ('Rebaste ristimine 2026',   2026, 210.00, 'Kaunistused',           '2026-09-21'),
  ('Esinemiskoolitus',         2026, 350.00, 'Koolitaja tasu',        '2026-10-22'),
  ('Jõulupidu 2026',           2026, 900.00, 'Ettemaks: DJ',          '2026-11-15')
) v(uritus, aasta, summa, kirjeldus, kp)
join public.uritus u on u.nimi = v.uritus
join public.eelarve e on e.aasta = v.aasta;

commit;
