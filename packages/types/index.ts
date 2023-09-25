export const apiTypeLabelMap: Record<TApiType, string> = {
  DEFAULT: "Default",
  SITE_RESTRICTED: "Site Restricted",
};

export type TApiType = "DEFAULT" | "SITE_RESTRICTED";

export type TAppConfig = {
  googleApiKey?: string;
  mockResults?: boolean;
  resultsCacheLengthSeconds?: string;
};

export type TGooglePage = {
  link: string;
  number: number;
};

export type TGoogleQuery = {
  count: number;
  cx: string;
  inputEncoding: string;
  outputEncoding: string;
  safe: "off" | "on";
  searchTerms: string;
  startIndex: number;
  title: string;
  totalResults: string;
};

export type TGoogleResponse = {
  context: {
    /**
     * Search engine name.
     * @example ```Custom Search Engine Test```
     */
    title: string;
  };

  /**
   * List of Google results.
   */
  items: Array<TGoogleResult>;

  queries: {
    nextPage: Array<TGoogleQuery>;
    request: Array<TGoogleQuery>;
  };

  searchInformation: {
    /**
     * Humanized search time.
     * @example ```0.24```
     */
    formattedSearchTime: string;

    /**
     * Humanized number of results.
     * @example ```187,000,000```
     */
    formattedTotalResults: string;

    /**
     * Search time.
     * @example ```0.239218```
     */
    searchTime: number;

    /**
     * Number of results.
     * @example ```187000000```
     */
    totalResults: number;
  };
};

export type TGoogleResult = {
  cse_image: Array<{
    src: string;
  }>;
  displayLink: string;
  index: number;
  link: string;
  metatags: Array<Record<string, string>>;
  pagemap: {
    cse_thumbnail?: Array<{
      height: string;
      src: string;
      width: string;
    }>;
  };
  snippet: string;
  title: string;
};

export type TSearchDataContext = {
  searchInput: TSearchInput;
  resetSearchInput(): void;
  setSearchInput(input: TSearchInput): void;
};

export type TSearchInput = {
  engine?: string;
  page?: number;
  query?: string;
  shouldRefetch?: boolean;
};

export type TSearchResults = Partial<TGoogleResponse> & {
  items: Array<TGoogleResult>;
  metadata?: TGoogleQuery;
  pages: Array<TGooglePage>;
};

export * from "./db";
