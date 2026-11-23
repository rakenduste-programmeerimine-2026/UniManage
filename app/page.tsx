import Link from "next/link";
import { logiValja } from "@/lib/actions/auth";

const lehed = [
  { href: "/liikmed", nimi: "Liikmed" },
  { href: "/uritused", nimi: "Üritused" },
  { href: "/eelarve", nimi: "Eelarve" },
  { href: "/juhatus", nimi: "Juhatus" },
  { href: "/aktiivsus", nimi: "Aktiivsus" },
  { href: "/aruanded", nimi: "Aruanded" },
] as const;

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">UniManage</h1>
        <form action={logiValja}>
          <button type="submit" className="rounded-md border border-zinc-300 px-3 py-1 text-sm hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900">
            Logi välja
          </button>
        </form>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {lehed.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="block rounded-lg border border-zinc-200 px-4 py-3 font-medium hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
            >
              {l.nimi}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
