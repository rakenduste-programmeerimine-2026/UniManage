import { andmed } from "../abi";
import { supabase } from "../supabase";
import { tana } from "../arvutused";
import type { JuhatuseRida, Nimetus } from "../types";

const VALJAD = "id, algus_kp, lopp_kp, liige(id, eesnimi, perekonnanimi), roll(id, nimetus)";

/** Roles that are active today: no end date, or the end date is in the future. */
export async function praeguneJuhatus(): Promise<JuhatuseRida[]> {
  const db = await supabase();
  return andmed(
    await db
      .from("juhatuseliikmesus")
      .select(VALJAD)
      .lte("algus_kp", tana())
      .or(`lopp_kp.is.null,lopp_kp.gt.${tana()}`)
      .order("algus_kp"),
  );
}

/** All terms, newest first. */
export async function juhatuseAjalugu(): Promise<JuhatuseRida[]> {
  const db = await supabase();
  return andmed(await db.from("juhatuseliikmesus").select(VALJAD).order("algus_kp", { ascending: false }));
}

export async function rollid(): Promise<Nimetus[]> {
  const db = await supabase();
  return andmed(await db.from("roll").select("id, nimetus").order("nimetus"));
}
