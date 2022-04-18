import Head from "next/head";
import Link from "next/link";
import { Box, Container, Paper } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import Search from "./search";
import { useAppData } from "../contexts/appData";

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

export default function Layout({ children }) {
  const theme = useTheme();
  const isLarge = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <div>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>{siteTitle}</title>
        <meta
          name="description"
          content="A self-hosted, customizable and ad-free Google Search experience"
        />
        <meta name="og:title" content={siteTitle} />
      </Head>
      <header>
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
              justifyContent: "center",
            }}
          >
            <Search />
          </Box>
        </Paper>
      </header>
      <main className="h-full">
        <Box
          css={{ padding: "1rem", paddingLeft: isLarge ? "4.25rem" : "1rem" }}
        >
          {children}
        </Box>
      </main>
    </div>
  );
}
