"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { lisaUritus, muudaUritust } from "@/lib/actions/uritused";
import type { Nimetus, Uritus } from "@/lib/types";
import { useVorm, VormiViga } from "../vorm";

type Props = { liigid: Nimetus[]; uritus?: Uritus };

/** Create form without `uritus`, edit form with `uritus`. */
export default function UrituseVorm({ liigid, uritus }: Props) {
  const router = useRouter();
  const { tulemus, onSubmit, ootel } = useVorm(uritus ? muudaUritust : lisaUritus);

  useEffect(() => {
    if (tulemus && "ok" in tulemus) router.push(uritus ? `/uritused/${uritus.id}` : "/uritused");
  }, [tulemus, uritus, router]);

  const valja = "rounded-md border border-zinc-300 bg-background px-3 py-2 dark:border-zinc-700";

  return (
    <form onSubmit={onSubmit} className="flex max-w-md flex-col gap-4">
      {uritus && <input type="hidden" name="id" value={uritus.id} />}
      <label className="flex flex-col gap-1 text-sm">
        Nimi
        <input name="nimi" required maxLength={100} defaultValue={uritus?.nimi} className={valja} />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Kuupäev
        <input type="date" name="kuupaev" required defaultValue={uritus?.kuupaev} className={valja} />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Koht (valikuline)
        <input name="koht" maxLength={100} defaultValue={uritus?.koht ?? ""} className={valja} />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Liik
        <select name="liik_id" required defaultValue={uritus?.liik_id ?? ""} className={valja}>
          <option value="" disabled>
            Vali liik
          </option>
          {liigid.map((l) => (
            <option key={l.id} value={l.id}>
              {l.nimetus}
            </option>
          ))}
        </select>
      </label>

      <VormiViga tulemus={tulemus} />

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
