"use client";

import { eemaldaOsaleja } from "@/lib/actions/uritused";
import { KinnitusNupp } from "../../vorm";

/** Removes a participant from the event. Asks for confirmation first. */
export default function EemaldaOsaleja({ id, uritusId, nimi }: { id: number; uritusId: number; nimi: string }) {
  return (
    <KinnitusNupp
      toiming={eemaldaOsaleja}
      valjad={{ id, uritus_id: uritusId }}
      kinnitus={`Kas eemaldada ${nimi} osalejate hulgast?`}
      tekst="Eemalda"
      ootelTekst="Eemaldan…"
    />
  );
}
