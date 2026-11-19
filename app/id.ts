/** Id from the URL (route param or search param), or `null` if it is not a positive whole number. */
export function urliId(param: string | string[] | undefined): number | null {
  return typeof param === "string" && /^[1-9]\d*$/.test(param) ? Number(param) : null;
}
