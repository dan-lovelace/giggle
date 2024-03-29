import { TGoogleResult } from "@giggle/types";
import { Box, Link, Stack, Typography } from "@mui/material";

export default function SearchResult({
  link,
  pagemap,
  snippet,
  title,
}: TGoogleResult) {
  const thumbnail = pagemap.cse_thumbnail?.[0];

  return (
    <Stack
      data-testid="search-result"
      direction="row"
      spacing={1}
      sx={{ mb: 2 }}
    >
      <Box
        sx={{
          minWidth: "60px",
          width: "60px",
          "& img": { marginTop: 1, width: "100%" },
        }}
      >
        {thumbnail && <img src={thumbnail.src} alt="result thumbnail" />}
      </Box>
      <Box>
        <Box>
          <Link href={link} sx={{ display: "inline-block" }}>
            <Typography variant="h6">{title}</Typography>
          </Link>
        </Box>
        <Box>
          <Link
            href={link}
            sx={{ color: "success.main", display: "inline-block" }}
          >
            <Typography
              variant="body2"
              sx={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "20rem",
              }}
            >
              {link}
            </Typography>
          </Link>
        </Box>
        <Typography color="text.secondary" variant="body2">
          {snippet}
        </Typography>
      </Box>
    </Stack>
  );
}
