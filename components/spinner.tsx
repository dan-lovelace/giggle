import { Box, CircularProgress } from "@mui/material";

export default function Spinner() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "fixed",
        width: "100%",
        height: "100%",
      }}
    >
      <CircularProgress />
    </Box>
  );
}
