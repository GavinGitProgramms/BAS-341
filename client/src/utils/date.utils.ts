/**
 * Converts a Date object to a formatted string representation.
 *
 * The date and time will be in the local timezone of the browser.
 * The resulting string is in the format "YYYY-MM-DDTHH:mm".
 *
 * @param date - The Date object to convert.
 * @returns The formatted string representation of the date.
 */
export function getLocalDateStr(date: Date): string {
  const timezoneOffset = date.getTimezoneOffset() * 60000 // offset in milliseconds
  const localEndTime = new Date(date.getTime() - timezoneOffset)
  const dateStr = localEndTime.toISOString().slice(0, 16)
  return dateStr
}
