import Link from "next/link";
import { Suspense } from "react";
import { liikmed } from "@/lib/data/liikmed";
import { kuvaKuupaev } from "@/lib/vorming";

type Otsing = { otsing: string; aasta: string };

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
  const valik: Otsing = { otsing: vaartus(sp.otsing), aasta: vaartus(sp.aasta) };
  const aasta = /^\d{4}$/.test(valik.aasta) ? Number(valik.aasta) : undefined;
  const read = await liikmed({ otsing: valik.otsing || undefined, aasta });

  return (
    <>
      <Filtrid valik={valik} />
      <p className="mb-2 text-sm text-zinc-500">Leitud: {read.length}</p>
      {read.length === 0 ? (
        <p className="rounded-md border border-dashed border-zinc-300 p-6 text-center text-zinc-500 dark:border-zinc-700">
          Ühtegi liiget ei leitud.
        </p>
      ) : (
        <div className="max-h-[70vh] overflow-auto rounded-md border border-zinc-200 dark:border-zinc-800">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 bg-zinc-100 dark:bg-zinc-900">
              <tr>
                <th className="px-3 py-2">Nimi</th>
                <th className="px-3 py-2">E-post</th>
                <th className="px-3 py-2">Liitumise kuupäev</th>
                <th className="px-3 py-2">
                  <span className="sr-only">Toimingud</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {read.map((l) => (
                <tr key={l.id} className="border-t border-zinc-200 dark:border-zinc-800">
                  <td className="px-3 py-2">
                    <Link href={`/liikmed/${l.id}`} className="font-medium hover:underline">
                      {l.eesnimi} {l.perekonnanimi}
                    </Link>
                  </td>
                  <td className="px-3 py-2">{l.email}</td>
                  <td className="px-3 py-2">{kuvaKuupaev(l.liitumise_kp)}</td>
                  <td className="px-3 py-2 text-right">
                    <Link href={`/liikmed/${l.id}/muuda`} className="text-sm hover:underline">
                      Muuda
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
      <button type="submit" className="rounded-md border border-zinc-300 px-4 py-2 text-sm dark:border-zinc-700">
        Otsi
      </button>
      {(valik.otsing || valik.aasta) && (
        <Link href="/liikmed" className="py-2 text-sm text-zinc-500 hover:underline">
          Tühjenda
        </Link>
      )}
    </form>
  );
}
