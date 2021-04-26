import { extendTheme, ThemeConfig } from '@chakra-ui/react';
import { Button } from '../styles/button';
import { Heading } from '../styles/heading';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const customTheme = extendTheme({
  config,
  colors: {
    gray: {
      50: '#EFEFF6',
      100: '#D4D2E5',
      200: '#B8B5D4',
      300: '#9C98C3',
      400: '#807BB2',
      500: '#645EA1',
      600: '#504B81',
      700: '#3C3960',
      800: '#24223A',
      900: '#141320',
    },
    purple: {
      50: '#dcc8f9',
      100: '#a36cef',
      200: '#8b47eb',
      300: '#7423e7',
      400: '#6116ca',
      500: '#901EF2',
      600: '#3e0e81',
      700: '#2C0A5C',
      800: '#180535',
      900: '#120425',
    },
    cyan: {
      50: '#E5FBFF',
      100: '#B8F3FF',
      200: '#8AEBFF',
      300: '#5CE3FF',
      400: '#2EDCFF',
      500: '#00D4FF',
      600: '#00AACC',
      700: '#007F99',
      800: '#005566',
      900: '#002A33',
    },
  },
  textStyles: {
    body: {
      fontFamily: 'Poppins, sans-serif',
    },
    heading: {
      fontFamily: 'Poppins, sans-serif',
    },
    mono: {
      fontFamily: 'Poppins, sans-serif',
    },
  },
  components: {
    Heading,
    Button,
  },
});

export default customTheme;
