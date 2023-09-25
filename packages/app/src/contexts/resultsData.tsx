import { createContext, useContext, useEffect } from "react";

import { TSearchResults } from "@giggle/types";
import { Alert } from "@mui/material";
import { useRouter } from "next/router";
import { useQuery } from "react-query";

import { useSearchData } from "./searchData";
import { Spinner } from "../components/Spinner";
import { request } from "../hooks";
import { ENDPOINTS } from "../lib/endpoints";
import { QUERIES } from "../lib/queries";

type TResultsContext = {
  results: TSearchResults;
  handlePageChange(event: React.ChangeEvent<unknown>, page: number): void;
  refetch(): void;
};

const ResultsContext = createContext<TResultsContext>({
  results: {
    items: [],
    pages: [],
  },
  handlePageChange: () => undefined,
  refetch: () => undefined,
});

export function useResultsData() {
  return useContext(ResultsContext);
}

export function ResultsProvider({ children }) {
  const { searchInput, setSearchInput } = useSearchData();
  const router = useRouter();
  const { isLoading, data, error, refetch } = useQuery<TSearchResults, Error>(
    QUERIES.SEARCH,
    () =>
      request<TSearchResults>(
        `${ENDPOINTS.SEARCH}?${new URLSearchParams(window.location.search)}`,
        {
          headers: {
            Accept: "application/json",
          },
        },
      ),
    {
      refetchOnWindowFocus: false,
    },
  );

  useEffect(() => {
    refetch();
  }, [searchInput.page]);

  if (isLoading) return <Spinner />;
  if (error) return <Alert severity="error">{error.message}</Alert>;
  if (!data || !data.items || !data.items.length) {
    return (
      <Alert severity="warning">Your search did not return any results</Alert>
    );
  }

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number,
  ) => {
    const dataPage = data.pages.find((p) => p.number === page);

    if (!dataPage) return;

    router.push(dataPage.link).then(() => {
      setSearchInput({
        ...searchInput,
        page,
      });
    });
  };

  return (
    <ResultsContext.Provider
      value={{ results: data, handlePageChange, refetch }}
    >
      {children}
    </ResultsContext.Provider>
  );
}
