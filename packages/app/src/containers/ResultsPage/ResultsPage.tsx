import ResultsList from "./ResultsList";
import { PageLayout } from "../../containers/PageLayout";
import { ResultsProvider } from "../../contexts";

export default function ResultsPage() {
  return (
    <ResultsProvider>
      <PageLayout>
        <ResultsList />
      </PageLayout>
    </ResultsProvider>
  );
}
