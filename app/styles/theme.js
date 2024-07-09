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
            main: "#00703C",
            light: "#699B7E",
            dark: '#015930',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: "#FBD11A",
            light: "#FFDD47",
            dark: '#DBB71A',
            contrastText: '#000000',
        },
        accent1: {
            main: '#28166F',
            light: "#3D259C",
            dark: '#1D104F',
            contrastText: '#FFFFFF',
        },
        accent2: {
            main: '#DA251D',
            light: "#D63E38",
            dark: '#B52019',
            contrastText: '#FFFFFF',
        },
        light: {
            main: '#FFFFFF',
        },
        dark: {
            main: '#000000',
        },
    },
    typography: {
        fontFamily: roboto.style.fontFamily,
    },
});

export default theme;
