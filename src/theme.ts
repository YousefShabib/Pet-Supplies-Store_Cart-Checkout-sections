import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1B5E3B',
      dark: '#004D40',
      light: '#2E7D4F',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#E67A35',
      dark: '#C45F1F',
      light: '#FF8A50',
      contrastText: '#ffffff',
    },
    background: {
      default: '#F7F7F5',
      paper: '#FFFFFF',
    },
    error: {
      main: '#D32F2F',
    },
    success: {
      main: '#1B5E3B',
    },
    text: {
      primary: '#1A1A1A',
      secondary: '#5F6368',
    },
    divider: '#E5E7EB',
  },
  typography: {
    fontFamily: 'Roboto, system-ui, sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    button: { fontWeight: 700, textTransform: 'none' },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: 20,
          paddingBlock: 10,
        },
        containedSecondary: {
          '&:hover': { backgroundColor: '#C45F1F' },
        },
        outlinedPrimary: {
          borderWidth: 2,
          '&:hover': { borderWidth: 2 },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid #E5E7EB',
          boxShadow: 'none',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: 'medium',
        variant: 'outlined',
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          backgroundColor: '#fff',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 12 },
      },
    },
  },
})
