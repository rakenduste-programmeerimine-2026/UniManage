import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import { liikmeProfiil } from "@/lib/data/liikmed";
import { kuvaKuupaev } from "@/lib/vorming";
import { liikmeId } from "./liikmeId";

export default function LiikmeProfiilPage(props: PageProps<"/liikmed/[id]">) {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <Link href="/liikmed" className="text-sm text-zinc-500 hover:underline">
        ← Liikmed
      </Link>
      <Suspense fallback={<p className="mt-4 text-zinc-500">Laadin profiili…</p>}>
        <Profiil params={props.params} />
      </Suspense>
    </main>
  );
}

async function Profiil({ params }: { params: PageProps<"/liikmed/[id]">["params"] }) {
  const id = liikmeId((await params).id);
  const p = id && (await liikmeProfiil(id));
  if (!p) notFound();

  return (
    <>
      <div className="mb-6 mt-2 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">
            {p.eesnimi} {p.perekonnanimi}
          </h1>
          <p className="text-sm text-zinc-500">
            {p.email} · liitus {kuvaKuupaev(p.liitumise_kp)}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-2xl font-semibold">{p.punktid_kokku}</p>
            <p className="text-xs text-zinc-500">punkti kokku</p>
          </div>
          <Link
            href={`/liikmed/${p.id}/muuda`}
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm dark:border-zinc-700"
          >
            Muuda
          </Link>
        </div>
      </div>

      <Jaotis pealkiri="Juhatuse ajalugu" tuhi="Liige ei ole olnud juhatuses.">
        {p.juhatuseliikmesus.length > 0 && (
          <Tabel veerud={["Roll", "Algus", "Lõpp"]}>
            {p.juhatuseliikmesus.map((j) => (
              <tr key={j.id} className="border-t border-zinc-200 dark:border-zinc-800">
                <td className="px-3 py-2">{j.roll.nimetus}</td>
                <td className="px-3 py-2">{kuvaKuupaev(j.algus_kp)}</td>
                <td className="px-3 py-2">{j.lopp_kp ? kuvaKuupaev(j.lopp_kp) : "praegu"}</td>
              </tr>
            ))}
          </Tabel>
        )}
      </Jaotis>

      <Jaotis pealkiri="Osalemised" tuhi="Liige ei ole üritustel osalenud.">
        {p.osalus.length > 0 && (
          <Tabel veerud={["Üritus", "Kuupäev", "Roll", "Punktid"]}>
            {p.osalus.map((o) => (
              <tr key={o.id} className="border-t border-zinc-200 dark:border-zinc-800">
                <td className="px-3 py-2">{o.uritus.nimi}</td>
                <td className="px-3 py-2">{kuvaKuupaev(o.uritus.kuupaev)}</td>
                <td className="px-3 py-2">{o.osalusroll.nimetus}</td>
                <td className="px-3 py-2">{o.saadud_punktid}</td>
              </tr>
            ))}
          </Tabel>
        )}
      </Jaotis>
    </>
  );
}

/** Section with a heading. Shows the `tuhi` message when there are no children. */
function Jaotis({ pealkiri, tuhi, children }: { pealkiri: string; tuhi: string; children: ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="mb-2 text-lg font-semibold">{pealkiri}</h2>
      {children || (
        <p className="rounded-md border border-dashed border-zinc-300 p-4 text-sm text-zinc-500 dark:border-zinc-700">
          {tuhi}
        </p>
      )}
    </section>
  );
}

function Tabel({ veerud, children }: { veerud: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-md border border-zinc-200 dark:border-zinc-800">
      <table className="w-full text-left text-sm">
        <thead className="bg-zinc-100 dark:bg-zinc-900">
          <tr>
            {veerud.map((v) => (
              <th key={v} className="px-3 py-2">
                {v}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
