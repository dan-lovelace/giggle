import { useMemo } from "react";

import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  useMediaQuery,
} from "@mui/material";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";

import { AppDataProvider } from "../contexts/appData";
import { ToastProvider } from "../contexts/toast";
import { themeComponents } from "../styles/muiTheme";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
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
            <Component {...pageProps} />
          </AppDataProvider>
        </ToastProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
