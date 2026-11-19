"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";

/** Shown when a page fails, e.g. the database is not reachable. */
export default function Viga({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  // In production Next.js replaces the message of server errors, so show it only in development.
  const teade = process.env.NODE_ENV === "development" && error instanceof Error ? error.message : null;

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-semibold">Midagi läks valesti</h1>
      <p className="mb-4 text-zinc-500">{teade ?? "Lehte ei õnnestunud laadida. Proovi uuesti."}</p>
      <button
        type="button"
        onClick={() => retry()}
        className="rounded-md border border-zinc-300 px-4 py-2 text-sm dark:border-zinc-700"
      >
        Proovi uuesti
      </button>
    </main>
  );
}
