import Head from "next/head";
import Link from "next/link";
import { Box, Container, Paper } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import Search from "./search";
import { useAppData } from "../contexts/appData";

export const siteTitle = "Next.js Sample Website";

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
        <meta
          name="description"
          content="Learn how to build a personal website using Next.js"
        />
        <meta
          property="og:image"
          content={`https://og-image.vercel.app/${encodeURI(
            siteTitle
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.zeit.co%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
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
