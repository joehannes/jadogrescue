import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  colors: {
    brand: {
      50: '#FFF5F0',
      100: '#FFE6D9',
      200: '#FFCCA8',
      300: '#FFAD73',
      400: '#FF8A4D',
      500: '#FF6B35', // Primary CTA, energy
      600: '#E85A2D',
      700: '#C44527',
      800: '#9E3825',
      900: '#823023',
    },
    ocean: {
      50: '#E8F4F8',
      100: '#CCE4EF',
      200: '#99C4DF',
      300: '#66A3CF',
      400: '#3383BF',
      500: '#004E89', // Trust, secondary
      600: '#003E6E',
      700: '#002E52',
      800: '#001E37',
      900: '#000F1B',
    },
    tropical: {
      50: '#E8F6F3',
      100: '#CCEDE2',
      200: '#99DBC5',
      300: '#66C9A8',
      400: '#33B78B',
      500: '#1A936F', // Hope, accent
      600: '#147658',
      700: '#0F5942',
      800: '#0A3B2C',
      900: '#051E16',
    },
    sand: {
      50: '#FEFEFC',
      100: '#FAFAF5', // Background
      200: '#F4F4EB',
      300: '#EAEADF',
      400: '#DDDDB0',
      500: '#CCCC90',
      600: '#B3B370',
      700: '#999950',
      800: '#808030',
      900: '#666610',
    },
    coral: {
      50: '#FFF5F5',
      100: '#FFE8E8',
      200: '#FFD1D1',
      300: '#FFAAAA',
      400: '#FF7878',
      500: '#FF5050',
      600: '#E83A3A',
      700: '#C42828',
      800: '#9E1E1E',
      900: '#821818',
    },
    palm: {
      50: '#F0F7F4',
      100: '#DCEDE5',
      200: '#B9DBC9',
      300: '#96C9AD',
      400: '#73B791',
      500: '#50A575',
      600: '#40845D',
      700: '#306346',
      800: '#20422E',
      900: '#102117',
    },
  },
  fonts: {
    // Playfair Display: Elegant serif for main headings, titles, testimonials
    heading: "'Playfair Display', serif",
    // Poppins: Modern geometric sans for branding, navigation, CTAs, subheadings
    body: "'Inter', sans-serif",
    // Dancing Script: Handwritten for accents, quotes, signatures
    mono: "'JetBrains Mono', monospace",
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
    '7xl': '4.5rem',
    '8xl': '6rem',
  },
  styles: {
    global: {
      body: {
        bg: 'sand.100',
        color: 'gray.800',
        fontFamily: 'body',
        lineHeight: '1.7',
      },
      '::selection': {
        bg: 'brand.200',
        color: 'brand.900',
      },
      // Custom scrollbar
      '::-webkit-scrollbar': {
        width: '10px',
      },
      '::-webkit-scrollbar-track': {
        bg: 'sand.200',
      },
      '::-webkit-scrollbar-thumb': {
        bg: 'brand.300',
        borderRadius: 'full',
        _hover: {
          bg: 'brand.400',
        },
      },
    },
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'brand',
        borderRadius: 'full',
      },
      baseStyle: {
        fontWeight: '600',
        borderRadius: 'full',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        _hover: {
          transform: 'translateY(-3px)',
          boxShadow: 'xl',
        },
        _active: {
          transform: 'translateY(-1px)',
        },
      },
      variants: {
        solid: {
          bg: 'brand.500',
          color: 'white',
          _hover: {
            bg: 'brand.600',
          },
        },
        outline: {
          border: '2px solid',
          borderColor: 'brand.500',
          color: 'brand.500',
          _hover: {
            bg: 'brand.500',
            color: 'white',
          },
        },
        ghost: {
          _hover: {
            bg: 'brand.50',
          },
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: '3xl',
          boxShadow: 'lg',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          _hover: {
            boxShadow: '2xl',
            transform: 'translateY(-4px)',
          },
        },
      },
    },
    Badge: {
      baseStyle: {
        borderRadius: 'full',
        px: 4,
        py: 1.5,
        fontWeight: '600',
        textTransform: 'capitalize',
      },
    },
    Input: {
      defaultProps: {
        focusBorderColor: 'brand.500',
      },
      baseStyle: {
        field: {
          borderRadius: '2xl',
          py: 6,
        },
      },
    },
    Textarea: {
      defaultProps: {
        focusBorderColor: 'brand.500',
      },
      baseStyle: {
        borderRadius: '2xl',
        py: 4,
      },
    },
    Heading: {
      baseStyle: {
        fontWeight: '700',
        letterSpacing: '-0.02em',
      },
    },
    Link: {
      baseStyle: {
        transition: 'all 0.2s ease',
        _hover: {
          textDecoration: 'none',
          color: 'brand.500',
        },
      },
    },
  },
});

export default theme;
