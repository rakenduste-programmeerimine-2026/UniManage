import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { liikmeProfiil } from "@/lib/data/liikmed";
import { kuvaKuupaev } from "@/lib/vorming";
import { Jaotis, Lahter, Rida, Tabel } from "../../Tabel";
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

      <Jaotis
        pealkiri="Juhatuse ajalugu"
        tuhi="Liige ei ole olnud juhatuses."
        lisa={
          <Link href={`/juhatus?liige=${p.id}`} className="text-sm hover:underline">
            Vaata juhatuse lehel →
          </Link>
        }
      >
        {p.juhatuseliikmesus.length > 0 && (
          <Tabel veerud={["Roll", "Algus", "Lõpp"]}>
            {p.juhatuseliikmesus.map((j) => (
              <Rida key={j.id}>
                <Lahter>{j.roll.nimetus}</Lahter>
                <Lahter>{kuvaKuupaev(j.algus_kp)}</Lahter>
                <Lahter>{j.lopp_kp ? kuvaKuupaev(j.lopp_kp) : "praegu"}</Lahter>
              </Rida>
            ))}
          </Tabel>
        )}
      </Jaotis>

      <Jaotis pealkiri="Osalemised" tuhi="Liige ei ole üritustel osalenud.">
        {p.osalus.length > 0 && (
          <Tabel veerud={["Üritus", "Kuupäev", "Roll", "Punktid"]}>
            {p.osalus.map((o) => (
              <Rida key={o.id}>
                <Lahter>{o.uritus.nimi}</Lahter>
                <Lahter>{kuvaKuupaev(o.uritus.kuupaev)}</Lahter>
                <Lahter>{o.osalusroll.nimetus}</Lahter>
                <Lahter>{o.saadud_punktid}</Lahter>
              </Rida>
            ))}
          </Tabel>
        )}
      </Jaotis>
    </>
  );
}
