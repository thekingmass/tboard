import { alpha, createTheme } from "@mui/material/styles";

export const appTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1d4ed8",
      light: "#3b82f6",
      dark: "#1e3a8a",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#0f766e",
      light: "#14b8a6",
      dark: "#115e59",
      contrastText: "#ffffff",
    },
    background: {
      default: "#eef4ff",
      paper: "#ffffff",
    },
    text: {
      primary: "#0f172a",
      secondary: "#475569",
    },
  },
  shape: {
    borderRadius: 5,
  },
  typography: {
    fontFamily: '"Source Sans 3", system-ui, sans-serif',
    h1: {
      fontFamily: '"Work Sans", system-ui, sans-serif',
      fontWeight: 700,
      letterSpacing: "-0.04em",
    },
    h2: {
      fontFamily: '"Work Sans", system-ui, sans-serif',
      fontWeight: 700,
      letterSpacing: "-0.03em",
    },
    h3: {
      fontFamily: '"Work Sans", system-ui, sans-serif',
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h4: {
      fontFamily: '"Work Sans", system-ui, sans-serif',
      fontWeight: 700,
    },
    h5: {
      fontFamily: '"Work Sans", system-ui, sans-serif',
      fontWeight: 700,
    },
    h6: {
      fontFamily: '"Work Sans", system-ui, sans-serif',
      fontWeight: 700,
    },
    button: {
      fontWeight: 700,
      textTransform: "none",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          height: "100%",
        },
        body: {
          minHeight: "100%",
          background:
            "radial-gradient(circle at top, rgba(96, 165, 250, 0.22), transparent 34%), linear-gradient(180deg, #eef4ff 0%, #f8fafc 58%, #f6f8ec 100%)",
          color: "#0f172a",
        },
        "#root": {
          minHeight: "100vh",
        },
        a: {
          color: "inherit",
          textDecoration: "none",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 3,
          paddingInline: 18,
          '&.MuiButton-containedPrimary': {
            background: "linear-gradient(135deg, #1d4ed8 0%, #0ea5e9 100%)",
            boxShadow: "0 14px 30px rgba(29, 78, 216, 0.18)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 3,
          boxShadow: "0 16px 40px rgba(15, 23, 42, 0.08)",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 3,
          background: "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 3,
          backgroundColor: alpha("#ffffff", 0.82),
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 3,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0 14px 42px rgba(15, 23, 42, 0.14)",
        },
      },
    },
  },
});