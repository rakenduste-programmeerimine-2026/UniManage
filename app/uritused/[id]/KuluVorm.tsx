"use client";

import { useEffect, useRef } from "react";
import { lisaKulu, muudaKulu } from "@/lib/actions/kulud";
import type { Kulu } from "@/lib/types";
import { useVorm, VormiViga } from "../../vorm";

type Props = {
  uritusId: number;
  /** Edit form when given, add form otherwise. */
  kulu?: Pick<Kulu, "id" | "summa" | "kirjeldus" | "kuupaev">;
  /** Called after a successful save. */
  onValmis?: () => void;
  onTuhista?: () => void;
};

/** Adds a cost to the event or edits one. The cost goes to the budget of the year of its date. */
export default function KuluVorm({ uritusId, kulu, onValmis, onTuhista }: Props) {
  const vorm = useRef<HTMLFormElement>(null);
  const { tulemus, onSubmit, ootel } = useVorm(kulu ? muudaKulu : lisaKulu);
  const korras = tulemus && "ok" in tulemus;

  useEffect(() => {
    if (!korras) return;
    vorm.current?.reset();
    onValmis?.();
  }, [korras, tulemus, onValmis]);

  const valja = "rounded-md border border-zinc-300 bg-background px-3 py-2 text-sm dark:border-zinc-700";

  return (
    <form ref={vorm} onSubmit={onSubmit} className="flex flex-col gap-3">
      <input type="hidden" name="uritus_id" value={uritusId} />
      {kulu && <input type="hidden" name="id" value={kulu.id} />}
      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1 text-sm">
          Summa (€)
          <input
            name="summa"
            required
            inputMode="decimal"
            pattern="\d{1,8}([.,]\d{1,2})?"
            title="Näiteks 12,50"
            placeholder="0,00"
            defaultValue={kulu ? String(kulu.summa).replace(".", ",") : undefined}
            className={`${valja} w-32`}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Kuupäev
          <input type="date" name="kuupaev" required defaultValue={kulu?.kuupaev} className={valja} />
        </label>
        <label className="flex min-w-48 flex-1 flex-col gap-1 text-sm">
          Kirjeldus (valikuline)
          <input name="kirjeldus" maxLength={200} defaultValue={kulu?.kirjeldus ?? ""} className={valja} />
        </label>
        <button
          type="submit"
          disabled={ootel}
          className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 disabled:opacity-50"
        >
          {ootel ? "Salvestan…" : kulu ? "Salvesta" : "Lisa kulu"}
        </button>
        {onTuhista && (
          <button type="button" onClick={onTuhista} className="px-2 py-2 text-sm hover:underline">
            Tühista
          </button>
        )}
      </div>
      <VormiViga tulemus={tulemus} />
    </form>
  );
}
