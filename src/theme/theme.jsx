import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#FFCA00", // Yellow from the logo
      light: "#FFD633",
      dark: "#B28900",
      contrastText: "#000000", // Black for contrast
    },
    secondary: {
      main: "#000000", // Black from the logo
      light: "#333333",
      dark: "#000000",
      contrastText: "#FFFFFF", // White for contrast
    },
    background: {
      default: "#fffcf4", // White for clean look
      paper: "#fff",
    },
    text: {
      primary: "#000000", // Black for primary text
      secondary: "#4F4F4F", // Dark gray for secondary text
    },
  },
  typography: {
    fontFamily: [
      "Inter",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
      color: "#000000", // Black for headings
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 700,
      color: "#000000",
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 600,
      color: "#000000",
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 600,
      color: "#000000",
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 600,
      color: "#000000",
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 600,
      color: "#000000",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
        },
        containedPrimary: {
          backgroundColor: "#FFCA00",
          "&:hover": {
            backgroundColor: "#B28900",
          },
        },
        containedSecondary: {
          backgroundColor: "#000000",
          "&:hover": {
            backgroundColor: "#333333",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },
  },
});

export default theme;
