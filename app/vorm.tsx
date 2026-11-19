"use client";

import { startTransition, useActionState, type FormEvent } from "react";
import type { Tulemus } from "@/lib/types";

type Toiming = (eelmine: Tulemus, fd: FormData) => Promise<Tulemus>;

/**
 * Runs a server action from a form and keeps its `Tulemus`.
 * The action is called from onSubmit instead of <form action>, so React does not clear
 * the fields when the server returns an error. `kinnitus` asks for confirmation first.
 */
export function useVorm(toiming: Toiming, kinnitus?: string) {
  const [tulemus, saada, ootel] = useActionState(toiming, null);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (kinnitus && !window.confirm(kinnitus)) return;
    const fd = new FormData(e.currentTarget);
    startTransition(() => saada(fd));
  }

  return { tulemus, onSubmit, ootel };
}

/** The error message of a `Tulemus`, or nothing. */
export function VormiViga({ tulemus }: { tulemus: Tulemus }) {
  if (!tulemus || !("error" in tulemus)) return null;
  return (
    <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
      {tulemus.error}
    </p>
  );
}

type KinnitusNupuProps = {
  toiming: Toiming;
  /** Hidden form fields sent to the action. */
  valjad: Record<string, string | number>;
  kinnitus: string;
  tekst: string;
  ootelTekst: string;
  /** "oht" for actions that remove or end something. */
  stiil?: "oht" | "tavaline";
};

/** One button that runs a server action after the user confirms. Shows the error from the server. */
export function KinnitusNupp({ toiming, valjad, kinnitus, tekst, ootelTekst, stiil = "oht" }: KinnitusNupuProps) {
  const { tulemus, onSubmit, ootel } = useVorm(toiming, kinnitus);
  const varv =
    stiil === "oht"
      ? "border-red-300 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950"
      : "border-zinc-300 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900";

  return (
    <form onSubmit={onSubmit} className="flex flex-col items-end gap-1">
      {Object.entries(valjad).map(([nimi, vaartus]) => (
        <input key={nimi} type="hidden" name={nimi} value={vaartus} />
      ))}
      <button type="submit" disabled={ootel} className={`rounded-md border px-3 py-1 text-sm disabled:opacity-50 ${varv}`}>
        {ootel ? ootelTekst : tekst}
      </button>
      <VormiViga tulemus={tulemus} />
    </form>
  );
}
