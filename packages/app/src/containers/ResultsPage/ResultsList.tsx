import { Box, Pagination, Typography, useTheme } from "@mui/material";

import { SearchResult } from "../../components/SearchResult";
import { useResultsData, useSearchData } from "../../contexts";

export default function ResultsList() {
  const {
    results: { items, metadata, pages, searchInformation },
    handlePageChange,
  } = useResultsData();
  const { searchInput } = useSearchData();
  const { breakpoints } = useTheme();

  return (
    <Box data-testid="results-list" sx={{ maxWidth: breakpoints.values.md }}>
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
