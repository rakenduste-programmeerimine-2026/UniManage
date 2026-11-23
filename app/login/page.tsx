"use client";

import { logiSisse } from "@/lib/actions/auth";
import { useVorm, VormiViga } from "../vorm";

export default function LoginPage() {
  const { tulemus, onSubmit, ootel } = useVorm(logiSisse);
  const valja = "rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900";

  return (
    <main className="mx-auto w-full max-w-sm px-4 py-16">
      <h1 className="mb-6 text-2xl font-semibold">Logi sisse</h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          E-post
          <input name="email" type="email" autoComplete="email" required className={valja} />
        </label>
        <label className="flex flex-col gap-1">
          Parool
          <input name="parool" type="password" autoComplete="current-password" required className={valja} />
        </label>
        <VormiViga tulemus={tulemus} />
        <button
          type="submit"
          disabled={ootel}
          className="rounded-md bg-zinc-900 px-3 py-2 font-medium text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
        >
          {ootel ? "Login sisse…" : "Logi sisse"}
        </button>
      </form>
    </main>
  );
}
