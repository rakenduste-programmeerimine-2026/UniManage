"use server";

import { revalidatePath } from "next/cache";
import { andmed, kuupaev, taisarv, tekst, toiming, valikulineTaisarv, valikulineTekst } from "../abi";
import { supabase } from "../supabase";
import type { Tulemus } from "../types";

function urituseVorm(fd: FormData) {
  return {
    nimi: tekst(fd, "nimi", 100),
    kuupaev: kuupaev(fd, "kuupaev"),
    koht: valikulineTekst(fd, "koht", 100),
    liik_id: taisarv(fd, "liik_id"),
  };
}

export async function lisaUritus(_: Tulemus, fd: FormData): Promise<Tulemus> {
  return toiming(async () => {
    const db = await supabase();
    andmed(await db.from("uritus").insert(urituseVorm(fd)));
    revalidatePath("/uritused");
  });
}

export async function muudaUritust(_: Tulemus, fd: FormData): Promise<Tulemus> {
  return toiming(async () => {
    const id = taisarv(fd, "id");
    const db = await supabase();
    andmed(await db.from("uritus").update(urituseVorm(fd)).eq("id", id));
    revalidatePath("/uritused");
    revalidatePath(`/uritused/${id}`);
  });
}

/**
 * Adds a participant with a role. When `saadud_punktid` is empty, the points
 * come from `osalusroll.vaikepunktid`.
 */
export async function lisaOsaleja(_: Tulemus, fd: FormData): Promise<Tulemus> {
  return toiming(async () => {
    const uritus_id = taisarv(fd, "uritus_id");
    const osalusroll_id = taisarv(fd, "osalusroll_id");
    const db = await supabase();
    // null saadud_punktid is filled from osalusroll.vaikepunktid by the osalus_vaikepunktid trigger
    const saadud_punktid = valikulineTaisarv(fd, "saadud_punktid");
    andmed(
      await db
        .from("osalus")
        .insert({ uritus_id, liige_id: taisarv(fd, "liige_id"), osalusroll_id, saadud_punktid }),
    );
    revalidatePath(`/uritused/${uritus_id}`);
    revalidatePath("/aktiivsus");
  });
}

export async function eemaldaOsaleja(_: Tulemus, fd: FormData): Promise<Tulemus> {
  return toiming(async () => {
    const uritus_id = taisarv(fd, "uritus_id");
    const db = await supabase();
    andmed(await db.from("osalus").delete().eq("id", taisarv(fd, "id")));
    revalidatePath(`/uritused/${uritus_id}`);
    revalidatePath("/aktiivsus");
  });
}

/** Manual correction of the points of one participation. */
export async function muudaPunkte(_: Tulemus, fd: FormData): Promise<Tulemus> {
  return toiming(async () => {
    const uritus_id = taisarv(fd, "uritus_id");
    const saadud_punktid = taisarv(fd, "saadud_punktid", 0);
    const db = await supabase();
    andmed(await db.from("osalus").update({ saadud_punktid }).eq("id", taisarv(fd, "id")));
    revalidatePath(`/uritused/${uritus_id}`);
    revalidatePath("/aktiivsus");
  });
}
