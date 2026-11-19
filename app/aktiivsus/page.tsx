import Link from "next/link";
import { Suspense } from "react";
import { edetabel } from "@/lib/data/aktiivsus";
import { loePeriood, PerioodiValik } from "../Periood";
import { Lahter, Rida, Tabel, Tuhi } from "../Tabel";

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
  const { valik, kp } = await loePeriood(await searchParams);
  const read = await edetabel(valik, kp);

  return (
    <>
      <PerioodiValik tee="/aktiivsus" valik={valik} kp={kp} />
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
