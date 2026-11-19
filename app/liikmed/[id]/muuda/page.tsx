import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { liikmeProfiil } from "@/lib/data/liikmed";
import LiikmeVorm from "../../LiikmeVorm";
import { urliId } from "../../../id";

export default function MuudaLiigetPage(props: PageProps<"/liikmed/[id]/muuda">) {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <Suspense fallback={<p className="text-zinc-500">Laadin…</p>}>
        <Sisu params={props.params} />
      </Suspense>
    </main>
  );
}

async function Sisu({ params }: { params: PageProps<"/liikmed/[id]/muuda">["params"] }) {
  const id = urliId((await params).id);
  const profiil = id && (await liikmeProfiil(id));
  if (!profiil) notFound();
  const { eesnimi, perekonnanimi, email, liitumise_kp } = profiil;

  return (
    <>
      <Link href={`/liikmed/${profiil.id}`} className="text-sm text-zinc-500 hover:underline">
        ← {eesnimi} {perekonnanimi}
      </Link>
      <h1 className="mb-6 mt-2 text-2xl font-semibold">Muuda liiget</h1>
      <LiikmeVorm liige={{ id: profiil.id, eesnimi, perekonnanimi, email, liitumise_kp }} />
    </>
  );
}
