"use client";

import { useEffect, useRef } from "react";
import { lisaOsaleja } from "@/lib/actions/uritused";
import type { Liige, Osalusroll } from "@/lib/types";
import { useVorm, VormiViga } from "../../vorm";

type Props = {
  uritusId: number;
  liikmed: Pick<Liige, "id" | "eesnimi" | "perekonnanimi">[];
  rollid: Osalusroll[];
};

/** Adds a participant with a role. Empty points field uses the default points of the role. */
export default function OsalejaVorm({ uritusId, liikmed, rollid }: Props) {
  const vorm = useRef<HTMLFormElement>(null);
  const { tulemus, onSubmit, ootel } = useVorm(lisaOsaleja);
  const korras = tulemus && "ok" in tulemus;

  useEffect(() => {
    if (korras) vorm.current?.reset();
  }, [korras, tulemus]);

  const valja = "rounded-md border border-zinc-300 bg-background px-3 py-2 dark:border-zinc-700";

  return (
    <form ref={vorm} onSubmit={onSubmit} className="flex flex-col gap-3">
      <input type="hidden" name="uritus_id" value={uritusId} />
      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1 text-sm">
          Liige
          <select name="liige_id" required defaultValue="" className={valja}>
            <option value="" disabled>
              Vali liige
            </option>
            {liikmed.map((l) => (
              <option key={l.id} value={l.id}>
                {l.perekonnanimi}, {l.eesnimi}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Roll
          <select name="osalusroll_id" required defaultValue="" className={valja}>
            <option value="" disabled>
              Vali roll
            </option>
            {rollid.map((r) => (
              <option key={r.id} value={r.id}>
                {r.nimetus} ({r.vaikepunktid} p)
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Punktid (valikuline)
          <input type="number" name="saadud_punktid" min={0} step={1} placeholder="rolli järgi" className={`${valja} w-32`} />
        </label>
        <button
          type="submit"
          disabled={ootel}
          className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 disabled:opacity-50"
        >
          {ootel ? "Lisan…" : "Lisa osaleja"}
        </button>
      </div>
      <VormiViga tulemus={tulemus} />
    </form>
  );
}
