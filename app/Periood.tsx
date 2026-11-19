import { connection } from "next/server";
import { periood, tana, type Valik } from "@/lib/arvutused";
import { kuvaKuupaev } from "@/lib/vorming";
import { Vahelehed } from "./Tabel";

const VALIKUD: { valik: Valik; tekst: string }[] = [
  { valik: "koik", tekst: "Kogu aeg" },
  { valik: "aasta", tekst: "Aasta" },
  { valik: "semester", tekst: "Semester" },
];

type Otsing = { [voti: string]: string | string[] | undefined };

function vaartus(v: string | string[] | undefined): string {
  return (Array.isArray(v) ? v[0] : v)?.trim() ?? "";
}

/**
 * Reads the period from the search params `periood` and `kp`. The default date is today,
 * so this waits for the request (`connection()`) before it reads the date.
 */
export async function loePeriood(sp: Otsing): Promise<{ valik: Valik; kp: string }> {
  await connection();
  const valik = VALIKUD.find((v) => v.valik === vaartus(sp.periood))?.valik ?? "koik";
  const kp = vaartus(sp.kp);
  return { valik, kp: /^\d{4}-\d{2}-\d{2}$/.test(kp) ? kp : tana() };
}

/** Tabs for all time / year / semester, a date that picks the year or semester, and the date range. */
export function PerioodiValik({ tee, valik, kp }: { tee: string; valik: Valik; kp: string }) {
  const link = (v: Valik) => `${tee}?${new URLSearchParams(v === "koik" ? { periood: v } : { periood: v, kp })}`;
  const { alates, kuni } = periood(valik, kp);

  return (
    <>
      <Vahelehed
        nimi="Periood"
        lehed={VALIKUD.map((v) => ({ href: link(v.valik), tekst: v.tekst, valitud: v.valik === valik }))}
      />
      {valik !== "koik" && (
        <form action={tee} className="mb-4 flex flex-wrap items-end gap-3">
          <input type="hidden" name="periood" value={valik} />
          <label className="flex flex-col gap-1 text-sm">
            {valik === "aasta" ? "Aasta, kuhu kuupäev jääb" : "Semester, kuhu kuupäev jääb"}
            <input
              type="date"
              name="kp"
              defaultValue={kp}
              className="rounded-md border border-zinc-300 bg-background px-3 py-2 text-sm dark:border-zinc-700"
            />
          </label>
          <button type="submit" className="rounded-md border border-zinc-300 px-4 py-2 text-sm dark:border-zinc-700">
            Näita
          </button>
        </form>
      )}
      {alates && kuni && (
        <p className="mb-4 text-sm text-zinc-500">
          {kuvaKuupaev(alates)} – {kuvaKuupaev(kuni)}
        </p>
      )}
    </>
  );
}
