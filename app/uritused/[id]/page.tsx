import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { liikmed } from "@/lib/data/liikmed";
import { osalusrollid, urituseKokkuvote } from "@/lib/data/uritused";
import { kuvaKuupaev, kuvaRaha } from "@/lib/vorming";
import { urliId } from "../../id";
import { Jaotis, Lahter, Rida, Silt, Tabel } from "../../Tabel";
import TuhistaUritus from "./TuhistaUritus";
import EemaldaOsaleja from "./EemaldaOsaleja";
import OsalejaVorm from "./OsalejaVorm";

export default function UritusPage(props: PageProps<"/uritused/[id]">) {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <Link href="/uritused" className="text-sm text-zinc-500 hover:underline">
        ← Üritused
      </Link>
      <Suspense fallback={<p className="mt-4 text-zinc-500">Laadin üritust…</p>}>
        <Kokkuvote params={props.params} />
      </Suspense>
    </main>
  );
}

function Naitaja({ vaartus, silt }: { vaartus: string | number; silt: string }) {
  return (
    <div className="rounded-md border border-zinc-200 px-4 py-3 dark:border-zinc-800">
      <p className="text-xl font-semibold">{vaartus}</p>
      <p className="text-xs text-zinc-500">{silt}</p>
    </div>
  );
}

async function Kokkuvote({ params }: { params: PageProps<"/uritused/[id]">["params"] }) {
  const id = urliId((await params).id);
  const [u, koikLiikmed, rollid] = await Promise.all([id ? urituseKokkuvote(id) : null, liikmed(), osalusrollid()]);
  if (!u) notFound();

  return (
    <>
      <div className="mb-6 mt-2 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">
            {u.nimi}
            {u.tuhistatud && <Silt>Tühistatud</Silt>}
          </h1>
          <p className="text-sm text-zinc-500">
            {kuvaKuupaev(u.kuupaev)} · {u.urituse_liik.nimetus}
            {u.koht && ` · ${u.koht}`}
          </p>
        </div>
        <div className="flex items-start gap-3">
          {u.tuhistatud === false && <TuhistaUritus id={u.id} nimi={u.nimi} />}
          <Link
            href={`/uritused/${u.id}/muuda`}
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm dark:border-zinc-700"
          >
            Muuda
          </Link>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Naitaja vaartus={u.osalus.length} silt="osalejat" />
        <Naitaja vaartus={u.punktid_kokku} silt="punkti kokku" />
        <Naitaja vaartus={kuvaRaha(u.kulud_kokku)} silt="kulud kokku" />
        <Naitaja vaartus={u.kulu_osaleja_kohta === null ? "—" : kuvaRaha(u.kulu_osaleja_kohta)} silt="kulu osaleja kohta" />
      </div>

      <section className="mb-8">
        <h2 className="mb-2 text-lg font-semibold">Lisa osaleja</h2>
        <OsalejaVorm
          uritusId={u.id}
          liikmed={koikLiikmed.map(({ id, eesnimi, perekonnanimi }) => ({ id, eesnimi, perekonnanimi }))}
          rollid={rollid}
        />
      </section>

      <Jaotis pealkiri="Osalejad" tuhi="Üritusel ei ole veel osalejaid.">
        {u.osalus.length > 0 && (
          <Tabel veerud={["Nimi", "Roll", "Punktid", <span key="t" className="sr-only">Eemalda</span>]}>
            {u.osalus.map((o) => (
              <Rida key={o.id}>
                <Lahter>
                  <Link href={`/liikmed/${o.liige.id}`} className="font-medium hover:underline">
                    {o.liige.eesnimi} {o.liige.perekonnanimi}
                  </Link>
                </Lahter>
                <Lahter>{o.osalusroll.nimetus}</Lahter>
                <Lahter>{o.saadud_punktid}</Lahter>
                <Lahter className="text-right">
                  <EemaldaOsaleja id={o.id} uritusId={u.id} nimi={`${o.liige.eesnimi} ${o.liige.perekonnanimi}`} />
                </Lahter>
              </Rida>
            ))}
          </Tabel>
        )}
      </Jaotis>

      <Jaotis pealkiri="Kulud" tuhi="Üritusel ei ole kulusid.">
        {u.kulu.length > 0 && (
          <Tabel veerud={["Kuupäev", "Kirjeldus", "Summa"]}>
            {u.kulu.map((k) => (
              <Rida key={k.id}>
                <Lahter>{kuvaKuupaev(k.kuupaev)}</Lahter>
                <Lahter>{k.kirjeldus ?? "—"}</Lahter>
                <Lahter>{kuvaRaha(k.summa)}</Lahter>
              </Rida>
            ))}
          </Tabel>
        )}
      </Jaotis>
    </>
  );
}
