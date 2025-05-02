'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#BB86FC',
      light: '#D9B8FF',
      dark: '#9A67CC',
      contrastText: '#000000',
    },
    secondary: {
      main: '#03DAC6',
      light: '#66FFF9',
      dark: '#018786',
      contrastText: '#000000',
    },
    error: {
      main: '#CF6679',
      contrastText: '#000000',
    },
    success: {
      main: '#4CAF50',
      contrastText: '#000000',
    },
    warning: {
      main: '#FFA726',
      contrastText: '#000000',
    },
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
    text: {
      primary: '#E1E1E1',
      secondary: '#A0A0A0',
      disabled: '#6D6D6D',
    },
    divider: '#2D2D2D',
    action: {
      active: '#BB86FC',
      hover: 'rgba(187, 134, 252, 0.08)',
      selected: 'rgba(187, 134, 252, 0.16)',
    },
  },
});

export default theme;
