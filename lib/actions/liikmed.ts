"use server";

import { revalidatePath } from "next/cache";
import { andmed, email, kuupaev, taisarv, tekst, toiming } from "../abi";
import { supabase } from "../supabase";
import type { Tulemus } from "../types";

function liikmeVorm(fd: FormData) {
  return {
    eesnimi: tekst(fd, "eesnimi", 50),
    perekonnanimi: tekst(fd, "perekonnanimi", 50),
    email: email(fd, "email"),
    liitumise_kp: kuupaev(fd, "liitumise_kp"),
  };
}

export async function lisaLiige(_: Tulemus, fd: FormData): Promise<Tulemus> {
  return toiming(async () => {
    const db = await supabase();
    andmed(await db.from("liige").insert(liikmeVorm(fd)));
    revalidatePath("/liikmed");
  });
}

export async function muudaLiiget(_: Tulemus, fd: FormData): Promise<Tulemus> {
  return toiming(async () => {
    const id = taisarv(fd, "id");
    const db = await supabase();
    andmed(await db.from("liige").update(liikmeVorm(fd)).eq("id", id));
    revalidatePath("/liikmed");
    revalidatePath(`/liikmed/${id}`);
  });
}
