export type TAppConfig = {
  googleApiKey: string;
  resultsCacheLengthSeconds: string;
};

export type TAppDataContext = {
  engines: TSearchEngine[];
  searchInput: TSearchInput;
  resetSearchInput(): void;
  setSearchInput(input: TSearchInput): void;
};

export type TGoogleItem = {
  index: number;
  link: string;
  snippet: string;
  title: string;
};

export type TGooglePage = {
  link: string;
  number: number;
};

export type TGoogleQuery = {
  count: number;
  searchTerms: string;
  title: string;
  totalResults: string;
};

export type TResultsContext = {
  results: TSearchResults;
  handlePageChange(event: React.ChangeEvent<unknown>, page: number): void;
  refetch(): void;
};

export type TSearchEngine = {
  identifier: string;
  name: string;
};

export type TSearchInput = {
  engine: string;
  page: number;
  query: string;
};

export type TSearchResults = {
  items: TGoogleItem[];
  metadata: TGoogleQuery;
  pages: TGooglePage[];
};
