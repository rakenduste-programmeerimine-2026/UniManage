"use client";

import { eemaldaOsaleja } from "@/lib/actions/uritused";
import { useVorm, VormiViga } from "../../vorm";

/** Removes a participant from the event. Asks for confirmation first. */
export default function EemaldaOsaleja({ id, uritusId, nimi }: { id: number; uritusId: number; nimi: string }) {
  const { tulemus, onSubmit, ootel } = useVorm(eemaldaOsaleja, `Kas eemaldada ${nimi} osalejate hulgast?`);

  return (
    <form onSubmit={onSubmit} className="flex flex-col items-end gap-1">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="uritus_id" value={uritusId} />
      <button type="submit" disabled={ootel} className="text-sm text-red-700 hover:underline disabled:opacity-50 dark:text-red-300">
        {ootel ? "Eemaldan…" : "Eemalda"}
      </button>
      <VormiViga tulemus={tulemus} />
    </form>
  );
}
