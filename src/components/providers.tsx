'use client';

import { SessionProvider } from 'next-auth/react';

// import { ThemeProvider } from '@mui/material/styles';
// import CssBaseline from '@mui/material/CssBaseline';

// import { useState, useEffect } from 'react';

const Providers = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {

  return (
      <SessionProvider>
        { /* <ThemeProvider theme={theme(mode)}>
          <CssBaseline />
          <Navbar mode={mode} setMode={setMode} />
        </ThemeProvider> */}
          {children}
      </SessionProvider>
  );
};

export default Providers;
