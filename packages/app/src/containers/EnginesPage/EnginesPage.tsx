import {
  Alert,
  AlertTitle,
  Box,
  Grid,
  Link,
  List,
  Typography,
  useTheme,
} from "@mui/material";

import AddEngineButton from "./AddEngineButton";
import EngineItem from "./EngineItem";
import { PageLayout } from "../../containers/PageLayout";
import { useEngines } from "../../hooks";
import { ROUTES } from "../../lib/routes";

export default function EnginesPage() {
  const {
    engines: { data },
  } = useEngines();
  const { breakpoints } = useTheme();

  return (
    <PageLayout>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Search Engines
      </Typography>
      {!data?.length ? (
        <Alert severity="info" sx={{ maxWidth: breakpoints.values.md }}>
          <AlertTitle>No engines</AlertTitle>
          You'll need to add at least one search engine to get started. Once
          you've created one in the{" "}
          <Link href={ROUTES.GOOGLE_PSE}>
            Google Programmable Search Engine
          </Link>{" "}
          console, click the button below to add it.
          <Box sx={{ mt: 2 }}>
            <AddEngineButton />
          </Box>
        </Alert>
      ) : (
        <Box sx={{ maxWidth: breakpoints.values.md }}>
          <List
            sx={{
              "& .MuiListItem-root:not(:last-child)": {
                borderBottom: "1px solid",
                borderColor: "divider",
              },
            }}
          >
            <Grid container item>
              <Grid item xs>
                <Typography variant="caption">Name</Typography>
              </Grid>
              <Grid item xs>
                <Typography variant="caption">Engine ID</Typography>
              </Grid>
              <Grid item xs>
                <Typography variant="caption">API Type</Typography>
              </Grid>
              <Grid item xs>
                <Typography variant="caption" hidden>
                  Actions
                </Typography>
              </Grid>
            </Grid>
            {data.map((engine) => (
              <EngineItem key={engine.identifier} {...engine} />
            ))}
          </List>
          <Box sx={{ mt: 1 }}>
            <AddEngineButton />
          </Box>
        </Box>
      )}
    </PageLayout>
  );
}
