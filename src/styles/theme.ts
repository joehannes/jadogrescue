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
  },
  fonts: {
    heading: "'Poppins', sans-serif",
    body: "'Inter', sans-serif",
  },
  styles: {
    global: {
      body: {
        bg: 'sand.100',
        color: 'gray.800',
      },
    },
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'brand',
        borderRadius: 'xl',
      },
      baseStyle: {
        fontWeight: '600',
        borderRadius: 'xl',
        transition: 'all 0.2s ease-in-out',
        _hover: {
          transform: 'translateY(-2px)',
          boxShadow: 'lg',
        },
        _active: {
          transform: 'translateY(0)',
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: '2xl',
          boxShadow: 'md',
          overflow: 'hidden',
        },
      },
    },
    Badge: {
      baseStyle: {
        borderRadius: 'full',
        px: 3,
        py: 1,
        fontWeight: '600',
      },
    },
    Input: {
      defaultProps: {
        focusBorderColor: 'brand.500',
      },
      baseStyle: {
        field: {
          borderRadius: 'xl',
        },
      },
    },
    Textarea: {
      defaultProps: {
        focusBorderColor: 'brand.500',
      },
      baseStyle: {
        borderRadius: 'xl',
      },
    },
  },
});

export default theme;
