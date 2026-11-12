import { andmed, perioodis } from "../abi";
import { supabase } from "../supabase";
import { grupeeri, kasvAastati, type Grupp, type KasvuRida, type Valik } from "../arvutused";
import { edetabel, type EdetabeliKirje } from "./aktiivsus";

/** The `n` most active members of the period. Members with equal points can push the list past `n`. */
export async function aktiivseimadLiikmed(valik: Valik, n = 10, kp?: string): Promise<EdetabeliKirje[]> {
  return (await edetabel(valik, kp)).filter((r) => r.koht <= n);
}

export type KalliUritus = { id: number; nimi: string; kuupaev: string; kulud: number };

/** The `n` events with the largest total costs in the period. */
export async function kalleimadUritused(valik: Valik, n = 10, kp?: string): Promise<KalliUritus[]> {
  const db = await supabase();
  const q = db.from("kulu").select("summa, uritus!inner(id, nimi, kuupaev)");
  const kulud = andmed<{ summa: number; uritus: Omit<KalliUritus, "kulud"> }[]>(await perioodis(q, valik, kp));
  const uritused = new Map(kulud.map((k) => [String(k.uritus.id), k.uritus]));
  return grupeeri(kulud, (k) => String(k.uritus.id), (k) => k.summa)
    .slice(0, n)
    .map((g) => ({ ...uritused.get(g.voti)!, kulud: g.summa }));
}

/** Number of participations for each event type in the period. */
export async function osavottLiigiKaupa(valik: Valik, kp?: string): Promise<Grupp[]> {
  const db = await supabase();
  const q = db.from("osalus").select("uritus!inner(kuupaev, urituse_liik(nimetus))");
  const read = andmed<{ uritus: { urituse_liik: { nimetus: string } } }[]>(await perioodis(q, valik, kp));
  return grupeeri(read, (r) => r.uritus.urituse_liik.nimetus, () => 1);
}

/** New members per join year and the running total. */
export async function liikmeteKasv(): Promise<KasvuRida[]> {
  const db = await supabase();
  const read = andmed<{ liitumise_kp: string }[]>(await db.from("liige").select("liitumise_kp"));
  return kasvAastati(read.map((r) => r.liitumise_kp));
}

