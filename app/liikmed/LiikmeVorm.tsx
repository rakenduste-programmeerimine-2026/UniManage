"use client";

import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect, type FormEvent } from "react";
import { lisaLiige, muudaLiiget } from "@/lib/actions/liikmed";
import type { Liige } from "@/lib/types";

type Props = { liige?: Liige };

/** Add form without `liige`, edit form with `liige`. Shows the validation errors from the server. */
export default function LiikmeVorm({ liige }: Props) {
  const router = useRouter();
  const [tulemus, saada, ootel] = useActionState(liige ? muudaLiiget : lisaLiige, null);

  useEffect(() => {
    if (tulemus && "ok" in tulemus) router.push(liige ? `/liikmed/${liige.id}` : "/liikmed");
  }, [tulemus, liige, router]);

  // Call the action from onSubmit instead of <form action>, so React does not clear the fields
  // when the server returns an error.
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(() => saada(fd));
  }

  const valja = "rounded-md border border-zinc-300 bg-background px-3 py-2 dark:border-zinc-700";

  return (
    <form onSubmit={onSubmit} className="flex max-w-md flex-col gap-4">
      {liige && <input type="hidden" name="id" value={liige.id} />}
      <label className="flex flex-col gap-1 text-sm">
        Eesnimi
        <input name="eesnimi" required maxLength={50} defaultValue={liige?.eesnimi} className={valja} />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Perekonnanimi
        <input name="perekonnanimi" required maxLength={50} defaultValue={liige?.perekonnanimi} className={valja} />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        E-post
        <input type="email" name="email" required maxLength={100} defaultValue={liige?.email} className={valja} />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Liitumise kuupäev
        <input type="date" name="liitumise_kp" required defaultValue={liige?.liitumise_kp} className={valja} />
      </label>

      {tulemus && "error" in tulemus && (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {tulemus.error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={ootel}
          className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 disabled:opacity-50"
        >
          {ootel ? "Salvestan…" : "Salvesta"}
        </button>
        <button type="button" onClick={() => router.back()} className="px-4 py-2 text-sm hover:underline">
          Tühista
        </button>
      </div>
    </form>
  );
}
