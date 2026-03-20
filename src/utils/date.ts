function pad2(n: number): string {
  return n.toString().padStart(2, '0');
}

// Produces a stable local date key like `2026-03-20`.
export function dateToKey(date: Date): string {
  const year = date.getFullYear();
  const month = pad2(date.getMonth() + 1);
  const day = pad2(date.getDate());
  return `${year}-${month}-${day}`;
}

