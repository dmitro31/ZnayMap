export function normalizeName(value: string): string {
  return value
    .toLowerCase()
    .replace(/[«»"'`’“”„]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}