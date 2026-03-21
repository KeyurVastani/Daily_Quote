/**
 * Categories supported by API Ninjas Quotes v2
 * @see https://api-ninjas.com/api/quotes
 */
export const QUOTE_CATEGORIES = [
  'wisdom',
  'philosophy',
  'life',
  'truth',
  'inspirational',
  'relationships',
  'love',
  'faith',
  'humor',
  'success',
  'courage',
  'happiness',
  'art',
  'writing',
  'fear',
  'nature',
  'time',
  'freedom',
  'death',
  'leadership',
] as const;

export type QuoteCategoryId = (typeof QUOTE_CATEGORIES)[number];

export function formatCategoryLabel(id: string): string {
  return id.charAt(0).toUpperCase() + id.slice(1);
}
