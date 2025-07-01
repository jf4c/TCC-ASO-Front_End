import { definePreset } from '@primeng/themes'
import Aura from '@primeng/themes/aura'

export const ASO = definePreset(Aura, {
  primitive: {
    yellow: {
      50: '#fdf8e7',
      100: '#f8eebf',
      200: '#f1df85',
      300: '#e7c84c',
      400: '#ddb93d',
      500: '#d4af37', // principal!
      600: '#b1902f',
      700: '#8e7228',
      800: '#6c541f',
      900: '#4a3715',
      950: '#2f240d',
    },
  },
  semantic: {
    primary: {
      50: '{yellow.50}',
      100: '{yellow.100}',
      200: '{yellow.200}',
      300: '{yellow.300}',
      400: '{yellow.400}',
      500: '{yellow.500}', // principal!
      600: '{yellow.600}',
      700: '{yellow.700}',
      800: '{yellow.800}',
      900: '{yellow.900}',
      950: '{yellow.950}',
    },
    secondary: {
      50: '{gray.50}',
      100: '{gray.100}',
      200: '{gray.200}',
      300: '{gray.300}',
      400: '{gray.400}',
      500: '{gray.500}', // secundario!
      600: '{gray.600}',
      700: '{gray.700}',
      800: '{gray.800}',
      900: '{gray.900}',
      950: '{gray.950}',
    },
  },
  components: {
    button: {
      colorScheme: {
        dark: {
          root: {
            secondary: {
              background: '{gray.500}',
              hoverBackground: '{gray.400}',
              activeBackground: '{gray.500}',
              borderColor: '{gray.500}',
              hoverBorderColor: '{gray.400}',
              activeBorderColor: '{gray.500}',
              color: '#000',
              hoverColor: '#000',
              activeColor: '#000',
              focusRing: {
                color: '{gray.500}',
                shadow: 'none',
              },
              label: {
                fontWeight: 'bold',
              },
            },
            danger: {
              background: '{red.600}',
              hoverBackground: '{red.500}',
              activeBackground: '{red.700}',
              borderColor: '{red.600}',
              hoverBorderColor: '{red.500}',
              activeBorderColor: '{red.700}',
              color: '#000',
              hoverColor: '#000',
              activeColor: '#000',
              focusRing: {
                color: '{red.500}',
                shadow: 'none',
              },
            },
          },
        },
      },
    },
  },
})
