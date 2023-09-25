import { Components, Theme } from "@mui/material";

export const themeComponents: Components<Omit<Theme, "components">> = {
  MuiButton: {
    styleOverrides: {
      root: {
        boxShadow: "none",
        textTransform: "none",
        "&:hover": {
          boxShadow: "none",
        },
      },
    },
  },
  MuiButtonBase: {
    defaultProps: { disableRipple: true },
  },
  MuiFormControlLabel: {
    styleOverrides: {
      root: {
        userSelect: "none",
      },
    },
  },
  MuiInputBase: {
    defaultProps: { autoComplete: "off" },
  },
};
