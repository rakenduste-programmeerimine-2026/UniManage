import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { periood, tana, type Valik } from "@/lib/arvutused";
import { edetabel } from "@/lib/data/aktiivsus";
import { kuvaKuupaev } from "@/lib/vorming";
import { Lahter, Rida, Tabel, Tuhi, Vahelehed } from "../Tabel";

const VALIKUD: { valik: Valik; tekst: string }[] = [
  { valik: "koik", tekst: "Kogu aeg" },
  { valik: "aasta", tekst: "Aasta" },
  { valik: "semester", tekst: "Semester" },
];

function vaartus(v: string | string[] | undefined): string {
  return (Array.isArray(v) ? v[0] : v)?.trim() ?? "";
}

export default function AktiivsusPage(props: PageProps<"/aktiivsus">) {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">Aktiivsustabel</h1>
      <Suspense fallback={<p className="text-zinc-500">Laadin edetabelit…</p>}>
        <Edetabel searchParams={props.searchParams} />
      </Suspense>
    </main>
  );
}

async function Edetabel({ searchParams }: { searchParams: PageProps<"/aktiivsus">["searchParams"] }) {
  const sp = await searchParams;
  // The default year and semester depend on today's date, so render at request time only.
  await connection();
  const valik: Valik = VALIKUD.find((v) => v.valik === vaartus(sp.periood))?.valik ?? "koik";
  const sisestatud = vaartus(sp.kp);
  const kp = /^\d{4}-\d{2}-\d{2}$/.test(sisestatud) ? sisestatud : tana();
  const read = await edetabel(valik, kp);
  const { alates, kuni } = periood(valik, kp);

  const link = (v: Valik) => `/aktiivsus?${new URLSearchParams(v === "koik" ? { periood: v } : { periood: v, kp })}`;

  return (
    <>
      <Vahelehed
        nimi="Periood"
        lehed={VALIKUD.map((v) => ({ href: link(v.valik), tekst: v.tekst, valitud: v.valik === valik }))}
      />

      {valik !== "koik" && (
        <form action="/aktiivsus" className="mb-4 flex flex-wrap items-end gap-3">
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
        <p className="mb-2 text-sm text-zinc-500">
          {kuvaKuupaev(alates)} – {kuvaKuupaev(kuni)}
        </p>
      )}

      {read.length === 0 ? (
        <Tuhi>Selles perioodis ei ole kellelgi punkte.</Tuhi>
      ) : (
        <Tabel veerud={["Koht", "Nimi", "Punktid"]}>
          {read.map((r) => (
            <Rida key={r.liige_id}>
              <Lahter className="w-16 font-medium">{r.koht}.</Lahter>
              <Lahter>
                <Link href={`/liikmed/${r.liige.id}`} className="hover:underline">
                  {r.liige.eesnimi} {r.liige.perekonnanimi}
                </Link>
              </Lahter>
              <Lahter>{r.punktid}</Lahter>
            </Rida>
          ))}
        </Tabel>
      )}
    </>
  );
}
