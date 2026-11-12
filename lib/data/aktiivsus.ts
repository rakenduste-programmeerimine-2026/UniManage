import { andmed, perioodis } from "../abi";
import { supabase } from "../supabase";
import { edetabel as jarjesta, keskmine, type EdetabeliRida, type PunktiRida, type Valik } from "../arvutused";
import type { Liige } from "../types";

type Nimi = Pick<Liige, "id" | "eesnimi" | "perekonnanimi">;

// ponytail: loads all participation rows of the period and sums them in JS.
// Fine for one student council. Move to a SQL view or RPC function if it gets slow.
async function punktiRead(valik: Valik, kp?: string): Promise<(PunktiRida & { liige: Nimi })[]> {
  const db = await supabase();
  const q = db
    .from("osalus")
    .select("liige_id, saadud_punktid, liige(id, eesnimi, perekonnanimi), uritus!inner(kuupaev)");
  const read = andmed<{ liige_id: number; saadud_punktid: number; liige: Nimi }[]>(await perioodis(q, valik, kp));
  return read.map((r) => ({ liige_id: r.liige_id, punktid: r.saadud_punktid, liige: r.liige }));
}

export type EdetabeliKirje = EdetabeliRida & { liige: Nimi };

/** Leaderboard for all time, the year of `kp` or the semester of `kp`. Only members with points are listed. */
export async function edetabel(valik: Valik, kp?: string): Promise<EdetabeliKirje[]> {
  const read = await punktiRead(valik, kp);
  const nimed = new Map(read.map((r) => [r.liige_id, r.liige]));
  return jarjesta(read).map((r) => ({ ...r, liige: nimed.get(r.liige_id)! }));
}

/** Points of one member and the average of all members in the same period. */
export async function liikmeVordlus(liige_id: number, valik: Valik, kp?: string) {
  const read = await punktiRead(valik, kp);
  const db = await supabase();
  const liikmed = await db.from("liige").select("id", { count: "exact", head: true });
  andmed(liikmed);
  return {
    punktid: read.filter((r) => r.liige_id === liige_id).reduce((s, r) => s + r.punktid, 0),
    keskmine: keskmine(read, liikmed.count ?? 0),
  };
}
