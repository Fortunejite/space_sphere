import { Inter, Space_Grotesk } from 'next/font/google'
import { createTheme, alpha } from '@mui/material/styles'
import { PaletteMode } from '@mui/material'

export const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
})

export const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-space-grotesk',
  preload: true,
})

// Enhanced color palette for ShopSphere E-commerce Platform
const colors = {
  // Primary - Trust-inspiring indigo for reliability and professionalism
  primary: {
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1',  // Main primary - Modern indigo
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
  },
  // Secondary - Premium purple for luxury e-commerce feel
  secondary: {
    50: '#fdf4ff',
    100: '#fae8ff',
    200: '#f5d0fe',
    300: '#f0abfc',
    400: '#e879f9',
    500: '#d946ef',  // Main secondary - Vibrant purple
    600: '#c026d3',
    700: '#a21caf',
    800: '#86198f',
    900: '#701a75',
  },
  // Success - Fresh green for positive actions and confirmations
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',  // Main success - Fresh green
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  // Error - Sophisticated red for alerts and warnings
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',  // Main error - Modern red
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  // Warning - Warm amber for attention and caution
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',  // Main warning - Warm amber
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  // Info - Cool cyan for informational content
  info: {
    50: '#ecfeff',
    100: '#cffafe',
    200: '#a5f3fc',
    300: '#67e8f9',
    400: '#22d3ee',
    500: '#06b6d4',  // Main info - Cool cyan
    600: '#0891b2',
    700: '#0e7490',
    800: '#155e75',
    900: '#164e63',
  },
  // Neutral grays with warm undertones for better readability
  gray: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
  // E-commerce specific colors
  commerce: {
    // Price and discount colors
    price: '#059669',        // Green for regular prices
    discount: '#dc2626',     // Red for discounts/sales
    originalPrice: '#6b7280', // Gray for crossed-out prices
    // Status colors for orders/products
    inStock: '#059669',      // Green for in stock
    lowStock: '#d97706',     // Orange for low stock
    outOfStock: '#dc2626',   // Red for out of stock
    // Special badges
    newProduct: '#8b5cf6',   // Purple for new products
    bestseller: '#f59e0b',   // Amber for bestsellers
    featured: '#06b6d4',     // Cyan for featured items
  },
}

declare module '@mui/material/styles' {
  interface Palette {
    accent?: Palette['primary'];
    tertiary?: Palette['primary'];
  }

  interface PaletteOptions {
    accent?: PaletteOptions['primary'];
    tertiary?: PaletteOptions['primary'];
  }

  interface TypeBackground {
    elevated?: string;
    surface?: string;
    overlay?: string;
  }

  interface PaletteColor {
    50?: string;
    100?: string;
    200?: string;
    300?: string;
    400?: string;
    500?: string;
    600?: string;
    700?: string;
    800?: string;
    900?: string;
  }

  interface SimplePaletteColorOptions {
    50?: string;
    100?: string;
    200?: string;
    300?: string;
    400?: string;
    500?: string;
    600?: string;
    700?: string;
    800?: string;
    900?: string;
  }
}

const theme = (mode: PaletteMode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: colors.primary[500],
        light: colors.primary[400],
        dark: colors.primary[700],
        contrastText: '#ffffff',
        50: colors.primary[50],
        100: colors.primary[100],
        200: colors.primary[200],
        300: colors.primary[300],
        400: colors.primary[400],
        500: colors.primary[500],
        600: colors.primary[600],
        700: colors.primary[700],
        800: colors.primary[800],
        900: colors.primary[900],
      },
      secondary: {
        main: colors.secondary[500],
        light: colors.secondary[400],
        dark: colors.secondary[700],
        contrastText: '#ffffff',
        50: colors.secondary[50],
        100: colors.secondary[100],
        200: colors.secondary[200],
        300: colors.secondary[300],
        400: colors.secondary[400],
        500: colors.secondary[500],
        600: colors.secondary[600],
        700: colors.secondary[700],
        800: colors.secondary[800],
        900: colors.secondary[900],
      },
      accent: {
        main: '#FF6B35',      // Vibrant orange for CTAs
        light: '#FF8A5C',
        dark: '#E55A2E',
        contrastText: '#ffffff',
      },
      tertiary: {
        main: '#00D9FF',      // Electric blue for highlights
        light: '#33E1FF',
        dark: '#00B8DB',
        contrastText: '#000000',
      },
      error: {
        main: colors.error[500],
        light: colors.error[400],
        dark: colors.error[700],
        contrastText: '#ffffff',
      },
      warning: {
        main: colors.warning[500],
        light: colors.warning[400],
        dark: colors.warning[700],
        contrastText: '#000000',
      },
      info: {
        main: colors.info[500],
        light: colors.info[400],
        dark: colors.info[700],
        contrastText: '#ffffff',
      },
      success: {
        main: colors.success[500],
        light: colors.success[400],
        dark: colors.success[700],
        contrastText: '#ffffff',
      },
      background: {
        default: mode === 'light' ? '#fafafa' : '#0a0a0a',
        paper: mode === 'light' ? '#ffffff' : '#111111',
        elevated: mode === 'light' ? '#ffffff' : '#1a1a1a',
        surface: mode === 'light' ? '#f8fafc' : '#151515',
        overlay: mode === 'light' ? alpha('#000000', 0.5) : alpha('#ffffff', 0.1),
      },
      text: {
        primary: mode === 'light' ? colors.gray[900] : colors.gray[50],
        secondary: mode === 'light' ? colors.gray[600] : colors.gray[400],
        disabled: mode === 'light' ? colors.gray[400] : colors.gray[600],
      },
      divider: mode === 'light' ? alpha(colors.gray[200], 0.8) : alpha(colors.gray[700], 0.8),
      action: {
        hover: mode === 'light' ? alpha(colors.primary[500], 0.04) : alpha(colors.primary[400], 0.08),
        selected: mode === 'light' ? alpha(colors.primary[500], 0.08) : alpha(colors.primary[400], 0.12),
        disabled: mode === 'light' ? alpha(colors.gray[500], 0.3) : alpha(colors.gray[400], 0.3),
        disabledBackground: mode === 'light' ? alpha(colors.gray[500], 0.12) : alpha(colors.gray[400], 0.12),
      },
    },
    
    typography: {
      fontFamily: `var(--font-inter), system-ui, -apple-system, sans-serif`,
      
      // Display typography for hero sections
      h1: {
        fontFamily: `var(--font-space-grotesk), var(--font-inter), sans-serif`,
        fontWeight: 800,
        fontSize: 'clamp(2.5rem, 5vw, 4rem)',
        lineHeight: 1.1,
        letterSpacing: '-0.02em',
      },
      h2: {
        fontFamily: `var(--font-space-grotesk), var(--font-inter), sans-serif`,
        fontWeight: 700,
        fontSize: 'clamp(2rem, 4vw, 3rem)',
        lineHeight: 1.2,
        letterSpacing: '-0.01em',
      },
      h3: {
        fontFamily: `var(--font-space-grotesk), var(--font-inter), sans-serif`,
        fontWeight: 700,
        fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
        lineHeight: 1.3,
        letterSpacing: '-0.01em',
      },
      h4: {
        fontWeight: 700,
        fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
        lineHeight: 1.4,
        letterSpacing: '-0.005em',
      },
      h5: {
        fontWeight: 600,
        fontSize: 'clamp(1.125rem, 2vw, 1.5rem)',
        lineHeight: 1.4,
      },
      h6: {
        fontWeight: 600,
        fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
        lineHeight: 1.5,
      },
      
      // Body text
      body1: {
        fontSize: '1rem',
        fontWeight: 400,
        lineHeight: 1.6,
        letterSpacing: '0.01em',
      },
      body2: {
        fontSize: '0.875rem',
        fontWeight: 400,
        lineHeight: 1.5,
        letterSpacing: '0.01em',
      },
      
      // UI elements
      button: {
        fontWeight: 600,
        fontSize: '0.875rem',
        textTransform: 'none',
        letterSpacing: '0.025em',
      },
      caption: {
        fontSize: '0.75rem',
        fontWeight: 500,
        lineHeight: 1.4,
        letterSpacing: '0.025em',
      },
      overline: {
        fontSize: '0.75rem',
        fontWeight: 700,
        lineHeight: 1.2,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
      },
      subtitle1: {
        fontSize: '1rem',
        fontWeight: 500,
        lineHeight: 1.5,
        letterSpacing: '0.01em',
      },
      subtitle2: {
        fontSize: '0.875rem',
        fontWeight: 600,
        lineHeight: 1.4,
        letterSpacing: '0.025em',
      },
    },
    
    shape: {
      borderRadius: 12,
    },
    
    spacing: 8,
    
    shadows: [
      'none',
      '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
      '0 40px 70px -20px rgba(0, 0, 0, 0.35)',
      '0 50px 80px -25px rgba(0, 0, 0, 0.4)',
      '0 50px 80px -25px rgba(0, 0, 0, 0.4)',
      '0 50px 80px -25px rgba(0, 0, 0, 0.4)',
      '0 50px 80px -25px rgba(0, 0, 0, 0.4)',
      '0 50px 80px -25px rgba(0, 0, 0, 0.4)',
      '0 50px 80px -25px rgba(0, 0, 0, 0.4)',
      '0 50px 80px -25px rgba(0, 0, 0, 0.4)',
      '0 50px 80px -25px rgba(0, 0, 0, 0.4)',
      '0 50px 80px -25px rgba(0, 0, 0, 0.4)',
      '0 50px 80px -25px rgba(0, 0, 0, 0.4)',
      '0 50px 80px -25px rgba(0, 0, 0, 0.4)',
      '0 50px 80px -25px rgba(0, 0, 0, 0.4)',
      '0 50px 80px -25px rgba(0, 0, 0, 0.4)',
      '0 50px 80px -25px rgba(0, 0, 0, 0.4)',
      '0 50px 80px -25px rgba(0, 0, 0, 0.4)',
      '0 50px 80px -25px rgba(0, 0, 0, 0.4)',
    ],
    
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          html: {
            fontFamily: 'var(--font-inter)',
            scrollBehavior: 'smooth',
          },
          body: {
            fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
            fontVariantNumeric: 'lining-nums',
          },
          '*': {
            '&::-webkit-scrollbar': {
              width: '8px',
              height: '8px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: mode === 'light' ? colors.gray[100] : colors.gray[800],
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: mode === 'light' ? colors.gray[300] : colors.gray[600],
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: mode === 'light' ? colors.gray[400] : colors.gray[500],
              },
            },
          },
        },
      },
      
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            padding: '12px 24px',
            fontSize: '0.875rem',
            fontWeight: 600,
            textTransform: 'none',
            boxShadow: 'none',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              transform: 'translateY(-1px)',
            },
            '&:active': {
              transform: 'translateY(0)',
            },
          },
          contained: {
            fontWeight: 600,
            '&:hover': {
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
            },
          },
          containedPrimary: {
            background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.primary[600]} 100%)`,
            '&:hover': {
              background: `linear-gradient(135deg, ${colors.primary[600]} 0%, ${colors.primary[700]} 100%)`,
            },
          },
          containedSecondary: {
            background: `linear-gradient(135deg, ${colors.secondary[500]} 0%, ${colors.secondary[600]} 100%)`,
            '&:hover': {
              background: `linear-gradient(135deg, ${colors.secondary[600]} 0%, ${colors.secondary[700]} 100%)`,
            },
          },
          outlined: {
            borderWidth: '2px',
            '&:hover': {
              borderWidth: '2px',
              backgroundColor: alpha(colors.primary[500], 0.04),
            },
          },
          text: {
            '&:hover': {
              backgroundColor: alpha(colors.primary[500], 0.04),
            },
          },
          sizeSmall: {
            padding: '6px 16px',
            fontSize: '0.8125rem',
          },
          sizeLarge: {
            padding: '16px 32px',
            fontSize: '0.9375rem',
          },
        },
      },
      
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            border: `1px solid ${mode === 'light' ? alpha(colors.gray[200], 0.8) : alpha(colors.gray[700], 0.8)}`,
            boxShadow: mode === 'light' 
              ? '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)'
              : '0 4px 6px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.4)',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: mode === 'light'
                ? '0 10px 25px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)'
                : '0 10px 25px rgba(0,0,0,0.5), 0 4px 6px rgba(0,0,0,0.3)',
            },
          },
        },
      },
      
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            backgroundImage: 'none',
          },
          elevation1: {
            boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)',
          },
          elevation4: {
            boxShadow: '0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)',
          },
        },
      },
      
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'light' ? alpha('#ffffff', 0.8) : alpha('#000000', 0.8),
            backdropFilter: 'blur(20px)',
            borderBottom: `1px solid ${mode === 'light' ? alpha(colors.gray[200], 0.8) : alpha(colors.gray[700], 0.8)}`,
            boxShadow: 'none',
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
              borderRadius: 10,
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: colors.primary[400],
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderWidth: '2px',
                borderColor: colors.primary[500],
              },
            },
          },
        },
      },
      
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 500,
            fontSize: '0.8125rem',
          },
          filled: {
            '&.MuiChip-colorPrimary': {
              backgroundColor: colors.primary[100],
              color: colors.primary[800],
            },
            '&.MuiChip-colorSecondary': {
              backgroundColor: colors.secondary[100],
              color: colors.secondary[800],
            },
          },
        },
      },
      
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.875rem',
            minHeight: 48,
            '&.Mui-selected': {
              fontWeight: 700,
            },
          },
        },
      },
      
      MuiTabs: {
        styleOverrides: {
          indicator: {
            height: 3,
            borderRadius: '3px 3px 0 0',
            background: `linear-gradient(90deg, ${colors.primary[500]}, ${colors.secondary[500]})`,
          },
        },
      },
      
      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderRight: 'none',
            backgroundColor: mode === 'light' ? '#ffffff' : '#111111',
            boxShadow: '0 0 20px rgba(0,0,0,0.1)',
          },
        },
      },
      
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            margin: '2px 8px',
            '&:hover': {
              backgroundColor: alpha(colors.primary[500], 0.08),
            },
            '&.Mui-selected': {
              backgroundColor: alpha(colors.primary[500], 0.12),
              '&:hover': {
                backgroundColor: alpha(colors.primary[500], 0.16),
              },
            },
          },
        },
      },
      
      MuiAvatar: {
        styleOverrides: {
          root: {
            fontWeight: 600,
          },
        },
      },
      
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: mode === 'light' ? colors.gray[800] : colors.gray[200],
            color: mode === 'light' ? colors.gray[50] : colors.gray[800],
            fontSize: '0.75rem',
            fontWeight: 500,
            borderRadius: 6,
            padding: '8px 12px',
          },
        },
      },
      
      MuiSnackbar: {
        styleOverrides: {
          root: {
            '& .MuiSnackbarContent-root': {
              borderRadius: 10,
              fontWeight: 500,
            },
          },
        },
      },
    },
  })

export default theme