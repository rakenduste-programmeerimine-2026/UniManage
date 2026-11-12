// Helpers for the server actions and the data queries.
import { periood, type Valik } from "./arvutused";
import type { Tulemus } from "./types";

/** An error that is safe to show to the user. */
export class Viga extends Error {}

type DbVastus = { data: unknown; error: { code?: string; message: string } | null };

const DB_VEAD: Record<string, string> = {
  "23505": "Selline kirje on juba olemas.",
  "23503": "Seotud kirjet ei leitud või seda kasutatakse mujal.",
  "23514": "Andmed ei vasta reeglitele (kontrolli kuupäevi ja summasid).",
};

/** Returns the data of a Supabase response, or throws. */
export function andmed<T>(vastus: DbVastus): T {
  if (vastus.error) {
    const teade = vastus.error.code && DB_VEAD[vastus.error.code];
    if (teade) throw new Viga(teade);
    console.error(vastus.error);
    throw new Error("Andmebaasi viga.");
  }
  return vastus.data as T;
}

/** Limits a query that joins `uritus!inner` to the events of the period. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function perioodis(q: any, valik: Valik, kp?: string) {
  const { alates, kuni } = periood(valik, kp);
  if (alates) q = q.gte("uritus.kuupaev", alates);
  if (kuni) q = q.lte("uritus.kuupaev", kuni);
  return q;
}

/** Runs the body of a server action and returns a `Tulemus` for the form. */
export async function toiming(keha: () => Promise<void>): Promise<Tulemus> {
  // TODO(auth): check the user session here. Until then, any POST request can call the actions.
  try {
    await keha();
    return { ok: true };
  } catch (e) {
    if (e instanceof Viga) return { error: e.message };
    console.error(e);
    return { error: "Salvestamine ebaõnnestus." };
  }
}

// Form field parsers. Each one throws `Viga` with the field name when the value is not valid.

export function tekst(fd: FormData, nimi: string, max: number): string {
  const v = String(fd.get(nimi) ?? "").trim();
  if (!v) throw new Viga(`Väli "${nimi}" on kohustuslik.`);
  if (v.length > max) throw new Viga(`Väli "${nimi}" on liiga pikk (max ${max}).`);
  return v;
}

export function valikulineTekst(fd: FormData, nimi: string, max: number): string | null {
  return String(fd.get(nimi) ?? "").trim() ? tekst(fd, nimi, max) : null;
}

export function email(fd: FormData, nimi: string): string {
  const v = tekst(fd, nimi, 100).toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) throw new Viga("E-posti aadress ei ole korrektne.");
  return v;
}

export function kuupaev(fd: FormData, nimi: string): string {
  const v = String(fd.get(nimi) ?? "");
  const d = new Date(`${v}T00:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v) || d.toISOString().slice(0, 10) !== v) {
    throw new Viga(`Väli "${nimi}" peab olema kuupäev.`);
  }
  return v;
}

export function taisarv(fd: FormData, nimi: string, min = 1): number {
  const v = Number(fd.get(nimi));
  if (!Number.isInteger(v) || v < min) throw new Viga(`Väli "${nimi}" ei ole korrektne arv.`);
  return v;
}

/** Optional whole number. Empty field gives `null`. */
export function valikulineTaisarv(fd: FormData, nimi: string, min = 0): number | null {
  return String(fd.get(nimi) ?? "").trim() ? taisarv(fd, nimi, min) : null;
}

/** Money: more than 0, at most 2 decimals. Accepts "12,50". */
export function raha(fd: FormData, nimi: string): number {
  const v = String(fd.get(nimi) ?? "").trim().replace(",", ".");
  if (!/^\d{1,8}(\.\d{1,2})?$/.test(v) || Number(v) <= 0) {
    throw new Viga(`Väli "${nimi}" peab olema summa, mis on suurem kui 0.`);
  }
  return Number(v);
}
