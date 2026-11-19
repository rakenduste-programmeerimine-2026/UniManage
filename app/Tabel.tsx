import Link from "next/link";
import type { ReactNode } from "react";

/** Section with a heading. Shows the `tuhi` message when there are no children. */
export function Jaotis({
  pealkiri,
  tuhi,
  lisa,
  children,
}: {
  pealkiri: string;
  tuhi: string;
  /** Shown next to the heading, e.g. a link. */
  lisa?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="mb-8">
      <div className="mb-2 flex items-baseline justify-between gap-4">
        <h2 className="text-lg font-semibold">{pealkiri}</h2>
        {lisa}
      </div>
      {children || <Tuhi>{tuhi}</Tuhi>}
    </section>
  );
}

export function Tuhi({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-md border border-dashed border-zinc-300 p-6 text-center text-sm text-zinc-500 dark:border-zinc-700">
      {children}
    </p>
  );
}

/** Table that scrolls with a sticky header, so long lists stay usable. */
export function Tabel({ veerud, children }: { veerud: ReactNode[]; children: ReactNode }) {
  return (
    <div className="max-h-[70vh] overflow-auto rounded-md border border-zinc-200 dark:border-zinc-800">
      <table className="w-full text-left text-sm">
        <thead className="sticky top-0 bg-zinc-100 dark:bg-zinc-900">
          <tr>
            {veerud.map((v, i) => (
              <th key={i} className="px-3 py-2">
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

export function Rida({ children }: { children: ReactNode }) {
  return <tr className="border-t border-zinc-200 dark:border-zinc-800">{children}</tr>;
}

export function Lahter({ children, className = "" }: { children?: ReactNode; className?: string }) {
  return <td className={`px-3 py-2 ${className}`}>{children}</td>;
}

/** Small label, e.g. "Mitteaktiivne" or "Tühistatud". */
export function Silt({ children }: { children: ReactNode }) {
  return (
    <span className="ml-2 inline-block rounded-full bg-zinc-200 px-2 py-0.5 align-middle text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
      {children}
    </span>
  );
}

/** Tabs as links, so the selected tab stays in the URL. */
export function Vahelehed({ nimi, lehed }: { nimi: string; lehed: { href: string; tekst: string; valitud: boolean }[] }) {
  return (
    <nav className="mb-4 flex gap-1 border-b border-zinc-200 dark:border-zinc-800" aria-label={nimi}>
      {lehed.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          aria-current={l.valitud ? "page" : undefined}
          className={`-mb-px border-b-2 px-4 py-2 text-sm ${
            l.valitud ? "border-foreground font-medium" : "border-transparent text-zinc-500 hover:text-foreground"
          }`}
        >
          {l.tekst}
        </Link>
      ))}
    </nav>
  );
}

/** Mark for points that differ from the default points of the role, i.e. were set or changed by hand. */
export function KasitsiMark({ punktid, vaikepunktid }: { punktid: number; vaikepunktid: number }) {
  if (punktid === vaikepunktid) return null;
  return (
    <span title={`Muudetud käsitsi (rolli järgi ${vaikepunktid} p)`} className="ml-1 text-xs text-amber-700 dark:text-amber-400">
      ✎ käsitsi
    </span>
  );
}
