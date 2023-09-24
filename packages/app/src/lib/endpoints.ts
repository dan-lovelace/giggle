import { TApiType } from "@giggle/types";

const GOOGLE_SEARCH: Record<TApiType, string> = {
  DEFAULT: "https://customsearch.googleapis.com/customsearch/v1",
  SITE_RESTRICTED:
    "https://customsearch.googleapis.com/customsearch/v1/siterestrict",
};

export const ENDPOINTS = Object.freeze({
  ENGINES: "/api/engines",
  GOOGLE_SEARCH,
  SEARCH: "/api/search",
});
