"use client";

import { muudaPunkte } from "@/lib/actions/uritused";
import { useVorm, VormiViga } from "../../vorm";

/** Changes the points of one participant by hand. */
export default function PunktideVorm({ id, uritusId, punktid }: { id: number; uritusId: number; punktid: number }) {
  const { tulemus, onSubmit, ootel } = useVorm(muudaPunkte);

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-1">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="uritus_id" value={uritusId} />
      <div className="flex items-center gap-2">
        <label className="sr-only" htmlFor={`punktid-${id}`}>
          Punktid
        </label>
        <input
          // A new key after saving resets the field to the saved value.
          key={punktid}
          id={`punktid-${id}`}
          type="number"
          name="saadud_punktid"
          required
          min={0}
          step={1}
          defaultValue={punktid}
          className="w-20 rounded-md border border-zinc-300 bg-background px-2 py-1 text-sm dark:border-zinc-700"
        />
        <button
          type="submit"
          disabled={ootel}
          className="rounded-md border border-zinc-300 px-2 py-1 text-xs hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
        >
          {ootel ? "…" : "Salvesta"}
        </button>
      </div>
      <VormiViga tulemus={tulemus} />
    </form>
  );
}
