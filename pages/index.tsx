import { Box, Link, Typography } from "@mui/material";
import { useRouter } from "next/router";

import Search from "../components/search";
import { useAppData } from "../contexts/appData";
import { ROUTES } from "../lib/routes";

export default function Home() {
  const { engines } = useAppData();
  const router = useRouter();

  if (!engines.length) {
    router.replace(ROUTES.ENGINES);
    return false;
  }

  return (
    <Box sx={{ textAlign: "center", padding: "5rem 1rem" }}>
      <Typography
        variant="h2"
        sx={{ mb: 2, fontWeight: "900", userSelect: "none" }}
      >
        <span css={{ color: "royalBlue" }}>G</span>
        <span css={{ color: "indianRed" }}>i</span>
        <span css={{ color: "#FFC300" }}>g</span>
        <span css={{ color: "royalBlue" }}>g</span>
        <span css={{ color: "seaGreen" }}>l</span>
        <span css={{ color: "indianRed" }}>e</span>
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 4,
        }}
      >
        <Search />
      </Box>
      <Box>
        <Typography>
          Visit{" "}
          <Link
            href="https://programmablesearchengine.google.com/smart_sign_in"
            target="_blank"
          >
            Google Programmable Search Engine
          </Link>{" "}
          to manage your engines
        </Typography>
      </Box>
    </Box>
  );
}
