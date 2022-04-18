import { QueryClient, QueryClientProvider, useQuery } from "react-query";

import "../styles/global.css";
import { AppDataProvider } from "../contexts/appData";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AppDataProvider>
        <Component {...pageProps} />
      </AppDataProvider>
    </QueryClientProvider>
  );
}
