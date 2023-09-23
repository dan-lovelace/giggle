import { Box, Paper } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Link from "next/link";

import Search from "../../components/search";
import { useAppData } from "../../contexts/appData";

export const siteTitle = "Giggle";

function HeaderLogo() {
  const { resetSearchInput } = useAppData();

  const handleClick = () => {
    resetSearchInput();
  };

  return (
    <Box sx={{ fontSize: "2rem", mr: 2 }} onClick={handleClick}>
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
            p: 2,
            borderBottomRightRadius: 0,
            borderBottomLeftRadius: 0,
          }}
          elevation={3}
        >
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
