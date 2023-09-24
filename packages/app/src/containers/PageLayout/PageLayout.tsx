import { Box, Paper, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Link from "next/link";

import { Search } from "../../components/Search";
import { useSearchData } from "../../contexts/searchData";

export const siteTitle = "Giggle";

function HeaderLogo() {
  const { resetSearchInput } = useSearchData();

  const handleClick = () => {
    resetSearchInput();
  };

  return (
    <Box sx={{ fontSize: "2rem" }} onClick={handleClick}>
      <Link href="/">🚀</Link>
    </Box>
  );
}

export default function PageLayout({ children }) {
  const { breakpoints } = useTheme();
  const isLarge = useMediaQuery(breakpoints.up("md"));

  return (
    <>
      <Box component="header" sx={{ position: "sticky", top: 0 }}>
        <Paper
          sx={{
            display: "flex",
            alignItems: "center",
            px: 2,
            py: 1,
            borderBottomRightRadius: 0,
            borderBottomLeftRadius: 0,
          }}
          elevation={3}
        >
          <Stack direction="row" spacing={2} sx={{ width: "100%" }}>
            <HeaderLogo />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Search />
            </Box>
          </Stack>
        </Paper>
      </Box>
      <main className="h-full">
        <Box
          css={{
            padding: "1rem",
            paddingLeft: isLarge ? "4.25rem" : "1rem",
          }}
        >
          {children}
        </Box>
      </main>
    </>
  );
}
