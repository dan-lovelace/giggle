import { useMemo } from "react";

import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  useMediaQuery,
} from "@mui/material";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";

import "../styles/index.css";
import Spinner from "../components/spinner";
import { AppDataProvider } from "../contexts/appData";
import { ToastProvider } from "../contexts/toast";
import { useEngines } from "../hooks";
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
          // mode: prefersDarkMode ? "dark" : "light",
          // ...(prefersDarkMode
          //   ? {
          //       primary: {
          //         main: "#A8DADC",
          //       },
          //     }
          //   : {
          //       primary: {
          //         main: "#457B9D",
          //       },
          //     }),
        },
        components: themeComponents,
      }),
    [prefersDarkMode],
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ToastProvider>
          <AppDataProvider>
            <AppContent {...appProps} />
          </AppDataProvider>
        </ToastProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
