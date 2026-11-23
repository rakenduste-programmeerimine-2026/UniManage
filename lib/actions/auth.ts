"use server";

import { redirect } from "next/navigation";
import { Viga, email, toiming } from "../abi";
import { supabase } from "../supabase";
import type { Tulemus } from "../types";

export async function logiSisse(_: Tulemus, fd: FormData): Promise<Tulemus> {
  const tulemus = await toiming(async () => {
    const db = await supabase();
    const { error } = await db.auth.signInWithPassword({
      email: email(fd, "email"),
      password: String(fd.get("parool") ?? ""),
    });
    if (error) throw new Viga("Vale e-post või parool.");
  });
  // redirect throws, so it must run outside toiming's try/catch
  if (tulemus && "ok" in tulemus) redirect("/");
  return tulemus;
}

export async function logiValja() {
  const db = await supabase();
  await db.auth.signOut();
  redirect("/login");
}
