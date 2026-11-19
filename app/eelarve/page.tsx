import { connection } from "next/server";
import { Suspense } from "react";
import { HOIATUSE_PIIR, tana, type EelarveSeis, type Grupp } from "@/lib/arvutused";
import { eelarved, eelarveSeis, kuludGrupiti } from "@/lib/data/eelarve";
import { kuvaRaha } from "@/lib/vorming";
import { Jaotis, Lahter, Rida, Tabel } from "../Tabel";

export default function EelarvePage(props: PageProps<"/eelarve">) {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">Eelarve</h1>
      <Suspense fallback={<p className="text-zinc-500">Laadin eelarvet…</p>}>
        <Sisu searchParams={props.searchParams} />
      </Suspense>
    </main>
  );
}

async function Sisu({ searchParams }: { searchParams: PageProps<"/eelarve">["searchParams"] }) {
  const { aasta: param } = await searchParams;
  // The default year is the current year, so render at request time only.
  await connection();
  const sisestatud = typeof param === "string" && /^\d{4}$/.test(param) ? Number(param) : null;
  const aasta = sisestatud ?? Number(tana().slice(0, 4));
  const [koikEelarved, seis, grupid] = await Promise.all([eelarved(), eelarveSeis(aasta), kuludGrupiti()]);
  // The selected year is always in the list, also when it has no budget.
  const aastad = [...new Set([aasta, ...koikEelarved.map((e) => e.aasta)])].sort((a, b) => b - a);

  return (
    <>
      <form action="/eelarve" className="mb-6 flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1 text-sm">
          Aasta
          <select
            name="aasta"
            defaultValue={aasta}
            className="rounded-md border border-zinc-300 bg-background px-3 py-2 text-sm dark:border-zinc-700"
          >
            {aastad.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className="rounded-md border border-zinc-300 px-4 py-2 text-sm dark:border-zinc-700">
          Näita
        </button>
      </form>

      <section className="mb-8">
        <h2 className="mb-2 text-lg font-semibold">Eelarve {aasta}</h2>
        {seis ? (
          <Seis seis={seis} />
        ) : (
          <p className="rounded-md border border-dashed border-zinc-300 p-6 text-center text-sm text-zinc-500 dark:border-zinc-700">
            Aastal {aasta} ei ole eelarvet.
          </p>
        )}
      </section>

      <div className="grid gap-x-6 sm:grid-cols-2">
        <Grupid pealkiri="Kulud ürituse liigi järgi" veerg="Liik" grupid={grupid.liigiKaupa} />
        <Grupid pealkiri="Kulud aastate kaupa" veerg="Aasta" grupid={grupid.aastaKaupa} />
      </div>
    </>
  );
}

function Seis({ seis }: { seis: EelarveSeis }) {
  const protsent = seis.kasutus === null ? null : Math.round(seis.kasutus * 100);
  const varv = seis.onUletatud ? "bg-red-600" : seis.onHoiatus ? "bg-amber-500" : "bg-emerald-600";

  return (
    <div className="rounded-md border border-zinc-200 p-4 dark:border-zinc-800">
      <dl className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Naitaja silt="Eelarve" vaartus={kuvaRaha(seis.kogusumma)} />
        <Naitaja silt="Kulud" vaartus={kuvaRaha(seis.kulud)} />
        <Naitaja silt="Jääk" vaartus={kuvaRaha(seis.jaak)} />
        <Naitaja silt="Kasutatud" vaartus={protsent === null ? "—" : `${protsent}%`} />
      </dl>

      {protsent !== null && (
        <div
          role="progressbar"
          aria-label="Kasutatud eelarve"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.min(protsent, 100)}
          aria-valuetext={`${protsent}%`}
          className="h-3 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800"
        >
          <div className={`h-full ${varv}`} style={{ width: `${Math.min(protsent, 100)}%` }} />
        </div>
      )}

      {seis.onUletatud ? (
        <p role="alert" className="mt-3 text-sm font-medium text-red-700 dark:text-red-400">
          Eelarve on ületatud {kuvaRaha(-seis.jaak)} võrra.
        </p>
      ) : (
        seis.onHoiatus && (
          <p role="status" className="mt-3 text-sm font-medium text-amber-700 dark:text-amber-400">
            Eelarvest on kasutatud üle {Math.round(HOIATUSE_PIIR * 100)}%.
          </p>
        )
      )}
      {seis.kulud === 0 && <p className="mt-3 text-sm text-zinc-500">Sel aastal ei ole veel kulusid.</p>}
    </div>
  );
}

function Naitaja({ silt, vaartus }: { silt: string; vaartus: string }) {
  return (
    <div>
      <dt className="text-xs text-zinc-500">{silt}</dt>
      <dd className="text-xl font-semibold">{vaartus}</dd>
    </div>
  );
}

function Grupid({ pealkiri, veerg, grupid }: { pealkiri: string; veerg: string; grupid: Grupp[] }) {
  return (
    <Jaotis pealkiri={pealkiri} tuhi="Kulusid ei ole.">
      {grupid.length > 0 && (
        <Tabel veerud={[veerg, "Summa"]}>
          {grupid.map((g) => (
            <Rida key={g.voti}>
              <Lahter>{g.voti}</Lahter>
              <Lahter>{kuvaRaha(g.summa)}</Lahter>
            </Rida>
          ))}
        </Tabel>
      )}
    </Jaotis>
  );
}
