/**
 * Converts a string to title case.
 *
 * For example, `HELLO_WORLD` becomes `Hello World`.
 */
export function toTitleCase(type: string) {
  return type
    .split('_')
    .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}
