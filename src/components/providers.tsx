'use client';

import { SessionProvider } from 'next-auth/react';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/theme';


// import { useState, useEffect } from 'react';

const Providers = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {

  return (
      <SessionProvider>
        <ThemeProvider theme={theme('light')}>
          <CssBaseline />
          {/* <Navbar mode={mode} setMode={setMode} /> */}
          {children}
        </ThemeProvider>
      </SessionProvider>
  );
};

export default Providers;
