import { Box, Typography } from "@mui/material";

import Search from "../components/search";

export default function Home() {
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
          <a
            href="https://programmablesearchengine.google.com/smart_sign_in"
            target="_blank"
          >
            Google Programmable Search Engine
          </a>{" "}
          to manage your engines
        </Typography>
      </Box>
    </Box>
  );
}
