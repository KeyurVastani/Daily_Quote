import { API_NINJAS_KEY } from '@env';

type ApiNinjasQuote = {
  quote: string;
  author?: string;
  work?: string;
  categories?: string[];
};

type ApiNinjasResponse = ApiNinjasQuote | ApiNinjasQuote[];

const QUOTE_OF_THE_DAY_URL = 'https://api.api-ninjas.com/v2/quoteoftheday';

export async function fetchQuoteOfTheDayFromApi(): Promise<ApiNinjasQuote> {
  const response = await fetch(QUOTE_OF_THE_DAY_URL, {
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
  if (!quote?.quote) {
    throw new Error('Quotes API returned an unexpected response');
  }
  return quote;
}

