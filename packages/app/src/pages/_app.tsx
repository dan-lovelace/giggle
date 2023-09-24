import { useMemo } from "react";

import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  useMediaQuery,
} from "@mui/material";
import type { AppProps } from "next/app";
import Head from "next/head";
import { QueryClient, QueryClientProvider } from "react-query";

import "../styles/index.css";
import { Spinner } from "../components/Spinner";
import { SearchDataProvider } from "../contexts/searchData";
import { ToastProvider } from "../contexts/toast";
import { useEngines } from "../hooks";
import { siteTitle } from "../lib/config";
import { themeComponents } from "../styles/muiTheme";

const queryClient = new QueryClient();

function AppContent({ Component, pageProps }: AppProps) {
  const {
    engines: { isLoading },
  } = useEngines();

  if (isLoading) {
    return <Spinner />;
  }

  return <Component {...pageProps} />;
}

export default function App(appProps: AppProps) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
        },
        components: themeComponents,
      }),
    [prefersDarkMode],
  );

  return (
    <>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ToastProvider>
            <SearchDataProvider>
              <AppContent {...appProps} />
            </SearchDataProvider>
          </ToastProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
}
