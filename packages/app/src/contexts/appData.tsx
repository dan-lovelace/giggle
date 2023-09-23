import { createContext, useContext, useState } from "react";

import { TAppDataContext, TSearchInput } from "@giggle/types";

import { initialSearchInput } from "../components/search";

const AppDataContext = createContext<TAppDataContext>({
  searchInput: {
    engine: null,
    page: null,
    query: null,
  },
  resetSearchInput: () => void 0,
  setSearchInput: () => void 0,
});

export function useAppData(): TAppDataContext {
  return useContext(AppDataContext);
}

export function AppDataProvider({ children }): JSX.Element {
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
    <AppDataContext.Provider
      value={{ searchInput, resetSearchInput, setSearchInput }}
    >
      {children}
    </AppDataContext.Provider>
  );
}
