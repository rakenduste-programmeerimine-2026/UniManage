// Row types for the DB model. Dates are ISO strings (YYYY-MM-DD).
// TODO(supabase): replace with the generated Supabase types when #14 is done.

export type Liige = {
  id: number;
  eesnimi: string;
  perekonnanimi: string;
  email: string;
  liitumise_kp: string;
};

export type Nimetus = { id: number; nimetus: string }; // ROLL, URITUSE_LIIK

export type Osalusroll = Nimetus & { vaikepunktid: number };

export type Eelarve = { id: number; aasta: number; kogusumma: number };

export type Juhatuseliikmesus = {
  id: number;
  liige_id: number;
  roll_id: number;
  algus_kp: string;
  lopp_kp: string | null;
};

export type Uritus = {
  id: number;
  nimi: string;
  kuupaev: string;
  koht: string | null;
  liik_id: number;
};

export type Osalus = {
  id: number;
  liige_id: number;
  uritus_id: number;
  osalusroll_id: number;
  saadud_punktid: number;
};

export type Kulu = {
  id: number;
  uritus_id: number;
  eelarve_id: number;
  summa: number;
  kirjeldus: string | null;
  kuupaev: string;
};

type Nimi = Pick<Liige, "id" | "eesnimi" | "perekonnanimi">;

export type JuhatuseRida = Pick<Juhatuseliikmesus, "id" | "algus_kp" | "lopp_kp"> & {
  liige: Nimi;
  roll: Nimetus;
};

/** Return value of every server action. Use it with `useActionState`. */
export type Tulemus = { ok: true } | { error: string } | null;
