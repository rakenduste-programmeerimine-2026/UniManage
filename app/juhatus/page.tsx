import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { tana } from "@/lib/arvutused";
import { juhatuseAjalugu, praeguneJuhatus, rollid } from "@/lib/data/juhatus";
import { liikmed } from "@/lib/data/liikmed";
import type { JuhatuseRida } from "@/lib/types";
import { kuvaKuupaev } from "@/lib/vorming";
import { urliId } from "../id";
import { Jaotis, Lahter, Rida, Tabel } from "../Tabel";
import LopetaRoll from "./LopetaRoll";
import RolliVorm from "./RolliVorm";

export default function JuhatusPage(props: PageProps<"/juhatus">) {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">Juhatus</h1>
      <Suspense fallback={<p className="text-zinc-500">Laadin juhatust…</p>}>
        <Sisu searchParams={props.searchParams} />
      </Suspense>
    </main>
  );
}

const nimi = (r: JuhatuseRida) => `${r.liige.eesnimi} ${r.liige.perekonnanimi}`;

function LiikmeLink({ rida }: { rida: JuhatuseRida }) {
  return (
    <Link href={`/liikmed/${rida.liige.id}`} className="font-medium hover:underline">
      {nimi(rida)}
    </Link>
  );
}

async function Sisu({ searchParams }: { searchParams: PageProps<"/juhatus">["searchParams"] }) {
  const { liige } = await searchParams;
  // praeguneJuhatus and tana use the current date, so render at request time only.
  await connection();
  const liigeId = urliId(liige);
  const [praegune, ajalugu, koikLiikmed, koikRollid] = await Promise.all([
    praeguneJuhatus(),
    juhatuseAjalugu(),
    liikmed(),
    rollid(),
  ]);
  const paev = tana();
  const ajaluguValitud = liigeId ? ajalugu.filter((r) => r.liige.id === liigeId) : ajalugu;
  const valitudLiige = liigeId && koikLiikmed.find((l) => l.id === liigeId);

  return (
    <>
      <Jaotis pealkiri="Praegune juhatus" tuhi="Praegu ei ole juhatuses kedagi.">
        {praegune.length > 0 && (
          <Tabel veerud={["Nimi", "Roll", "Algus", <span key="t" className="sr-only">Lõpeta roll</span>]}>
            {praegune.map((r) => (
              <Rida key={r.id}>
                <Lahter>
                  <LiikmeLink rida={r} />
                </Lahter>
                <Lahter>{r.roll.nimetus}</Lahter>
                <Lahter>{kuvaKuupaev(r.algus_kp)}</Lahter>
                <Lahter className="text-right">
                  {r.lopp_kp ? (
                    <span className="text-sm text-zinc-500">lõpeb {kuvaKuupaev(r.lopp_kp)}</span>
                  ) : (
                    <LopetaRoll id={r.id} nimi={nimi(r)} roll={r.roll.nimetus} algus={r.algus_kp} tana={paev} />
                  )}
                </Lahter>
              </Rida>
            ))}
          </Tabel>
        )}
      </Jaotis>

      <section className="mb-8">
        <h2 className="mb-2 text-lg font-semibold">Määra roll</h2>
        <RolliVorm
          liikmed={koikLiikmed.map(({ id, eesnimi, perekonnanimi }) => ({ id, eesnimi, perekonnanimi }))}
          rollid={koikRollid}
          tana={paev}
        />
      </section>

      <Jaotis
        pealkiri={valitudLiige ? `Ametiaegade ajalugu: ${valitudLiige.eesnimi} ${valitudLiige.perekonnanimi}` : "Ametiaegade ajalugu"}
        tuhi={liigeId ? "Sellel liikmel ei ole juhatuse ajalugu." : "Ajalugu on tühi."}
        lisa={
          liigeId && (
            <Link href="/juhatus" className="text-sm hover:underline">
              Näita kõiki
            </Link>
          )
        }
      >
        {ajaluguValitud.length > 0 && (
          <Tabel veerud={["Nimi", "Roll", "Algus", "Lõpp"]}>
            {ajaluguValitud.map((r) => (
              <Rida key={r.id}>
                <Lahter>
                  <LiikmeLink rida={r} />
                </Lahter>
                <Lahter>{r.roll.nimetus}</Lahter>
                <Lahter>{kuvaKuupaev(r.algus_kp)}</Lahter>
                <Lahter>{r.lopp_kp ? kuvaKuupaev(r.lopp_kp) : "praegu"}</Lahter>
              </Rida>
            ))}
          </Tabel>
        )}
      </Jaotis>
    </>
  );
}
