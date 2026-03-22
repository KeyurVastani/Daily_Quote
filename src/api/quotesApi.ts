import { API_NINJAS_BASE_URL, API_NINJAS_KEY } from '@env';

type ApiNinjasQuote = {
  quote: string;
  author?: string;
  work?: string;
  categories?: string[];
};

type ApiNinjasResponse = ApiNinjasQuote | ApiNinjasQuote[];

/** Default matches API Ninjas REST host (see https://api-ninjas.com). */
const DEFAULT_API_BASE = 'https://api.api-ninjas.com';

function getApiBaseUrl(): string {
  const trimmed = API_NINJAS_BASE_URL?.trim?.() ?? '';
  const base = trimmed || DEFAULT_API_BASE;
  return base.replace(/\/+$/, '');
}

function quoteOfTheDayUrl(): string {
  return `${getApiBaseUrl()}/v2/quoteoftheday`;
}

/** Random quotes filtered by categories (varies per request). Same filters as /v2/quotes. */
function randomQuotesUrl(): string {
  return `${getApiBaseUrl()}/v2/randomquotes`;
}

function mapApiQuoteToInternal(q: ApiNinjasQuote | undefined): ApiNinjasQuote {
  if (!q?.quote) {
    throw new Error('Quotes API returned an unexpected response');
  }
  return q;
}

export async function fetchQuoteOfTheDayFromApi(): Promise<ApiNinjasQuote> {
  const response = await fetch(quoteOfTheDayUrl(), {
    method: 'GET',
    headers: {
      'X-Api-Key': API_NINJAS_KEY,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Quotes API error: ${response.status}`);
  }

  const json = (await response.json()) as ApiNinjasResponse;
  const quote = Array.isArray(json) ? json[0] : json;
  return mapApiQuoteToInternal(quote);
}

/** Random quote with no category filter (any topic). */
export async function fetchRandomQuote(): Promise<ApiNinjasQuote> {
  const response = await fetch(randomQuotesUrl(), {
    method: 'GET',
    headers: {
      'X-Api-Key': API_NINJAS_KEY,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Quotes API error: ${response.status}`);
  }

  const json = (await response.json()) as ApiNinjasResponse;
  const quote = Array.isArray(json) ? json[0] : json;
  return mapApiQuoteToInternal(quote);
}

/**
 * Fetch one random quote matching ALL selected categories (comma-separated in the API).
 * Uses /v2/randomquotes so repeated taps return different quotes.
 */
export async function fetchRandomQuoteByCategories(categories: string[]): Promise<ApiNinjasQuote> {
  const trimmed = categories.map((c) => c.trim()).filter(Boolean);
  if (trimmed.length === 0) {
    throw new Error('Select at least one category');
  }

  const params = new URLSearchParams();
  params.set('categories', trimmed.join(','));

  const response = await fetch(`${randomQuotesUrl()}?${params.toString()}`, {
    method: 'GET',
    headers: {
      'X-Api-Key': API_NINJAS_KEY,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Quotes API error: ${response.status}`);
  }

  const json = (await response.json()) as ApiNinjasResponse;
  const quote = Array.isArray(json) ? json[0] : json;
  return mapApiQuoteToInternal(quote);
}

