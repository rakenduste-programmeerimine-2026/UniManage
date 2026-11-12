"use server";

import { revalidatePath } from "next/cache";
import { Viga, andmed, kuupaev, raha, taisarv, toiming, valikulineTekst } from "../abi";
import { supabase } from "../supabase";
import type { Tulemus } from "../types";

/** Reads the cost form and adds the budget of the year of the cost date. */
async function kuluVormEelarvega(fd: FormData) {
  const kulu = {
    summa: raha(fd, "summa"),
    kirjeldus: valikulineTekst(fd, "kirjeldus", 200),
    kuupaev: kuupaev(fd, "kuupaev"),
  };
  return { ...kulu, eelarve_id: await eelarveId(Number(kulu.kuupaev.slice(0, 4))) };
}

async function eelarveId(aasta: number): Promise<number> {
  const db = await supabase();
  const eelarve = andmed<{ id: number } | null>(
    await db.from("eelarve").select("id").eq("aasta", aasta).maybeSingle(),
  );
  if (!eelarve) throw new Viga(`Aastal ${aasta} ei ole eelarvet.`);
  return eelarve.id;
}

function uuenda(uritus_id: number) {
  revalidatePath(`/uritused/${uritus_id}`);
  revalidatePath("/eelarve");
}

export async function lisaKulu(_: Tulemus, fd: FormData): Promise<Tulemus> {
  return toiming(async () => {
    const uritus_id = taisarv(fd, "uritus_id");
    const db = await supabase();
    andmed(await db.from("kulu").insert({ uritus_id, ...(await kuluVormEelarvega(fd)) }));
    uuenda(uritus_id);
  });
}

export async function muudaKulu(_: Tulemus, fd: FormData): Promise<Tulemus> {
  return toiming(async () => {
    const uritus_id = taisarv(fd, "uritus_id");
    const db = await supabase();
    andmed(await db.from("kulu").update(await kuluVormEelarvega(fd)).eq("id", taisarv(fd, "id")));
    uuenda(uritus_id);
  });
}

export async function kustutaKulu(_: Tulemus, fd: FormData): Promise<Tulemus> {
  return toiming(async () => {
    const uritus_id = taisarv(fd, "uritus_id");
    const db = await supabase();
    andmed(await db.from("kulu").delete().eq("id", taisarv(fd, "id")));
    uuenda(uritus_id);
  });
}
