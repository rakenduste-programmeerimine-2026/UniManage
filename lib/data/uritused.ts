import { andmed } from "../abi";
import { supabase } from "../supabase";
import { summa, tana } from "../arvutused";
import type { Kulu, Liige, Nimetus, Osalusroll, Uritus } from "../types";

export type UrituseFilter = {
  liik_id?: number;
  alates?: string;
  kuni?: string;
  /** Upcoming events include today. */
  aeg?: "tulevased" | "moodunud";
};

export type UrituseRida = Uritus & { urituse_liik: Nimetus };

/** Upcoming events: soonest first. Past events and all events: newest first. */
export async function uritused({ liik_id, alates, kuni, aeg }: UrituseFilter = {}): Promise<UrituseRida[]> {
  const db = await supabase();
  let q = db.from("uritus").select("*, urituse_liik(id, nimetus)");
  if (liik_id) q = q.eq("liik_id", liik_id);
  if (alates) q = q.gte("kuupaev", alates);
  if (kuni) q = q.lte("kuupaev", kuni);
  if (aeg === "tulevased") q = q.gte("kuupaev", tana());
  if (aeg === "moodunud") q = q.lt("kuupaev", tana());
  return andmed(await q.order("kuupaev", { ascending: aeg === "tulevased" }));
}

export type UrituseKokkuvote = UrituseRida & {
  osalus: {
    id: number;
    saadud_punktid: number;
    liige: Pick<Liige, "id" | "eesnimi" | "perekonnanimi">;
    osalusroll: Nimetus;
  }[];
  kulu: Pick<Kulu, "id" | "summa" | "kirjeldus" | "kuupaev">[];
  punktid_kokku: number;
  kulud_kokku: number;
  /** `null` when the event has no participants. */
  kulu_osaleja_kohta: number | null;
};

/** Event with participants, costs and totals. `null` if the event does not exist. */
export async function urituseKokkuvote(id: number): Promise<UrituseKokkuvote | null> {
  const db = await supabase();
  const u = andmed<Omit<UrituseKokkuvote, "punktid_kokku" | "kulud_kokku" | "kulu_osaleja_kohta"> | null>(
    await db
      .from("uritus")
      .select(
        "*, urituse_liik(id, nimetus), kulu(id, summa, kirjeldus, kuupaev), " +
          "osalus(id, saadud_punktid, liige(id, eesnimi, perekonnanimi), osalusroll(id, nimetus))",
      )
      .eq("id", id)
      .maybeSingle(),
  );
  if (!u) return null;
  const kulud_kokku = summa(u.kulu.map((k) => k.summa));
  return {
    ...u,
    punktid_kokku: summa(u.osalus.map((o) => o.saadud_punktid)),
    kulud_kokku,
    kulu_osaleja_kohta: u.osalus.length ? Math.round((kulud_kokku / u.osalus.length) * 100) / 100 : null,
  };
}

export async function uritusteLiigid(): Promise<Nimetus[]> {
  const db = await supabase();
  return andmed(await db.from("urituse_liik").select("id, nimetus").order("nimetus"));
}

export async function osalusrollid(): Promise<Osalusroll[]> {
  const db = await supabase();
  const q = db.from("osalusroll").select("id, nimetus, vaikepunktid");
  return andmed(await q.order("vaikepunktid", { ascending: false }));
}
