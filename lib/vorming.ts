// Formatting helpers for the pages.

const kuupaevaVorming = new Intl.DateTimeFormat("et-EE", { timeZone: "UTC" });

/** "2026-11-05" -> "05.11.2026". Uses UTC so the day does not shift with the server time zone. */
export function kuvaKuupaev(iso: string): string {
  return kuupaevaVorming.format(new Date(`${iso}T00:00:00Z`));
}
