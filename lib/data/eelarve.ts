import { andmed } from "../abi";
import { supabase } from "../supabase";
import { eelarveSeis as arvutaSeis, grupeeri, summa, type EelarveSeis, type Grupp } from "../arvutused";
import type { Eelarve } from "../types";

export async function eelarved(): Promise<Eelarve[]> {
  const db = await supabase();
  return andmed(await db.from("eelarve").select("*").order("aasta", { ascending: false }));
}

/** Budget status of one year. `null` when the year has no budget. */
export async function eelarveSeis(aasta: number): Promise<(EelarveSeis & { aasta: number }) | null> {
  const db = await supabase();
  const eelarve = andmed<Eelarve | null>(await db.from("eelarve").select("*").eq("aasta", aasta).maybeSingle());
  if (!eelarve) return null;
  const kulud = andmed<{ summa: number }[]>(await db.from("kulu").select("summa").eq("eelarve_id", eelarve.id));
  return { aasta, ...arvutaSeis(eelarve.kogusumma, summa(kulud.map((k) => k.summa))) };
}

/** Costs grouped by event type and by year. */
export async function kuludGrupiti(): Promise<{ liigiKaupa: Grupp[]; aastaKaupa: Grupp[] }> {
  const db = await supabase();
  const kulud = andmed<{ summa: number; kuupaev: string; uritus: { urituse_liik: { nimetus: string } } }[]>(
    await db.from("kulu").select("summa, kuupaev, uritus(urituse_liik(nimetus))"),
  );
  return {
    liigiKaupa: grupeeri(kulud, (k) => k.uritus.urituse_liik.nimetus, (k) => k.summa),
    aastaKaupa: grupeeri(kulud, (k) => k.kuupaev.slice(0, 4), (k) => k.summa)
      .sort((a, b) => b.voti.localeCompare(a.voti)),
  };
}
