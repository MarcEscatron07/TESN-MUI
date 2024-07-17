"use client";

import moment from 'moment-timezone';
moment().tz("Asia/Manila").format();

import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { Inter } from "next/font/google";

import theme from '@/app/styles/theme';
// import { SITENAME_FULL, SITENAME_DESC } from '@/lib/variables';

import "./styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
//   title: SITENAME_FULL,
//   description: SITENAME_DESC,
// };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              {children}
            </LocalizationProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
