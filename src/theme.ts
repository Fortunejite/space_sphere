import { Crimson_Text, Poppins } from 'next/font/google'
import { createTheme } from '@mui/material/styles'
import { PaletteMode } from '@mui/material'

export const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  display: 'swap',
  variable: '--font-poppins',
})

export const crimson = Crimson_Text({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
  variable: '--font-crimson',
})

const theme = (mode: PaletteMode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: '#0D47A1',        // deep indigo for trust & reliability
        dark: '#082970',
        light: '#5472d3',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#FF6F00',        // warm amber accent for CTAs
        dark: '#c43e00',
        light: '#ffa040',
        contrastText: '#212121',
      },
      background: {
        default: mode === 'light' ? '#F9FAFB' : '#121212',
        paper: mode === 'light' ? '#FFFFFF' : '#1E1E1E',
      },
      text: {
        primary: mode === 'light' ? '#212121' : '#EFEFEF',
        secondary: mode === 'light' ? '#555555' : '#BBBBBB',
      },
      error:   { main: '#D32F2F' },
      warning: { main: '#FFA000' },
      info:    { main: '#1976D2' },
      success: { main: '#388E3C' },
    },
    typography: {
      fontFamily: `var(--font-poppins), Arial, sans-serif`,
      h1: {
        fontFamily: `var(--font-crimson), serif`,
        fontWeight: 700,
        fontSize: '2.25rem',
        lineHeight: 1.2,
      },
      h2: {
        fontFamily: `var(--font-crimson), serif`,
        fontWeight: 600,
        fontSize: '1.75rem',
        lineHeight: 1.3,
      },
      h3: {
        fontWeight: 600,
        fontSize: '1.5rem',
        lineHeight: 1.4,
      },
      body1: {
        fontSize: '1rem',
        fontWeight: 400,
        lineHeight: 1.6,
      },
      body2: {
        fontSize: '0.875rem',
        fontWeight: 300,
        lineHeight: 1.5,
      },
      button: {
        fontWeight: 500,
        textTransform: 'none',
      },
      caption: {
        fontSize: '0.75rem',
        fontWeight: 300,
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          html: {
            fontFamily: 'var(--font-poppins)',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 6,
            padding: '10px 22px',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            },
          },
          containedPrimary: {
            backgroundImage: 'linear-gradient(135deg, #0D47A1 0%, #5472d3 100%)',
          },
          outlinedSecondary: {
            borderWidth: '2px',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          colorPrimary: {
            backgroundColor: '#FFFFFF',
            color: '#212121',
            boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
          },
        },
      },
      MuiLink: {
        styleOverrides: {
          root: {
            fontWeight: 500,
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline',
            },
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: 'outlined',
        },
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 6,
            },
          },
        },
      },
      MuiSnackbarContent: {
        styleOverrides: {
          root: {
            borderRadius: 6,
          },
        },
      },
    },
  })

export default theme