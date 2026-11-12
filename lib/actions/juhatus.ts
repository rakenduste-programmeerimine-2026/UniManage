"use server";

import { revalidatePath } from "next/cache";
import { Viga, andmed, kuupaev, taisarv, toiming } from "../abi";
import { supabase } from "../supabase";
import type { Tulemus } from "../types";

/** Gives a board role to a member. */
export async function maaraRoll(_: Tulemus, fd: FormData): Promise<Tulemus> {
  return toiming(async () => {
    const rida = {
      liige_id: taisarv(fd, "liige_id"),
      roll_id: taisarv(fd, "roll_id"),
      algus_kp: kuupaev(fd, "algus_kp"),
    };
    const db = await supabase();
    const lahtised = andmed<unknown[]>(
      await db
        .from("juhatuseliikmesus")
        .select("id")
        .eq("liige_id", rida.liige_id)
        .eq("roll_id", rida.roll_id)
        .is("lopp_kp", null),
    );
    if (lahtised.length) throw new Viga("Liikmel on see roll juba olemas.");
    andmed(await db.from("juhatuseliikmesus").insert(rida));
    revalidatePath("/juhatus");
  });
}

/**
 * Ends a board role (sets `lopp_kp`). The row stays, so the history is kept
 * and the person stays a usual member.
 */
export async function lopetaRoll(_: Tulemus, fd: FormData): Promise<Tulemus> {
  return toiming(async () => {
    const id = taisarv(fd, "id");
    const db = await supabase();
    const muudetud = andmed<unknown[]>(
      await db
        .from("juhatuseliikmesus")
        .update({ lopp_kp: kuupaev(fd, "lopp_kp") })
        .eq("id", id)
        .is("lopp_kp", null)
        .select("id"),
    );
    if (!muudetud.length) throw new Viga("Roll on juba lõpetatud või seda ei leitud.");
    revalidatePath("/juhatus");
  });
}
