// Pure calculations. No DB access, so `arvutused.test.mjs` can test them with `npm test`.

export type Valik = "koik" | "aasta" | "semester";
export type Periood = { alates: string | null; kuni: string | null };

/** Today in Estonia as YYYY-MM-DD. */
export function tana(): string {
  return new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Tallinn" });
}

/** Date range for the leaderboard. `kp` selects the year or semester. */
export function periood(valik: Valik, kp = tana()): Periood {
  const aasta = Number(kp.slice(0, 4));
  const kuu = Number(kp.slice(5, 7));
  if (valik === "aasta") return { alates: `${aasta}-01-01`, kuni: `${aasta}-12-31` };
  if (valik === "semester") {
    // ponytail: fixed bounds, spring Feb–Aug and autumn Sep–Jan. Change here if the study calendar differs.
    if (kuu >= 2 && kuu <= 8) return { alates: `${aasta}-02-01`, kuni: `${aasta}-08-31` };
    const algus = kuu === 1 ? aasta - 1 : aasta;
    return { alates: `${algus}-09-01`, kuni: `${algus + 1}-01-31` };
  }
  return { alates: null, kuni: null };
}

/** Sums money in cents, so that 0.1 + 0.2 is 0.3. */
export function summa(arvud: number[]): number {
  return arvud.reduce((s, x) => s + Math.round(x * 100), 0) / 100;
}

export type PunktiRida = { liige_id: number; punktid: number };
export type EdetabeliRida = PunktiRida & { koht: number };

/** Sums the points of each member and ranks them. Equal points get the same rank (1, 1, 3). */
export function edetabel(read: PunktiRida[]): EdetabeliRida[] {
  const summad = new Map<number, number>();
  for (const r of read) summad.set(r.liige_id, (summad.get(r.liige_id) ?? 0) + r.punktid);
  const jarjestus = [...summad]
    .map(([liige_id, punktid]) => ({ liige_id, punktid }))
    .sort((a, b) => b.punktid - a.punktid || a.liige_id - b.liige_id);
  let koht = 0;
  return jarjestus.map((r, i) => {
    if (i === 0 || jarjestus[i - 1].punktid !== r.punktid) koht = i + 1;
    return { ...r, koht };
  });
}

/** Average points of all members. Members with no points count as 0. */
export function keskmine(read: PunktiRida[], liikmeteArv: number): number {
  if (liikmeteArv === 0) return 0;
  const kokku = read.reduce((s, r) => s + r.punktid, 0);
  return Math.round((kokku / liikmeteArv) * 100) / 100;
}

export const HOIATUSE_PIIR = 0.8;

export type EelarveSeis = {
  kogusumma: number;
  kulud: number;
  jaak: number;
  /** Used part of the budget, 0..1 and more. `null` when the budget is 0. */
  kasutus: number | null;
  onHoiatus: boolean;
  onUletatud: boolean;
};

export function eelarveSeis(kogusumma: number, kulud: number): EelarveSeis {
  const kasutus = kogusumma > 0 ? kulud / kogusumma : null;
  return {
    kogusumma,
    kulud,
    jaak: summa([kogusumma, -kulud]),
    kasutus,
    onHoiatus: kasutus === null ? kulud > 0 : kasutus >= HOIATUSE_PIIR,
    onUletatud: kulud > kogusumma,
  };
}

export type Grupp = { voti: string; summa: number };

/** Groups rows by key and sums the values. Largest sum first. */
export function grupeeri<T>(read: T[], voti: (r: T) => string, vaartus: (r: T) => number): Grupp[] {
  const grupid = new Map<string, number[]>();
  for (const r of read) {
    const k = voti(r);
    const g = grupid.get(k);
    if (g) g.push(vaartus(r));
    else grupid.set(k, [vaartus(r)]);
  }
  return [...grupid]
    .map(([voti, v]) => ({ voti, summa: summa(v) }))
    .sort((a, b) => b.summa - a.summa);
}

export type KasvuRida = { aasta: number; uusi: number; kokku: number };

/** New members per join year and the running total. Years with no new members are included. */
export function kasvAastati(liitumisKuupaevad: string[]): KasvuRida[] {
  const uusi = new Map<number, number>();
  for (const kp of liitumisKuupaevad) {
    const a = Number(kp.slice(0, 4));
    uusi.set(a, (uusi.get(a) ?? 0) + 1);
  }
  if (uusi.size === 0) return [];
  const aastad = [...uusi.keys()];
  const read: KasvuRida[] = [];
  let kokku = 0;
  for (let a = Math.min(...aastad); a <= Math.max(...aastad); a++) {
    kokku += uusi.get(a) ?? 0;
    read.push({ aasta: a, uusi: uusi.get(a) ?? 0, kokku });
  }
  return read;
}
