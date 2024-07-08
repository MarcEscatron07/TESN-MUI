'use client';
import { Roboto } from 'next/font/google';
import { createTheme } from '@mui/material/styles';

const roboto = Roboto({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
});

const theme = createTheme({
    palette: {
        primary: {
            main: "#00703C"
        },
        secondary: {
            main: "#FBD11A"
        },
        accent1: {
            main: '#28166F'
        },
        accent2: {
            main: '#DA251D'
        },
        light: {
            main: '#FFFFFF'
        },
        dark: {
            main: '#000000'
        },
    },
    typography: {
        fontFamily: roboto.style.fontFamily,
    },
});

export default theme;
