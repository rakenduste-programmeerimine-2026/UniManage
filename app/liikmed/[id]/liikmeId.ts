/** Member id from the URL, or `null` if it is not a positive whole number. */
export function liikmeId(param: string): number | null {
  return /^[1-9]\d*$/.test(param) ? Number(param) : null;
}
