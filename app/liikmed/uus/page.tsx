import Link from "next/link";
import LiikmeVorm from "../LiikmeVorm";

export default function UusLiigePage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <Link href="/liikmed" className="text-sm text-zinc-500 hover:underline">
        ← Liikmed
      </Link>
      <h1 className="mb-6 mt-2 text-2xl font-semibold">Uus liige</h1>
      <LiikmeVorm />
    </main>
  );
}
