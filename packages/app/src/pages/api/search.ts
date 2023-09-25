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

  const googleSearchParams: Record<string, string> = {
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

  const googleSearchUrl = `${
    ENDPOINTS.GOOGLE_SEARCH[api_type]
  }?${new URLSearchParams(googleSearchParams)}`;
  let googleResponse: TGoogleResponse;

  if (mockResults) {
    googleResponse = JSON.parse(JSON.stringify(mock));
  } else {
    const searchQuery = await fetch(googleSearchUrl);
    googleResponse = await searchQuery.json();
  }

  const {
    items,
    queries: {
      request: [metadata],
    },
    searchInformation,
  } = googleResponse;

  // construct list of pages
  let itemsRemaining =
    searchInformation.totalResults >= RESULTS_MAX
      ? RESULTS_MAX
      : searchInformation.totalResults;
  const pages: Array<TGooglePage> = [];

  while (itemsRemaining > 0) {
    const number = pages.length + 1;
    const searchInputParams: Record<keyof TSearchInput, string> = {
      engine,
      query,
      page: String(number),
    };

    pages.push({
      link: `/results?${new URLSearchParams(searchInputParams)}`,
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
