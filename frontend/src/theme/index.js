import { createTheme, alpha } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb',
      light: '#3b82f6',
      dark: '#1d4ed8',
      contrastText: '#ffffff',
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    secondary: {
      main: '#0f172a',
      light: '#1e293b',
      dark: '#0f172a',
      contrastText: '#ffffff',
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    error: {
      main: '#dc2626',
      light: '#ef4444',
      dark: '#b91c1c',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
      contrastText: '#ffffff',
    },
    info: {
      main: '#0ea5e9',
      light: '#38bdf8',
      dark: '#0284c7',
      contrastText: '#ffffff',
    },
    success: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
      dark: '#0f172a',
      light: '#ffffff',
      neutral: '#f1f5f9',
    },
    text: {
      primary: '#0f172a',
      secondary: '#475569',
      disabled: '#94a3b8',
    },
    divider: alpha('#64748b', 0.08),
    action: {
      active: '#64748b',
      hover: alpha('#64748b', 0.04),
      selected: alpha('#64748b', 0.08),
      disabled: alpha('#64748b', 0.26),
      disabledBackground: alpha('#64748b', 0.12),
      focus: alpha('#64748b', 0.12),
    },
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Inter", "Roboto", sans-serif',
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightSemibold: 600,
    fontWeightBold: 700,
    h1: {
      fontWeight: 700,
      fontSize: '3.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      fontSize: '3rem',
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontWeight: 700,
      fontSize: '2.25rem',
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h4: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
      letterSpacing: '-0.01em',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.4,
      letterSpacing: '-0.01em',
    },
    subtitle1: {
      fontSize: '1.125rem',
      lineHeight: 1.5,
      letterSpacing: '-0.01em',
      fontWeight: 500,
    },
    subtitle2: {
      fontSize: '1rem',
      lineHeight: 1.5,
      letterSpacing: '-0.01em',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
      letterSpacing: '-0.01em',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      letterSpacing: '-0.01em',
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '-0.01em',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      letterSpacing: '0',
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 600,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 1px 2px rgba(15, 23, 42, 0.08)',
    '0px 2px 4px rgba(15, 23, 42, 0.08)',
    '0px 4px 8px rgba(15, 23, 42, 0.08)',
    '0px 8px 16px rgba(15, 23, 42, 0.08)',
    '0px 16px 24px rgba(15, 23, 42, 0.08)',
    '0px 24px 32px rgba(15, 23, 42, 0.08)',
    '0px 32px 40px rgba(15, 23, 42, 0.08)',
    '0px 40px 48px rgba(15, 23, 42, 0.08)',
    '0px 48px 56px rgba(15, 23, 42, 0.08)',
    '0px 56px 64px rgba(15, 23, 42, 0.08)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          boxSizing: 'border-box',
        },
        html: {
          MozOsxFontSmoothing: 'grayscale',
          WebkitFontSmoothing: 'antialiased',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100%',
          width: '100%',
        },
        body: {
          display: 'flex',
          flex: '1 1 auto',
          flexDirection: 'column',
          minHeight: '100%',
          width: '100%',
        },
        '#root': {
          display: 'flex',
          flex: '1 1 auto',
          flexDirection: 'column',
          height: '100%',
          width: '100%',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
          '&:active': {
            transform: 'scale(0.98)',
          },
        },
        contained: {
          boxShadow: '0px 1px 2px rgba(15, 23, 42, 0.08)',
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(15, 23, 42, 0.08)',
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          padding: 24,
          background: '#ffffff',
          border: `1px solid ${alpha('#64748b', 0.08)}`,
          boxShadow: '0px 4px 8px rgba(15, 23, 42, 0.08)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0px 12px 24px rgba(15, 23, 42, 0.08)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${alpha('#64748b', 0.08)}`,
          padding: '16px 24px',
        },
        head: {
          color: '#475569',
          fontWeight: 600,
          fontSize: '0.875rem',
          lineHeight: 1.5,
          letterSpacing: '-0.01em',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#f8fafc',
          '.MuiTableCell-root': {
            color: '#475569',
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:last-child td': {
            borderBottom: 0,
          },
          '&:hover': {
            backgroundColor: '#f8fafc',
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#3b82f6',
            borderWidth: 2,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderWidth: 2,
          },
        },
        notchedOutline: {
          borderColor: alpha('#64748b', 0.2),
          transition: 'all 0.2s ease-in-out',
        },
        input: {
          '&::placeholder': {
            color: '#94a3b8',
            opacity: 1,
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          boxShadow: '0px 24px 32px rgba(15, 23, 42, 0.08)',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: alpha('#64748b', 0.08),
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: 'none',
          color: '#2563eb',
          fontWeight: 500,
          '&:hover': {
            color: '#1d4ed8',
            textDecoration: 'none',
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&:hover': {
            backgroundColor: alpha('#64748b', 0.04),
          },
          '&.Mui-selected': {
            backgroundColor: alpha('#2563eb', 0.08),
            '&:hover': {
              backgroundColor: alpha('#2563eb', 0.12),
            },
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: '#64748b',
          minWidth: 40,
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          color: '#0f172a',
          fontSize: '0.875rem',
          fontWeight: 500,
          letterSpacing: '-0.01em',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
          letterSpacing: '-0.01em',
        },
        filled: {
          '&.MuiChip-colorPrimary': {
            backgroundColor: alpha('#2563eb', 0.08),
            color: '#2563eb',
          },
          '&.MuiChip-colorSecondary': {
            backgroundColor: alpha('#64748b', 0.08),
            color: '#64748b',
          },
          '&.MuiChip-colorSuccess': {
            backgroundColor: alpha('#10b981', 0.08),
            color: '#10b981',
          },
          '&.MuiChip-colorError': {
            backgroundColor: alpha('#dc2626', 0.08),
            color: '#dc2626',
          },
          '&.MuiChip-colorWarning': {
            backgroundColor: alpha('#f59e0b', 0.08),
            color: '#f59e0b',
          },
          '&.MuiChip-colorInfo': {
            backgroundColor: alpha('#0ea5e9', 0.08),
            color: '#0ea5e9',
          },
        },
      },
    },
  },
});

export default theme; 