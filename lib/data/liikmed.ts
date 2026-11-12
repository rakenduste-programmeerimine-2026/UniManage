import { andmed } from "../abi";
import { supabase } from "../supabase";
import { summa } from "../arvutused";
import type { Liige, Nimetus } from "../types";

export type LiikmeOtsing = { otsing?: string; aasta?: number };

/** Members that match all words of the search (first or last name) and the join year. */
export async function liikmed({ otsing, aasta }: LiikmeOtsing = {}): Promise<Liige[]> {
  const db = await supabase();
  let q = db.from("liige").select("*");
  // Remove characters that have a meaning in PostgREST filters.
  for (const sona of (otsing ?? "").replace(/[,()*%\\"]/g, " ").split(/\s+/).filter(Boolean)) {
    q = q.or(`eesnimi.ilike.%${sona}%,perekonnanimi.ilike.%${sona}%`);
  }
  if (aasta) q = q.gte("liitumise_kp", `${aasta}-01-01`).lte("liitumise_kp", `${aasta}-12-31`);
  return andmed(await q.order("perekonnanimi").order("eesnimi"));
}

export type LiikmeProfiil = Liige & {
  juhatuseliikmesus: { id: number; algus_kp: string; lopp_kp: string | null; roll: Nimetus }[];
  osalus: {
    id: number;
    saadud_punktid: number;
    uritus: { id: number; nimi: string; kuupaev: string };
    osalusroll: Nimetus;
  }[];
  punktid_kokku: number;
};

/** Member with board history, participations and total points. `null` if the member does not exist. */
export async function liikmeProfiil(id: number): Promise<LiikmeProfiil | null> {
  const db = await supabase();
  const liige = andmed<Omit<LiikmeProfiil, "punktid_kokku"> | null>(
    await db
      .from("liige")
      .select(
        "*, juhatuseliikmesus(id, algus_kp, lopp_kp, roll(id, nimetus)), " +
          "osalus(id, saadud_punktid, uritus(id, nimi, kuupaev), osalusroll(id, nimetus))",
      )
      .eq("id", id)
      .maybeSingle(),
  );
  if (!liige) return null;
  liige.juhatuseliikmesus.sort((a, b) => b.algus_kp.localeCompare(a.algus_kp));
  liige.osalus.sort((a, b) => b.uritus.kuupaev.localeCompare(a.uritus.kuupaev));
  return { ...liige, punktid_kokku: summa(liige.osalus.map((o) => o.saadud_punktid)) };
}
