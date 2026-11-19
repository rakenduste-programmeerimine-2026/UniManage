"use client";

import { useEffect, useRef } from "react";
import { maaraRoll } from "@/lib/actions/juhatus";
import type { Liige, Nimetus } from "@/lib/types";
import { useVorm, VormiViga } from "../vorm";

type Props = {
  liikmed: Pick<Liige, "id" | "eesnimi" | "perekonnanimi">[];
  rollid: Nimetus[];
  /** Default start date, today as YYYY-MM-DD. */
  tana: string;
};

/** Gives a board role to a member. */
export default function RolliVorm({ liikmed, rollid, tana }: Props) {
  const vorm = useRef<HTMLFormElement>(null);
  const { tulemus, onSubmit, ootel } = useVorm(maaraRoll);
  const korras = tulemus && "ok" in tulemus;

  useEffect(() => {
    if (korras) vorm.current?.reset();
  }, [korras, tulemus]);

  const valja = "rounded-md border border-zinc-300 bg-background px-3 py-2 dark:border-zinc-700";

  return (
    <form ref={vorm} onSubmit={onSubmit} className="flex flex-col gap-3">
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
          <select name="roll_id" required defaultValue="" className={valja}>
            <option value="" disabled>
              Vali roll
            </option>
            {rollid.map((r) => (
              <option key={r.id} value={r.id}>
                {r.nimetus}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Algus
          <input type="date" name="algus_kp" required defaultValue={tana} className={valja} />
        </label>
        <button
          type="submit"
          disabled={ootel}
          className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 disabled:opacity-50"
        >
          {ootel ? "Salvestan…" : "Määra roll"}
        </button>
      </div>
      <VormiViga tulemus={tulemus} />
      {korras && (
        <p role="status" className="text-sm text-green-700 dark:text-green-400">
          Roll on määratud.
        </p>
      )}
    </form>
  );
}
