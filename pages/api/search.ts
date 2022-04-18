import { NextApiResponse } from "next";

import { ENDPOINTS } from "../../lib/endpoints";
import { config } from "../../lib/config";
import mock from "../../mocks/results-recipes.json";
import {
  TGoogleItem,
  TGooglePage,
  TGoogleQuery,
  TSearchInput,
  TSearchResults,
} from "../../types/common";

// these are the maximum values allowed by google
const PAGE_SIZE = 10;
const RESULTS_MAX = 100;

export default async function handler(
  req: { query: TSearchInput },
  res: NextApiResponse
): Promise<void> {
  const { engine, page, query } = req.query;
  const searchParams: Record<string, string> = {
    key: config.googleApiKey,
    cx: engine,
    q: query,
    start: String(page * PAGE_SIZE - PAGE_SIZE + 1),
  };

  // REAL USAGE ---------------------------------------------------------------
  const searchQuery = await fetch(
    `${ENDPOINTS.GOOGLE_SEARCH}?${new URLSearchParams(searchParams)}`
  );
  const json = await searchQuery.json();
  // --------------------------------------------------------------------------

  // MOCK USAGE ---------------------------------------------------------------
  // const json = JSON.parse(JSON.stringify(mock));
  // --------------------------------------------------------------------------

  const { items: jsonItems, queries, searchInformation } = json;
  const items: Array<TGoogleItem> = jsonItems;
  const metadata: TGoogleQuery = queries.request[0];
  let itemsRemaining =
    searchInformation.totalResults >= RESULTS_MAX
      ? RESULTS_MAX
      : searchInformation.totalResults;

  // construct a list of pages
  let pages: TGooglePage[] = [];
  while (itemsRemaining > 0) {
    const number = pages.length + 1;
    pages.push({
      link: `/results?${new URLSearchParams({
        engine,
        query,
        page: String(number),
      })}`,
      number,
    });

    itemsRemaining -= PAGE_SIZE;
  }

  const result: TSearchResults = {
    items,
    metadata,
    pages,
  };

  const cacheMaxAge = config.resultsCacheLengthSeconds || "3600";
  console.log("cacheMaxAge", cacheMaxAge);
  res
    .status(200)
    .setHeader("Cache-Control", `max-age=${cacheMaxAge}`)
    .json(result);
}
