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
