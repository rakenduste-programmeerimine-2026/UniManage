"use client";

import { tuhistaUritus } from "@/lib/actions/uritused";
import { KinnitusNupp } from "../../vorm";

/** Cancels the event. Asks for confirmation first. */
export default function TuhistaUritus({ id, nimi }: { id: number; nimi: string }) {
  return (
    <KinnitusNupp
      toiming={tuhistaUritus}
      valjad={{ id }}
      kinnitus={`Kas tühistada üritus "${nimi}"? Seda ei saa tagasi võtta.`}
      tekst="Tühista üritus"
      ootelTekst="Tühistan…"
    />
  );
}
