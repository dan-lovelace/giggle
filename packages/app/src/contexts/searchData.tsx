import { createContext, useContext, useState } from "react";

import { TSearchDataContext, TSearchInput } from "@giggle/types";

import { initialSearchInput } from "../components/Search/Search";

const SearchDataContext = createContext<TSearchDataContext>({
  searchInput: {
    engine: undefined,
    page: undefined,
    query: undefined,
  },
  resetSearchInput: () => undefined,
  setSearchInput: () => undefined,
});

export function useSearchData(): TSearchDataContext {
  return useContext(SearchDataContext);
}

export function SearchDataProvider({ children }): JSX.Element {
  const [searchInput, setSearchInput] =
    useState<TSearchInput>(initialSearchInput);

  const resetSearchInput = () => {
    setSearchInput({
      ...searchInput,
      page: initialSearchInput.page,
      query: initialSearchInput.query,
    });
  };

  return (
    <SearchDataContext.Provider
      value={{ searchInput, resetSearchInput, setSearchInput }}
    >
      {children}
    </SearchDataContext.Provider>
  );
}
