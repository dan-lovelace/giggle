import { TGoogleItem } from "@giggle/types";
import { Box, Link, Typography } from "@mui/material";

export default function SearchResult({
  index,
  link,
  snippet,
  title,
}: TGoogleItem) {
  return (
    <Box
      data-testid={`search-result-${index}`}
      sx={{ marginBottom: "1rem", maxWidth: "41rem" }}
    >
      <Link href={link}>
        <Typography
          color="text.secondary"
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "20rem",
            display: "inline-block",
          }}
          variant="body2"
        >
          {link}
        </Typography>
      </Link>
      <br />
      <Link href={link}>
        <Typography variant="h6" sx={{ display: "inline-block" }}>
          {title}
        </Typography>
      </Link>
      <Typography color="text.secondary" variant="body2">
        {snippet}
      </Typography>
    </Box>
  );
}
