import Link from "next/link";
import { Suspense } from "react";
import { uritusteLiigid } from "@/lib/data/uritused";
import UrituseVorm from "../UrituseVorm";

export default function UusUritusPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <Link href="/uritused" className="text-sm text-zinc-500 hover:underline">
        ← Üritused
      </Link>
      <h1 className="mb-6 mt-2 text-2xl font-semibold">Uus üritus</h1>
      <Suspense fallback={<p className="text-zinc-500">Laadin…</p>}>
        <Vorm />
      </Suspense>
    </main>
  );
}

async function Vorm() {
  return <UrituseVorm liigid={await uritusteLiigid()} />;
}
