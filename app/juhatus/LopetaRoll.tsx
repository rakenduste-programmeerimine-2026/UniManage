"use client";

import { lopetaRoll } from "@/lib/actions/juhatus";
import { useVorm, VormiViga } from "../vorm";

type Props = { id: number; nimi: string; roll: string; algus: string; tana: string };

/** Ends a board role on the chosen date. Asks for confirmation first. */
export default function LopetaRoll({ id, nimi, roll, algus, tana }: Props) {
  const { tulemus, onSubmit, ootel } = useVorm(lopetaRoll, `Kas lõpetada liikme ${nimi} roll "${roll}"?`);

  return (
    <form onSubmit={onSubmit} className="flex flex-col items-end gap-1">
      <input type="hidden" name="id" value={id} />
      <div className="flex items-center gap-2">
        <label className="sr-only" htmlFor={`lopp-${id}`}>
          Lõpu kuupäev
        </label>
        <input
          id={`lopp-${id}`}
          type="date"
          name="lopp_kp"
          required
          min={algus}
          defaultValue={tana}
          className="rounded-md border border-zinc-300 bg-background px-2 py-1 text-sm dark:border-zinc-700"
        />
        <button
          type="submit"
          disabled={ootel}
          className="rounded-md border border-red-300 px-3 py-1 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950"
        >
          {ootel ? "Lõpetan…" : "Lõpeta"}
        </button>
      </div>
      <VormiViga tulemus={tulemus} />
    </form>
  );
}
