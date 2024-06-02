/**
 * Calculates the modulo of a number.
 *
 * This function is different from the `%` operator in JavaScript. The `%`
 * operator returns the remainder of a division, which can be negative.
 *
 * @param x - The dividend.
 * @param m - The divisor.
 * @returns The modulo of `x` and `m`.
 */
export function mod(x: number, m: number) {
  return ((x % m) + m) % m;
}
