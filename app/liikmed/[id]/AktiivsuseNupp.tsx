"use client";

import { muudaAktiivsust } from "@/lib/actions/liikmed";
import { KinnitusNupp } from "../../vorm";

/** Marks an active member inactive, or an inactive member active again. Asks for confirmation first. */
export default function AktiivsuseNupp({ id, nimi, aktiivne }: { id: number; nimi: string; aktiivne: boolean }) {
  return aktiivne ? (
    <KinnitusNupp
      toiming={muudaAktiivsust}
      valjad={{ id, aktiivne: "false" }}
      kinnitus={`Kas märkida ${nimi} mitteaktiivseks?`}
      tekst="Märgi mitteaktiivseks"
      ootelTekst="Salvestan…"
    />
  ) : (
    <KinnitusNupp
      toiming={muudaAktiivsust}
      valjad={{ id, aktiivne: "true" }}
      kinnitus={`Kas märkida ${nimi} uuesti aktiivseks?`}
      tekst="Märgi aktiivseks"
      ootelTekst="Salvestan…"
      stiil="tavaline"
    />
  );
}
