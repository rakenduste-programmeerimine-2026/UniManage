import Link from "next/link";
import { Suspense } from "react";
import { aktiivseimadLiikmed, kalleimadUritused, liikmeteKasv, osavottLiigiKaupa } from "@/lib/data/aruanded";
import { kuvaKuupaev, kuvaRaha } from "@/lib/vorming";
import { loePeriood, PerioodiValik } from "../Periood";
import { Jaotis, Lahter, Rida, Tabel } from "../Tabel";

const TOP = 10;

export default function AruandedPage(props: PageProps<"/aruanded">) {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">Aruanded</h1>
      <Suspense fallback={<p className="text-zinc-500">Laadin aruandeid…</p>}>
        <Aruanded searchParams={props.searchParams} />
      </Suspense>
    </main>
  );
}

async function Aruanded({ searchParams }: { searchParams: PageProps<"/aruanded">["searchParams"] }) {
  const { valik, kp } = await loePeriood(await searchParams);
  const [aktiivsed, kallid, osavott, kasv] = await Promise.all([
    aktiivseimadLiikmed(valik, TOP, kp),
    kalleimadUritused(valik, TOP, kp),
    osavottLiigiKaupa(valik, kp),
    liikmeteKasv(),
  ]);
  const osavottKokku = osavott.reduce((s, g) => s + g.summa, 0);

  return (
    <>
      <PerioodiValik tee="/aruanded" valik={valik} kp={kp} />

      <div className="grid gap-x-6 lg:grid-cols-2">
        <Jaotis pealkiri={`Aktiivseimad liikmed (top ${TOP})`} tuhi="Selles perioodis ei ole kellelgi punkte.">
          {aktiivsed.length > 0 && (
            <Tabel veerud={["Koht", "Nimi", "Punktid"]}>
              {aktiivsed.map((r) => (
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
        </Jaotis>

        <Jaotis pealkiri={`Kalleimad üritused (top ${TOP})`} tuhi="Selles perioodis ei ole kulusid.">
          {kallid.length > 0 && (
            <Tabel veerud={["Üritus", "Kuupäev", "Kulud"]}>
              {kallid.map((u) => (
                <Rida key={u.id}>
                  <Lahter>
                    <Link href={`/uritused/${u.id}`} className="hover:underline">
                      {u.nimi}
                    </Link>
                  </Lahter>
                  <Lahter>{kuvaKuupaev(u.kuupaev)}</Lahter>
                  <Lahter>{kuvaRaha(u.kulud)}</Lahter>
                </Rida>
              ))}
            </Tabel>
          )}
        </Jaotis>

        <Jaotis pealkiri="Osavõtt ürituse liigi järgi" tuhi="Selles perioodis ei ole osalemisi.">
          {osavott.length > 0 && (
            <Tabel veerud={["Liik", "Osalemisi", "Osa"]}>
              {osavott.map((g) => (
                <Rida key={g.voti}>
                  <Lahter>{g.voti}</Lahter>
                  <Lahter>{g.summa}</Lahter>
                  <Lahter className="w-40">
                    <Osa osa={g.summa / osavottKokku} />
                  </Lahter>
                </Rida>
              ))}
            </Tabel>
          )}
        </Jaotis>

        <Jaotis pealkiri="Liikmete kasv aastate kaupa" tuhi="Liikmeid ei ole.">
          {kasv.length > 0 && (
            <Tabel veerud={["Aasta", "Uusi liikmeid", "Kokku"]}>
              {kasv.map((r) => (
                <Rida key={r.aasta}>
                  <Lahter>{r.aasta}</Lahter>
                  <Lahter>{r.uusi}</Lahter>
                  <Lahter>{r.kokku}</Lahter>
                </Rida>
              ))}
            </Tabel>
          )}
        </Jaotis>
      </div>
      <p className="text-sm text-zinc-500">Liikmete kasv näitab alati kogu aega, sest see põhineb liitumise aastal.</p>
    </>
  );
}

/** Share of the total as a small bar with the percentage. */
function Osa({ osa }: { osa: number }) {
  const protsent = Math.round(osa * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800" aria-hidden>
        <div className="h-full bg-zinc-500" style={{ width: `${protsent}%` }} />
      </div>
      <span className="w-10 text-right text-xs text-zinc-500">{protsent}%</span>
    </div>
  );
}
