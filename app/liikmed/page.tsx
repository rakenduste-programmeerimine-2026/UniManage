import Link from "next/link";
import { Suspense } from "react";
import { liikmed } from "@/lib/data/liikmed";
import { kuvaKuupaev } from "@/lib/vorming";
import { Lahter, Rida, Silt, Tabel, Tuhi } from "../Tabel";

type Otsing = { otsing: string; aasta: string; staatus: string };

const STAATUSED: Record<string, boolean> = { aktiivne: true, mitteaktiivne: false };

/** Reads one string value from the search params. */
function vaartus(v: string | string[] | undefined): string {
  return (Array.isArray(v) ? v[0] : v)?.trim() ?? "";
}

export default function LiikmedPage(props: PageProps<"/liikmed">) {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Liikmed</h1>
        <Link
          href="/liikmed/uus"
          className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
        >
          Lisa liige
        </Link>
      </div>
      <Suspense fallback={<p className="text-zinc-500">Laadin liikmeid…</p>}>
        <Nimekiri searchParams={props.searchParams} />
      </Suspense>
    </main>
  );
}

async function Nimekiri({ searchParams }: { searchParams: PageProps<"/liikmed">["searchParams"] }) {
  const sp = await searchParams;
  const valik: Otsing = { otsing: vaartus(sp.otsing), aasta: vaartus(sp.aasta), staatus: vaartus(sp.staatus) };
  const aasta = /^\d{4}$/.test(valik.aasta) ? Number(valik.aasta) : undefined;
  const read = await liikmed({ otsing: valik.otsing || undefined, aasta, aktiivne: STAATUSED[valik.staatus] });

  return (
    <>
      <Filtrid valik={valik} />
      <p className="mb-2 text-sm text-zinc-500">Leitud: {read.length}</p>
      {read.length === 0 ? (
        <Tuhi>Ühtegi liiget ei leitud.</Tuhi>
      ) : (
        <Tabel veerud={["Nimi", "E-post", "Liitumise kuupäev", <span key="t" className="sr-only">Toimingud</span>]}>
          {read.map((l) => (
            <Rida key={l.id}>
              <Lahter>
                <Link href={`/liikmed/${l.id}`} className="font-medium hover:underline">
                  {l.eesnimi} {l.perekonnanimi}
                </Link>
                {l.aktiivne === false && <Silt>Mitteaktiivne</Silt>}
              </Lahter>
              <Lahter>{l.email}</Lahter>
              <Lahter>{kuvaKuupaev(l.liitumise_kp)}</Lahter>
              <Lahter className="text-right">
                <Link href={`/liikmed/${l.id}/muuda`} className="text-sm hover:underline">
                  Muuda
                </Link>
              </Lahter>
            </Rida>
          ))}
        </Tabel>
      )}
    </>
  );
}

/** A GET form, so the search and the filter stay in the URL and the link can be shared. */
function Filtrid({ valik }: { valik: Otsing }) {
  const valja = "rounded-md border border-zinc-300 bg-background px-3 py-2 text-sm dark:border-zinc-700";
  return (
    <form action="/liikmed" className="mb-4 flex flex-wrap items-end gap-3">
      <label className="flex flex-col gap-1 text-sm">
        Nimi
        <input type="search" name="otsing" defaultValue={valik.otsing} placeholder="Otsi nime järgi" className={valja} />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Liitumise aasta
        <input
          type="number"
          name="aasta"
          min={1900}
          max={2100}
          defaultValue={valik.aasta}
          placeholder="nt 2025"
          className={`${valja} w-32`}
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Staatus
        <select name="staatus" defaultValue={valik.staatus} className={valja}>
          <option value="">Kõik</option>
          <option value="aktiivne">Aktiivsed</option>
          <option value="mitteaktiivne">Mitteaktiivsed</option>
        </select>
      </label>
      <button type="submit" className="rounded-md border border-zinc-300 px-4 py-2 text-sm dark:border-zinc-700">
        Otsi
      </button>
      {(valik.otsing || valik.aasta || valik.staatus) && (
        <Link href="/liikmed" className="py-2 text-sm text-zinc-500 hover:underline">
          Tühjenda
        </Link>
      )}
    </form>
  );
}
