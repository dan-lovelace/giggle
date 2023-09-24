import { Box, Pagination, Typography, useTheme } from "@mui/material";

import { SearchResult } from "../components/SearchResult";
import { PageLayout } from "../containers/PageLayout";
import { ResultsProvider, useResults } from "../contexts/resultsData";
import { useSearchData } from "../contexts/searchData";

function ResultsList() {
  const { searchInput } = useSearchData();
  const {
    results: { items, metadata, pages, searchInformation },
    handlePageChange,
  } = useResults();
  const { breakpoints } = useTheme();

  return (
    <Box sx={{ maxWidth: breakpoints.values.md }}>
      <Box>
        <Typography
          data-testid="results-count"
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2 }}
        >
          {searchInformation?.formattedTotalResults} results for "
          {metadata?.searchTerms}"
        </Typography>
      </Box>
      <Box>
        {items.map((item, idx) => (
          <SearchResult key={idx} {...item} />
        ))}
      </Box>
      {pages.length > 0 && (
        <Box>
          <Pagination
            data-testid="pagination-controls"
            count={pages.length}
            page={searchInput.page}
            onChange={handlePageChange}
          />
        </Box>
      )}
    </Box>
  );
}

export default function Results() {
  return (
    <ResultsProvider>
      <PageLayout>
        <ResultsList />
      </PageLayout>
    </ResultsProvider>
  );
}
