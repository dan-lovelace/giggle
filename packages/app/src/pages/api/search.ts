import { connection } from "@giggle/db";
import {
  TGooglePage,
  TGoogleResponse,
  TSearchInput,
  TSearchResults,
} from "@giggle/types";
import { NextApiResponse } from "next";

import { config } from "../../lib/config";
import { ENDPOINTS } from "../../lib/endpoints";
import mock from "../../mocks/results-recipes.json";

// these are the maximum values allowed by google
const PAGE_SIZE = 10;
const RESULTS_MAX = 100;

const { googleApiKey, mockResults } = config;

export default async function handler(
  request: { query: TSearchInput },
  response: NextApiResponse,
) {
  const {
    query: { engine = "", page = 1, query = "" },
  } = request;

  if (!googleApiKey) {
    throw new Error("Missing Google API key");
  }

  const searchParams: Record<string, string> = {
    key: googleApiKey,
    cx: engine,
    q: query,
    start: String(page * PAGE_SIZE - PAGE_SIZE + 1),
  };

  const db = connection();
  const { api_type } = await db("engine")
    .select("api_type")
    .where({ identifier: engine })
    .first();
  const endpoint = ENDPOINTS.GOOGLE_SEARCH[api_type];

  let json: TGoogleResponse;
  if (mockResults) {
    json = JSON.parse(JSON.stringify(mock));
  } else {
    const searchQuery = await fetch(
      `${endpoint}?${new URLSearchParams(searchParams)}`,
    );
    json = await searchQuery.json();
  }

  const {
    items,
    queries: {
      request: [metadata],
    },
    searchInformation,
  } = json;

  // construct list of pages
  let itemsRemaining =
    searchInformation.totalResults >= RESULTS_MAX
      ? RESULTS_MAX
      : searchInformation.totalResults;
  const pages: Array<TGooglePage> = [];

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
    searchInformation,
  };
  const cacheMaxAge = config.resultsCacheLengthSeconds ?? "3600";

  response
    .status(200)
    .setHeader("Cache-Control", `max-age=${cacheMaxAge}`)
    .json(result);
}
