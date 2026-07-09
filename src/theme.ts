import { createTheme } from "@mui/material/styles";

// ponytail: dark theme + CssBaseline pins the page background so MUI
// surfaces (Snackbar, Paper, Card) never flash light-theme white during
// re-renders.
export const theme = createTheme({
  palette: {
    mode: "dark",
    background: { default: "#111827", paper: "#1f2937" },
  },
components: {
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          border: "1px solid",
          borderColor: "rgba(255, 255, 255, 0.12)",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: { transition: "none" },
      },
    },
    MuiTextField: {
      defaultProps: {
        InputProps: { style: { color: "white" } },
        InputLabelProps: { style: { color: "#9ca3af" } },
      },
    },
  },
});
