import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { uritused, uritusteLiigid } from "@/lib/data/uritused";
import type { Nimetus } from "@/lib/types";
import { kuvaKuupaev } from "@/lib/vorming";
import { urliId } from "../id";
import { Lahter, Rida, Tabel, Tuhi } from "../Tabel";

type Aeg = "tulevased" | "moodunud";
type Valik = { aeg: Aeg; liik: string; alates: string; kuni: string };

const KUUPAEV = /^\d{4}-\d{2}-\d{2}$/;

function vaartus(v: string | string[] | undefined): string {
  return (Array.isArray(v) ? v[0] : v)?.trim() ?? "";
}

/** Link to the list with the given filter values. Empty values are left out. */
function listiLink(v: Valik): string {
  const p = new URLSearchParams(Object.entries(v).filter(([, x]) => x));
  return `/uritused?${p}`;
}

export default function UritusedPage(props: PageProps<"/uritused">) {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Üritused</h1>
        <Link
          href="/uritused/uus"
          className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
        >
          Lisa üritus
        </Link>
      </div>
      <Suspense fallback={<p className="text-zinc-500">Laadin üritusi…</p>}>
        <Nimekiri searchParams={props.searchParams} />
      </Suspense>
    </main>
  );
}

async function Nimekiri({ searchParams }: { searchParams: PageProps<"/uritused">["searchParams"] }) {
  const sp = await searchParams;
  // The upcoming/past split depends on today's date, so render at request time only.
  await connection();
  const valik: Valik = {
    aeg: vaartus(sp.aeg) === "moodunud" ? "moodunud" : "tulevased",
    liik: vaartus(sp.liik),
    alates: vaartus(sp.alates),
    kuni: vaartus(sp.kuni),
  };
  const [read, liigid] = await Promise.all([
    uritused({
      aeg: valik.aeg,
      liik_id: urliId(valik.liik) ?? undefined,
      alates: KUUPAEV.test(valik.alates) ? valik.alates : undefined,
      kuni: KUUPAEV.test(valik.kuni) ? valik.kuni : undefined,
    }),
    uritusteLiigid(),
  ]);

  return (
    <>
      <nav className="mb-4 flex gap-1 border-b border-zinc-200 dark:border-zinc-800" aria-label="Ürituste aeg">
        {(["tulevased", "moodunud"] as const).map((aeg) => (
          <Link
            key={aeg}
            href={listiLink({ ...valik, aeg })}
            aria-current={valik.aeg === aeg ? "page" : undefined}
            className={`-mb-px border-b-2 px-4 py-2 text-sm ${
              valik.aeg === aeg ? "border-foreground font-medium" : "border-transparent text-zinc-500 hover:text-foreground"
            }`}
          >
            {aeg === "tulevased" ? "Tulevased" : "Möödunud"}
          </Link>
        ))}
      </nav>

      <Filtrid valik={valik} liigid={liigid} />

      {read.length === 0 ? (
        <Tuhi>Ühtegi üritust ei leitud.</Tuhi>
      ) : (
        <Tabel veerud={["Nimi", "Kuupäev", "Liik", "Koht", <span key="t" className="sr-only">Toimingud</span>]}>
          {read.map((u) => (
            <Rida key={u.id}>
              <Lahter>
                <Link href={`/uritused/${u.id}`} className="font-medium hover:underline">
                  {u.nimi}
                </Link>
              </Lahter>
              <Lahter>{kuvaKuupaev(u.kuupaev)}</Lahter>
              <Lahter>{u.urituse_liik.nimetus}</Lahter>
              <Lahter>{u.koht ?? "—"}</Lahter>
              <Lahter className="text-right">
                <Link href={`/uritused/${u.id}/muuda`} className="text-sm hover:underline">
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

/** A GET form, so the filters stay in the URL. */
function Filtrid({ valik, liigid }: { valik: Valik; liigid: Nimetus[] }) {
  const valja = "rounded-md border border-zinc-300 bg-background px-3 py-2 text-sm dark:border-zinc-700";
  const filtreeritud = valik.liik || valik.alates || valik.kuni;
  return (
    <form action="/uritused" className="mb-4 flex flex-wrap items-end gap-3">
      <input type="hidden" name="aeg" value={valik.aeg} />
      <label className="flex flex-col gap-1 text-sm">
        Liik
        <select name="liik" defaultValue={valik.liik} className={valja}>
          <option value="">Kõik</option>
          {liigid.map((l) => (
            <option key={l.id} value={l.id}>
              {l.nimetus}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Alates
        <input type="date" name="alates" defaultValue={valik.alates} className={valja} />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Kuni
        <input type="date" name="kuni" defaultValue={valik.kuni} className={valja} />
      </label>
      <button type="submit" className="rounded-md border border-zinc-300 px-4 py-2 text-sm dark:border-zinc-700">
        Filtreeri
      </button>
      {filtreeritud && (
        <Link href={listiLink({ aeg: valik.aeg, liik: "", alates: "", kuni: "" })} className="py-2 text-sm text-zinc-500 hover:underline">
          Tühjenda
        </Link>
      )}
    </form>
  );
}
