import { Box, Pagination, Typography } from "@mui/material";

import Layout from "../components/layout";
import SearchResult from "../components/searchResult";
import { useAppData } from "../contexts/appData";
import { ResultsProvider, useResults } from "../contexts/resultsData";

function ResultsList() {
  const { searchInput } = useAppData();
  const {
    results: { items, metadata, pages },
    handlePageChange,
  } = useResults();

  return (
    <div>
      <Box>
        <Typography
          data-testid="results-count"
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2 }}
        >
          {metadata.totalResults} results for "{metadata.searchTerms}"
        </Typography>
      </Box>
      <Box>
        {items.map((item, idx) => (
          <SearchResult key={idx} index={idx} {...item} />
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
    </div>
  );
}

export default function Results() {
  return (
    <ResultsProvider>
      <Layout>
        <ResultsList />
      </Layout>
    </ResultsProvider>
  );
}
