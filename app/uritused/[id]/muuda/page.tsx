import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { urituseKokkuvote, uritusteLiigid } from "@/lib/data/uritused";
import { urliId } from "../../../id";
import UrituseVorm from "../../UrituseVorm";

export default function MuudaUritustPage(props: PageProps<"/uritused/[id]/muuda">) {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <Suspense fallback={<p className="text-zinc-500">Laadin…</p>}>
        <Sisu params={props.params} />
      </Suspense>
    </main>
  );
}

async function Sisu({ params }: { params: PageProps<"/uritused/[id]/muuda">["params"] }) {
  const id = urliId((await params).id);
  const [u, liigid] = await Promise.all([id ? urituseKokkuvote(id) : null, uritusteLiigid()]);
  if (!u) notFound();

  return (
    <>
      <Link href={`/uritused/${u.id}`} className="text-sm text-zinc-500 hover:underline">
        ← {u.nimi}
      </Link>
      <h1 className="mb-6 mt-2 text-2xl font-semibold">Muuda üritust</h1>
      <UrituseVorm
        liigid={liigid}
        uritus={{ id: u.id, nimi: u.nimi, kuupaev: u.kuupaev, koht: u.koht, liik_id: u.liik_id }}
      />
    </>
  );
}
