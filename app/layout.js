import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import { Inter } from "next/font/google";

import theme from '@/app/styles/theme';
import { SITENAME_FULL, SITENAME_DESC } from '@/lib/variables';

import "./styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: SITENAME_FULL,
  description: SITENAME_DESC,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
