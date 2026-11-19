"use client";

import { useState } from "react";
import { kustutaKulu } from "@/lib/actions/kulud";
import type { Kulu } from "@/lib/types";
import { kuvaKuupaev, kuvaRaha } from "@/lib/vorming";
import { Lahter, Rida } from "../../Tabel";
import { KinnitusNupp } from "../../vorm";
import KuluVorm from "./KuluVorm";

type Props = { uritusId: number; kulu: Pick<Kulu, "id" | "summa" | "kirjeldus" | "kuupaev"> };

/** One cost in the table, with edit and delete buttons. Edit opens the form in the row. */
export default function KuluRida({ uritusId, kulu }: Props) {
  const [muudan, setMuudan] = useState(false);

  if (muudan) {
    return (
      <Rida>
        <td colSpan={4} className="px-3 py-3">
          <KuluVorm uritusId={uritusId} kulu={kulu} onValmis={() => setMuudan(false)} onTuhista={() => setMuudan(false)} />
        </td>
      </Rida>
    );
  }

  return (
    <Rida>
      <Lahter>{kuvaKuupaev(kulu.kuupaev)}</Lahter>
      <Lahter>{kulu.kirjeldus ?? "—"}</Lahter>
      <Lahter>{kuvaRaha(kulu.summa)}</Lahter>
      <Lahter>
        <div className="flex items-start justify-end gap-2">
          <button
            type="button"
            onClick={() => setMuudan(true)}
            className="rounded-md border border-zinc-300 px-3 py-1 text-sm hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            Muuda
          </button>
          <KinnitusNupp
            toiming={kustutaKulu}
            valjad={{ id: kulu.id, uritus_id: uritusId }}
            kinnitus={`Kas kustutada kulu ${kuvaRaha(kulu.summa)}?`}
            tekst="Kustuta"
            ootelTekst="Kustutan…"
          />
        </div>
      </Lahter>
    </Rida>
  );
}
